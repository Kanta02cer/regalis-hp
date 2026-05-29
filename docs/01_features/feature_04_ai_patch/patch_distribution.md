# Feature 04: AIパッチ — 配布・管理フロー仕様

> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. 配布アーキテクチャ全体像

```
[コンテンツ提供者のCMS / リポジトリ]
      ↓ Webhook / GitHub Actions / API push
[HackⅡ Misell パイプライン]
      ↓ AICS™スコアリング + パッチ生成
[パッチストレージ（S3 or R2）]
      ↓
[CDN（Cloudflare）]
      ↓
[配信先]
  ├── AIクローラー（GPTBot / ClaudeBot 等）
  ├── HackⅡ ダッシュボード（スコア可視化）
  └── コンテンツ提供者（パッチファイルをサイトに設置）
```

---

## 2. トリガー別配布フロー

### 2-1. GitHub Actions 連携（SSGサイト向け）

Jekyll/Hugo等の静的サイトジェネレーターを使う場合の標準フロー。

**ワークフロー定義（`.github/workflows/ai-patch-update.yml`）:**

```yaml
name: HackⅡ AIパッチ更新

on:
  push:
    branches: [main]
    paths:
      - '_news/**/*.md'
      - '_posts/**/*.md'
      - 'index.html'

jobs:
  update-ai-patch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      # 変更されたMarkdownファイルを検出
      - name: Detect changed articles
        id: changed
        run: |
          CHANGED=$(git diff HEAD~1 HEAD --name-only | grep -E '\.(md)$' || true)
          echo "files=${CHANGED}" >> $GITHUB_OUTPUT

      # HackⅡ Misell APIを呼び出してパッチ生成
      - name: Generate AI Patches
        if: steps.changed.outputs.files != ''
        env:
          HACKII_API_KEY: ${{ secrets.HACKII_API_KEY }}
          HACKII_SITE_ID: ${{ secrets.HACKII_SITE_ID }}
        run: |
          curl -X POST https://api.hackii.jp/v1/patches/generate \
            -H "Authorization: Bearer $HACKII_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "site_id": "${{ secrets.HACKII_SITE_ID }}",
              "changed_files": ${{ toJSON(steps.changed.outputs.files) }},
              "full_rebuild": false
            }'

      # IndexNow でBingに即時通知
      - name: Notify Bing via IndexNow
        run: |
          curl -X POST https://api.indexnow.org/indexnow \
            -H "Content-Type: application/json" \
            -d '{
              "host": "${{ vars.SITE_DOMAIN }}",
              "key": "${{ secrets.INDEXNOW_KEY }}",
              "urlList": ["https://${{ vars.SITE_DOMAIN }}/llms.txt"]
            }'
```

### 2-2. WordPress Webhook連携

WordPressで記事を公開・更新した際に自動でパッチを更新する。

**Webhook受信エンドポイント:**

```
POST https://api.hackii.jp/v1/webhooks/wordpress
```

**ペイロード（WordPress が送信）:**

```json
{
  "event": "post_published",
  "post_id": 12345,
  "post_url": "https://example.com/news/llmo-guide/",
  "post_type": "post",
  "secret": "wp_webhook_secret_xxxxxxxx"
}
```

**HackⅡの処理:**
1. secret を検証
2. 記事URLからコンテンツをフェッチ（WordPressがブロックしていない場合はREST API経由）
3. AICS™スコアリング + パッチ生成
4. 配布（CDN更新 + IndexNow通知）

### 2-3. API直接呼び出し（任意CMS向け）

CMS非依存のAPIインターフェース：

**エンドポイント:** `POST /v1/patches/generate`

**リクエスト（コンテンツを直接送信する場合）:**
```json
{
  "site_id": "site_abc123",
  "articles": [
    {
      "slug": "llmo-towa",
      "title": "LLMOとは？",
      "content_markdown": "## LLMOとは...",
      "frontmatter": {
        "date": "2026-05-25",
        "category": "サービス",
        "keywords": "LLMO,AI検索最適化",
        "ai_summary": "LLMOとは..."
      }
    }
  ]
}
```

**レスポンス:**
```json
{
  "job_id": "job_xxxxxxxx",
  "status": "processing",
  "estimated_completion": "2026-05-25T10:30:15Z",
  "webhook_url": "https://api.hackii.jp/v1/jobs/job_xxxxxxxx"
}
```

---

## 3. パッチファイルの配布・ホスティング方式

### 3-1. Option A: HackⅡホスティング（推奨）

HackⅡのCDN上でパッチファイルを管理・配信する。

```
顧客サイト（example.com）
  ↓ DNS CNAME または HTMLタグ
HackⅡ CDN（cdn.hackii.jp）
  ↓
パッチファイル配信:
  cdn.hackii.jp/sites/site_abc123/llms.txt
  cdn.hackii.jp/sites/site_abc123/llms-chatgpt.txt
  cdn.hackii.jp/sites/site_abc123/ai-patch.json
  cdn.hackii.jp/sites/site_abc123/ai-patch/articles/{slug}-ai-patch.json
```

**設定方法（ヘッダー追加）:**
```html
<!-- AIクローラーに最適化ファイルのURLを案内 -->
<link rel="ai-patch" href="https://cdn.hackii.jp/sites/site_abc123/ai-patch.json">
```

**メリット:**
- 顧客サイトのリポジトリに変更不要
- CDNによる高速配信
- HackⅡが一元管理・自動更新

**デメリット:**
- 顧客サイトのURLではなく `cdn.hackii.jp` からの配信になる

### 3-2. Option B: 顧客サーバーへの同期配置

生成したパッチファイルを顧客サーバーのルートに設置する。

**ファイルレイアウト（顧客サイト）:**
```
/（ドキュメントルート）
├── llms.txt                           ← 自動更新
├── llms-chatgpt.txt                   ← 自動更新
├── llms-claude.txt                    ← 自動更新
├── llms-gemini.txt                    ← 自動更新
├── ai-patch.json                      ← 自動更新
└── ai-patch/
    └── articles/
        ├── llmo-towa-ai-patch.json
        └── ...
```

**同期方式:**
- GitHub Actions でコミット・プッシュ（SSGサイト向け）
- SFTP/SCP でサーバー直接アップロード
- Cloudflare Pages / Vercel の Deploy Hook

### 3-3. ファイルキャッシュ戦略

```
llms.txt 系ファイル:
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400
  （1時間キャッシュ。コンテンツ更新は最長24時間後に反映）

個別記事パッチJSON:
  Cache-Control: public, max-age=86400
  （24時間キャッシュ）

ai-patch.json（マスターマニフェスト）:
  Cache-Control: public, max-age=300
  （5分キャッシュ。更新頻度が高いため短め）
```

---

## 4. 自動更新パイプライン詳細

### 4-1. 全体フロー

```
コンテンツ更新（新記事公開 / 既存記事編集）
        ↓
[トリガー検知]
  GitHub push / WordPress Webhook / API call
        ↓
[変更ファイル特定]
  git diff で差分ファイル一覧取得
        ↓
[コンテンツ取得]
  Markdown読み込み or API経由フェッチ
        ↓
[パッチ生成（並列処理）]
  ├── AICS™スコアリング
  ├── 引用トリガー抽出
  ├── 改善アクション生成
  └── 個別記事パッチJSON生成
        ↓
[集計ファイル更新]
  ├── llms.txt（最新記事リスト更新）
  ├── aio-scores.json（全記事スコア集計）
  └── ai-patch.json（マスターマニフェスト更新）
        ↓
[配布]
  ├── CDN/ストレージへアップロード
  ├── 顧客サーバーへ同期（Option B の場合）
  └── IndexNow API で Bing に即時通知
        ↓
[Webhook通知（顧客へ）]
  {
    "event": "patch_updated",
    "articles_updated": ["llmo-towa"],
    "new_scores": { "llmo-towa": { "total": 88, "grade": "A" } },
    "llms_txt_updated": true
  }
        ↓
[ダッシュボード反映]
  スコア変化・グレード変化をリアルタイム表示
```

### 4-2. エラーハンドリング

| エラー種別 | 対処 |
|-----------|------|
| コンテンツフェッチ失敗 | 3回リトライ（指数バックオフ）後にアラート通知 |
| スコアリング異常値（<0 or >100） | クランプ処理して警告ログ。処理は継続 |
| ファイルアップロード失敗 | リトライキューに追加。管理者にアラート |
| パッチ生成タイムアウト（>60秒） | タイムアウトエラーとして記録。部分的な結果は保存 |

---

## 5. スコアモニタリング・レポート

### 5-1. ダッシュボードで確認できる指標

| 指標 | 更新頻度 | 説明 |
|------|---------|------|
| 全記事平均AIOスコア | パッチ更新時 | サイト全体のAI最適化レベル |
| グレード分布 | パッチ更新時 | S+/S/A/B/C/D 件数 |
| スコアトレンド（過去30日） | 日次 | スコアの改善・悪化傾向 |
| 最低スコア記事Top 10 | パッチ更新時 | 優先改善対象の特定 |
| 改善アクション一覧 | パッチ更新時 | 実装すべき改善項目リスト |

### 5-2. 自動改善提案メール

週次でスコアの低い記事・改善アクションをメールでレポート：

```
件名: [HackⅡ] 週次AIOスコアレポート — example.com

今週のサマリー:
  平均スコア: 82pt（先週比 +3pt）
  改善対象: 5記事（Cグレード以下）

要改善 Top 3:
  1. 「DXとは？」— 58pt (D) — D4権威シグナルを追加してください
  2. 「Web開発料金」— 62pt (C) — FAQPage JSON-LDが未設定です
  3. 「SEO対策入門」— 65pt (C) — 定義型文章を追加してください

[ダッシュボードで詳細を確認する]
```

---

## 6. 受け入れ条件

- [ ] コンテンツ更新から15分以内にパッチファイルが更新されること
- [ ] GitHub Actions ワークフローが提供され、新規サイトに30分以内に設定できること
- [ ] WordPress Webhook が署名検証付きで動作すること
- [ ] IndexNow 通知が `llms.txt` 更新後に自動送信されること
- [ ] パッチ生成エラー時にダッシュボードとメールでアラートが届くこと
- [ ] 100記事を一括再生成した場合に60秒以内に完了すること
- [ ] 週次スコアレポートメールが毎週月曜 08:00 JST に送信されること
