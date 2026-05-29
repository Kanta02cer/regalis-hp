# Feature 01: Hackall — APIエンドポイント・ログデータ仕様

> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. APIエンドポイント一覧

**ベースURL:** `https://api.hackii.jp/v1`  
**認証:** Bearer Token（JWT） + API Key（`X-Site-Id` ヘッダー）

### 1-1. イベント収集API

#### `POST /events`
計測タグからのイベントを受信するエンドポイント。

**リクエスト:**
```json
{
  "site_id": "site_abc123",
  "event": "page_view",
  "url": "https://example.com/blog/llmo-guide/",
  "timestamp": "2026-05-25T10:30:00Z",
  "session_id": "sess_xxxxxxxx",
  "referrer_domain": "chat.openai.com",
  "ai_source": "chatgpt",
  "user_agent_hash": "sha256:xxxxxxxx"
}
```

**レスポンス:**
```json
{ "status": "ok", "event_id": "evt_xxxxxxxx" }
```

**レート制限:** 1サイトあたり 10,000 req/min

---

#### `POST /crawl-events`
サーバーサイドのクローラー検知イベントを受信するエンドポイント。

**リクエスト:**
```json
{
  "site_id": "site_abc123",
  "timestamp": "2026-05-25T10:30:00Z",
  "crawler_ua_pattern": "GPTBot",
  "crawler_model": "openai_gpt",
  "crawler_type": "learning",
  "url_path": "/news/llmo-guide/",
  "status_code": 200,
  "response_bytes": 45231,
  "ip_hash": "sha256:xxxxxxxx"
}
```

**レスポンス:**
```json
{ "status": "ok", "crawl_event_id": "crw_xxxxxxxx" }
```

---

### 1-2. データ取得API（ダッシュボード用）

#### `GET /dashboard/summary`
7日間のサマリー統計を返す。

**クエリパラメータ:**
| パラメータ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `site_id` | string | 必須 | サイトID |
| `days` | integer | 7 | 集計期間（1/7/30/90） |

**レスポンス:**
```json
{
  "period": { "from": "2026-05-18", "to": "2026-05-25" },
  "total_crawls": 1842,
  "unique_ai_models": 6,
  "ai_user_visits": 234,
  "ai_conversions": 12,
  "top_crawled_pages": [
    { "url": "/news/llmo-guide/", "crawls": 342 },
    { "url": "/hackii/", "crawls": 287 }
  ],
  "model_breakdown": {
    "openai_gpt": 721,
    "google_gemini": 498,
    "anthropic_claude": 312,
    "perplexity": 187,
    "microsoft_copilot": 124
  }
}
```

---

#### `GET /dashboard/timeline`
時系列データを返す。

**クエリパラメータ:**
| パラメータ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `site_id` | string | 必須 | サイトID |
| `from` | ISO8601 | 必須 | 開始日時 |
| `to` | ISO8601 | 必須 | 終了日時 |
| `granularity` | string | `day` | `hour` / `day` / `week` |
| `model` | string | `all` | 絞り込むAIモデル名 |

**レスポンス:**
```json
{
  "granularity": "day",
  "data": [
    { "date": "2026-05-18", "crawls": 241, "ai_visits": 28 },
    { "date": "2026-05-19", "crawls": 318, "ai_visits": 34 }
  ]
}
```

---

#### `GET /dashboard/pages`
ページ別クロール統計を返す。

**レスポンス:**
```json
{
  "pages": [
    {
      "url": "/news/llmo-guide/",
      "total_crawls": 342,
      "model_breakdown": {
        "openai_gpt": 145,
        "google_gemini": 98
      },
      "last_crawled_at": "2026-05-25T09:12:00Z",
      "ai_user_conversions": 3
    }
  ]
}
```

---

#### `GET /dashboard/funnel`
AI流入からコンバージョンまでのファネルデータを返す。

**レスポンス:**
```json
{
  "funnel": [
    { "stage": "ai_crawled", "count": 1842, "rate": 1.0 },
    { "stage": "ai_user_visit", "count": 234, "rate": 0.127 },
    { "stage": "cta_click", "count": 89, "rate": 0.380 },
    { "stage": "form_submit", "count": 12, "rate": 0.135 }
  ]
}
```

---

### 1-3. アラート設定API

#### `POST /alerts`
アラートルールを登録する。

**リクエスト:**
```json
{
  "site_id": "site_abc123",
  "alert_type": "new_crawler_detected",
  "notify_via": ["email", "slack"],
  "email": "kanta@regalis-order-suits.com",
  "slack_webhook": "https://hooks.slack.com/..."
}
```

---

## 2. ログデータスキーマ

### 2-1. crawl_events テーブル（PostgreSQL）

```sql
CREATE TABLE crawl_events (
  id              BIGSERIAL PRIMARY KEY,
  site_id         VARCHAR(32) NOT NULL,
  timestamp       TIMESTAMPTZ NOT NULL,
  crawler_ua_raw  TEXT,                        -- 元User-Agent文字列（30日後に削除）
  crawler_ua_pattern VARCHAR(64),              -- マッチしたパターン名（例: "GPTBot"）
  crawler_model   VARCHAR(32),                 -- 識別モデル名（例: "openai_gpt"）
  crawler_type    VARCHAR(16),                 -- "learning" / "inference" / "search"
  url_path        TEXT NOT NULL,
  query_params    JSONB,
  status_code     SMALLINT,
  response_bytes  INTEGER,
  ip_hash         CHAR(64),                    -- SHA-256ハッシュ（生IPは保持しない）
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crawl_events_site_time ON crawl_events(site_id, timestamp DESC);
CREATE INDEX idx_crawl_events_model ON crawl_events(crawler_model);
```

### 2-2. user_events テーブル

```sql
CREATE TABLE user_events (
  id              BIGSERIAL PRIMARY KEY,
  site_id         VARCHAR(32) NOT NULL,
  session_id      VARCHAR(64) NOT NULL,
  event_type      VARCHAR(32) NOT NULL,        -- "page_view" / "cta_click" / "conversion" 等
  url             TEXT NOT NULL,
  ai_source       VARCHAR(32),                 -- "chatgpt" / "perplexity" 等（確定時のみ）
  ai_confidence   NUMERIC(3,2),               -- 0.00〜1.00（推定時の信頼度）
  referrer_domain VARCHAR(256),
  scroll_depth    SMALLINT,                    -- 0〜100
  session_duration INTEGER,                    -- 秒
  timestamp       TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2-3. alerts テーブル

```sql
CREATE TABLE alerts (
  id              BIGSERIAL PRIMARY KEY,
  site_id         VARCHAR(32) NOT NULL,
  alert_type      VARCHAR(64) NOT NULL,
  triggered_at    TIMESTAMPTZ NOT NULL,
  payload         JSONB,
  notified        BOOLEAN DEFAULT FALSE
);
```

---

## 3. User-Agent識別ライブラリ仕様

### 3-1. 識別関数シグネチャ（TypeScript）

```typescript
interface CrawlerIdentity {
  matched: boolean;
  ua_pattern: string | null;      // マッチしたパターン（例: "GPTBot"）
  model: string | null;           // 識別モデル（例: "openai_gpt"）
  type: 'learning' | 'inference' | 'search' | 'unknown';
  confidence: number;             // 0.0〜1.0
}

function identifyCrawler(userAgent: string): CrawlerIdentity;
```

### 3-2. 識別テーブル（JSON形式）

```json
[
  {
    "pattern": "GPTBot",
    "match_type": "contains",
    "case_sensitive": false,
    "model": "openai_gpt",
    "type": "learning",
    "confidence": 1.0
  },
  {
    "pattern": "ChatGPT-User",
    "match_type": "contains",
    "case_sensitive": false,
    "model": "openai_gpt",
    "type": "inference",
    "confidence": 1.0
  },
  {
    "pattern": "ClaudeBot",
    "match_type": "contains",
    "case_sensitive": false,
    "model": "anthropic_claude",
    "type": "learning",
    "confidence": 1.0
  }
]
```

**注意:** 識別テーブルはAPIサーバーから動的に取得し、クライアントライブラリを更新せずに識別定義を拡張できる設計にすること。

---

## 4. エラーコード一覧

| コード | HTTPステータス | 意味 |
|--------|-------------|------|
| `ERR_INVALID_SITE_ID` | 401 | site_idが存在しない or 権限なし |
| `ERR_RATE_LIMIT` | 429 | レート制限超過 |
| `ERR_INVALID_PAYLOAD` | 400 | リクエストボディのバリデーションエラー |
| `ERR_INTERNAL` | 500 | サーバー内部エラー |
