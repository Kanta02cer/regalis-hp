# システムアーキテクチャ・ER図
## HackⅡ — AIクローリング・エコシステム

> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. システムアーキテクチャ図

### 1-1. 全体インフラ構成

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  インターネット側
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [AIクローラー]          [顧客ブラウザ]          [Regalis管理者]
  GPTBot/ClaudeBot等      （ダッシュボード利用）    （システム管理）
       |                        |                       |
       ↓                        ↓                       ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cloudflare（CDN・WAF・DDoS保護）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       |
       ├──[gw.hackii.jp]───────────────────────────────────────┐
       │   Cloudflare Workers（APIゲートウェイ）                │
       │   ・User-Agent識別（Tsukull）                         │
       │   ・課金イベント記録（Pay per Crawl）                  │
       │   ・コンテンツプロキシ                                 │
       │                        ↓                             │
       ├──[api.hackii.jp]───────────────────────────────────────┤
       │   メインAPIサーバー（AWS ECS / Fargate）               │
       │   ・Hackall API（ログ収集・ダッシュボード）            │
       │   ・Misell API（パッチ生成・配布）                     │
       │   ・認証・課金管理                                     │
       │                        │                             │
       │           ┌────────────┼────────────┐                │
       │           ↓            ↓            ↓                │
       │    [PostgreSQL]     [Redis]      [S3/R2]             │
       │    メインDB          キャッシュ    パッチファイル       │
       │    ログ・課金・ユーザー レートリミット  ストレージ       │
       │                        │                             │
       │           ┌────────────┘                             │
       │           ↓                                          │
       │    [SQS / Cloudflare Queue]                          │
       │    非同期ジョブキュー                                  │
       │    ・課金イベント処理                                  │
       │    ・パッチ生成ジョブ                                  │
       │                                                      │
       └──[cdn.hackii.jp]────────────────────────────────────┘
           パッチファイルCDN配信
           llms.txt / ai-patch.json 等
```

### 1-2. データフロー詳細

```
① クローラーアクセスフロー（Hackall + Tsukull）
   ─────────────────────────────────────────
   AIクローラー → gw.hackii.jp（Workers）
      → User-Agent識別
      → Tsukullポリシー照合（Redis）
      ↓（allow/allow_optimized）
      → 顧客オリジンサーバーへプロキシ
      → クロールイベントをキューへ非同期送信
      → キュー処理 → PostgreSQL + ダッシュボード反映

② ユーザー流入計測フロー（Hackall タグ）
   ─────────────────────────────────────────
   人間ユーザー（AIアプリから来訪）
      → 顧客サイト（hackall.min.js が埋め込まれている）
      → タグがリファラー/行動シグナルを解析
      → api.hackii.jp/v1/events へ送信
      → PostgreSQL記録 → ダッシュボード反映

③ パッチ生成フロー（Misell）
   ─────────────────────────────────────────
   コンテンツ更新（GitHub push / WordPress Webhook）
      → api.hackii.jp/v1/patches/generate
      → SQSジョブキューへ投入
      → Misellワーカー（ECS）がジョブを取得
        → コンテンツパース → AICS™スコアリング
        → パッチJSON / llms.txt生成
        → S3/R2へアップロード
        → CDNキャッシュをパージ
        → IndexNow API → Bing通知
        → 顧客へWebhook送信

④ 課金フロー（Pay per Crawl）
   ─────────────────────────────────────────
   AIクローラー（X-HackII-API-Key付き）
      → gw.hackii.jp（Workers）
      → APIキー認証（Redis）
      → 無料枠チェック（Redis counter）
      → 課金イベントをキューへ送信
      → 月次バッチで集計 → 請求書生成
```

---

## 2. ER図（データベース設計）

### 2-1. 主要テーブル関係

```
┌─────────────────┐       ┌─────────────────┐
│    accounts     │       │      sites      │
│─────────────────│       │─────────────────│
│ id (PK)         │──1:N──│ id (PK)         │
│ email           │       │ account_id (FK) │
│ plan            │       │ domain          │
│ created_at      │       │ site_name       │
└─────────────────┘       │ gateway_cname   │
                          │ plan            │
                          │ created_at      │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ↓                    ↓                    ↓
┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│  crawl_events   │  │   user_events   │  │  ai_patch_jobs   │
│─────────────────│  │─────────────────│  │──────────────────│
│ id (PK)         │  │ id (PK)         │  │ id (PK)          │
│ site_id (FK)    │  │ site_id (FK)    │  │ site_id (FK)     │
│ timestamp       │  │ session_id      │  │ article_slug     │
│ crawler_model   │  │ event_type      │  │ status           │
│ crawler_type    │  │ url             │  │ aics_score       │
│ url_path        │  │ ai_source       │  │ grade            │
│ status_code     │  │ ai_confidence   │  │ patch_url        │
│ response_bytes  │  │ scroll_depth    │  │ generated_at     │
│ ip_hash         │  │ timestamp       │  │ created_at       │
│ charge_type     │  └─────────────────┘  └──────────────────┘
│ charge_jpy      │
└─────────────────┘
         │
         │ N:1
         ↓
┌─────────────────┐       ┌─────────────────┐
│   api_keys      │       │  billing_items  │
│─────────────────│       │─────────────────│
│ id (PK)         │──1:N──│ id (PK)         │
│ company_name    │       │ api_key_id (FK) │
│ contact_email   │       │ site_id (FK)    │
│ key_hash        │       │ crawl_event_id  │
│ status          │       │ billed_at       │
│ free_tier_limit │       │ charge_jpy      │
│ monthly_usage   │       │ month_key       │
│ created_at      │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ tsukull_policies│       │  alert_rules    │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ site_id (FK)    │       │ site_id (FK)    │
│ crawler_model   │       │ alert_type      │
│ action          │       │ notify_via      │
│ rate_limit      │       │ notify_target   │
│ optimized_file  │       │ is_active       │
│ updated_at      │       │ created_at      │
└─────────────────┘       └─────────────────┘
```

### 2-2. テーブル設計詳細

#### `accounts`（顧客アカウント）
```sql
CREATE TABLE accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(256) UNIQUE NOT NULL,
  name        VARCHAR(256) NOT NULL,
  plan        VARCHAR(32) NOT NULL DEFAULT 'starter',
  -- plan: 'starter' / 'standard' / 'enterprise'
  stripe_customer_id VARCHAR(64),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `sites`（顧客サイト）
```sql
CREATE TABLE sites (
  id              VARCHAR(32) PRIMARY KEY,  -- site_abc123 形式
  account_id      UUID NOT NULL REFERENCES accounts(id),
  domain          VARCHAR(256) NOT NULL UNIQUE,
  display_name    VARCHAR(256),
  gateway_cname   VARCHAR(256) UNIQUE,
  default_policy  VARCHAR(16) NOT NULL DEFAULT 'allow',
  hackall_tag_active BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `crawl_events`（クローラーアクセスログ）
```sql
CREATE TABLE crawl_events (
  id              BIGSERIAL PRIMARY KEY,
  site_id         VARCHAR(32) NOT NULL REFERENCES sites(id),
  timestamp       TIMESTAMPTZ NOT NULL,
  crawler_ua_raw  TEXT,               -- 30日後にNULL化
  crawler_ua_pattern VARCHAR(64),
  crawler_model   VARCHAR(32),
  crawler_type    VARCHAR(16),        -- 'learning'/'inference'/'search'
  url_path        TEXT NOT NULL,
  query_params    JSONB,
  status_code     SMALLINT,
  response_bytes  INTEGER,
  ip_hash         CHAR(64),
  api_key_id      UUID REFERENCES api_keys(id),
  charge_type     VARCHAR(16),        -- 'free'/'billable'/NULL
  charge_jpy      NUMERIC(10,2),
  request_id      VARCHAR(64) UNIQUE  -- 冪等性保証
) PARTITION BY RANGE (timestamp);    -- 月次パーティション

CREATE INDEX ON crawl_events(site_id, timestamp DESC);
CREATE INDEX ON crawl_events(crawler_model, timestamp DESC);
CREATE INDEX ON crawl_events(api_key_id) WHERE api_key_id IS NOT NULL;
```

---

## 3. コンポーネント図（モジュール分割）

```
hackii-platform/
├── apps/
│   ├── gateway/          # Cloudflare Workers（Tsukull + Pay per Crawl）
│   │   ├── src/
│   │   │   ├── identify.ts       # User-Agent識別エンジン
│   │   │   ├── policy.ts         # ポリシー判定ロジック
│   │   │   ├── billing.ts        # 課金イベント記録
│   │   │   └── proxy.ts          # オリジンへのプロキシ
│   │   └── wrangler.toml
│   │
│   ├── api/              # メインAPIサーバー（Node.js / Fastify）
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── events.ts     # Hackall イベント収集
│   │   │   │   ├── dashboard.ts  # ダッシュボードデータ取得
│   │   │   │   ├── patches.ts    # Misell パッチ生成トリガー
│   │   │   │   ├── billing.ts    # Pay per Crawl 課金API
│   │   │   │   └── sites.ts      # サイト・ポリシー管理
│   │   │   ├── workers/
│   │   │   │   └── patch-generator.ts  # Misellワーカー
│   │   │   └── lib/
│   │   │       ├── aics-scorer.ts      # AICS™スコアリング
│   │   │       ├── citation-extractor.ts # 引用トリガー抽出
│   │   │       └── llms-generator.ts   # llms.txt生成
│   │   └── Dockerfile
│   │
│   └── dashboard/        # フロントエンド（Next.js / React）
│       ├── src/
│       │   ├── pages/
│       │   │   ├── overview.tsx  # サマリーダッシュボード
│       │   │   ├── crawlers.tsx  # クローラー詳細
│       │   │   ├── patches.tsx   # AIパッチ管理
│       │   │   ├── control.tsx   # Tsukull制御設定
│       │   │   └── billing.tsx   # 収益・課金
│       │   └── components/
│       └── package.json
│
├── packages/
│   ├── crawler-ids/      # User-Agent識別テーブル（共有パッケージ）
│   ├── aics-core/        # AICS™スコアリングコア（共有パッケージ）
│   └── hackall-tag/      # 計測タグ（顧客サイト埋め込み用JS）
│
└── infra/
    ├── terraform/        # AWS インフラ定義
    └── github-actions/   # CI/CDワークフロー
```

---

## 4. 技術スタック決定表

| レイヤー | 採用技術 | 選定理由 | 代替案 |
|---------|---------|---------|-------|
| エッジ処理 | Cloudflare Workers | 低レイテンシ・グローバル展開・無料枠大 | AWS Lambda@Edge |
| APIサーバー | Node.js + Fastify | 高スループット・TypeScript統一 | Go / Rust |
| フロントエンド | Next.js 15 | SSR+CSR混在・Vercelとの親和性 | Remix / SvelteKit |
| メインDB | PostgreSQL 16 | 複雑クエリ・パーティション・実績 | MySQL |
| キャッシュ | Redis 7 | レートリミット・セッション管理 | Valkey |
| ジョブキュー | SQS or Cloudflare Queue | 非同期処理・信頼性 | BullMQ |
| ファイルストレージ | Cloudflare R2 | egress無料・S3互換 | AWS S3 |
| CDN | Cloudflare | 既存インフラ統合 | Fastly |
| 監視 | Datadog or Grafana Cloud | APM + ログ + アラート統合 | New Relic |
| CI/CD | GitHub Actions | 既存リポジトリとの統合 | CircleCI |
