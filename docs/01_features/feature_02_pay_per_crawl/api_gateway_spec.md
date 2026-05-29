# Feature 02: Pay per Crawl — APIゲートウェイ仕様

> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. アーキテクチャ概要

```
[AI事業者クローラー]
      ↓ HTTPS (X-HackII-API-Key付き)
[HackⅡ APIゲートウェイ（Cloudflare Workers）]
      ├── 認証検証（APIキー）
      ├── レートリミット（Redis）
      ├── 課金イベント記録（非同期）
      └── リクエストをオリジンサーバーへプロキシ
      ↓
[コンテンツ提供者のWebサーバー]
      ↓ レスポンス
[HackⅡ APIゲートウェイ]
      ├── レスポンスサイズ記録（トークン換算）
      └── AI事業者へレスポンスを転送
```

**ゲートウェイはリバースプロキシとして動作する。**  
コンテンツ提供者はDNSをHackⅡゲートウェイに向けるだけで導入完了。

---

## 2. ゲートウェイAPIエンドポイント

**ベースURL:** `https://gw.hackii.jp/v1`

### 2-1. サイト登録（コンテンツ提供者向け）

#### `POST /sites`
コンテンツ提供者がサイトをゲートウェイに登録する。

**リクエスト:**
```json
{
  "domain": "example.com",
  "owner_email": "owner@example.com",
  "plan": "standard",
  "pricing_overrides": {
    "openai_gpt": 1.5,
    "google_gemini": 1.0
  }
}
```

**レスポンス:**
```json
{
  "site_id": "site_abc123",
  "gateway_cname": "site-abc123.gw.hackii.jp",
  "dns_instruction": "CNAMEレコードを site-abc123.gw.hackii.jp に向けてください"
}
```

---

### 2-2. APIキー管理（AI事業者向け）

#### `POST /api-keys`
AI事業者がAPIキーを発行する（HackⅡ管理者が承認後に有効化）。

**リクエスト:**
```json
{
  "company_name": "OpenAI, Inc.",
  "contact_email": "api@openai.com",
  "crawler_models": ["openai_gpt"],
  "expected_monthly_crawls": 1000000,
  "billing_plan": "monthly_invoice"
}
```

**レスポンス:**
```json
{
  "api_key_id": "key_xxxxxxxx",
  "api_key": "hk_live_xxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "pending_approval",
  "free_tier_limit": 1000
}
```

---

### 2-3. 課金イベント照会（AI事業者向け）

#### `GET /billing/usage`
今月の使用量・課金額を確認する。

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|---|------|
| `from` | ISO8601 | 開始日 |
| `to` | ISO8601 | 終了日 |

**レスポンス:**
```json
{
  "period": { "from": "2026-05-01", "to": "2026-05-25" },
  "total_crawls": 42180,
  "free_tier_used": 1000,
  "billable_crawls": 41180,
  "estimated_charge_jpy": 49416,
  "breakdown_by_site": [
    {
      "site_domain": "example.com",
      "crawls": 18420,
      "charge_jpy": 22104
    }
  ]
}
```

---

### 2-4. 精算レポート（コンテンツ提供者向け）

#### `GET /revenue/report`
月次収益レポートを取得する。

**レスポンス:**
```json
{
  "month": "2026-05",
  "total_crawls_billed": 3420,
  "gross_revenue_jpy": 4104,
  "platform_fee_jpy": 1231,
  "net_payout_jpy": 2873,
  "payout_status": "scheduled",
  "payout_date": "2026-06-30",
  "breakdown_by_model": {
    "openai_gpt": { "crawls": 2100, "revenue_jpy": 2520 },
    "google_gemini": { "crawls": 800, "revenue_jpy": 960 },
    "perplexity": { "crawls": 520, "revenue_jpy": 624 }
  }
}
```

---

## 3. ゲートウェイの動作フロー（詳細）

### 3-1. リクエスト処理フロー

```
1. リクエスト受信
   - X-HackII-API-Key の存在チェック
   - ヘッダーなし → 通常Webリクエストとして処理（課金なし）

2. APIキー認証
   - Redisでキーの有効性・ステータスを確認
   - 無効 → 401 Unauthorized（オリジンへの転送は行う）

3. レートリミット確認
   - Redisで当月の課金済みクロール数を確認
   - 無料枠内 → 課金イベントを「free」として記録
   - 超過 → 課金イベントを「billable」として記録

4. リクエストをオリジンへプロキシ
   - タイムアウト: 30秒
   - X-Forwarded-For にクローラーIPを追加

5. レスポンス取得
   - Content-Length または body.byteLength を記録
   - トークン換算（4文字≒1トークン）

6. 課金イベントをキューへ非同期送信（レスポンス遅延に影響させない）
   - キュー: SQS or Cloudflare Queue

7. レスポンスをクローラーへ転送
   - X-HackII-Crawl-Id: crw_xxxxxxxx（デバッグ用）
   - X-HackII-Charge-Status: free or billable
```

### 3-2. 課金イベントスキーマ（キュー送信データ）

```json
{
  "event_type": "crawl_billed",
  "crawl_id": "crw_xxxxxxxx",
  "timestamp": "2026-05-25T10:30:00Z",
  "api_key_id": "key_xxxxxxxx",
  "site_id": "site_abc123",
  "url_path": "/news/llmo-guide/",
  "crawler_model": "openai_gpt",
  "crawler_type": "inference",
  "status_code": 200,
  "response_bytes": 45231,
  "estimated_tokens": 11307,
  "charge_type": "billable",
  "unit_price_jpy": 1.95,
  "request_id": "req_xxxxxxxx"
}
```

---

## 4. レートリミット仕様

| 対象 | 制限 | 超過時の動作 |
|------|------|------------|
| APIキー別 | 60 req/sec | 429 Too Many Requests |
| サイト別（被クロール） | 200 req/sec | スロットリング（遅延）|
| IPアドレス別 | 100 req/min | 429 |

**Retry-After ヘッダーを必ず返すこと。**

---

## 5. Webhook通知仕様

### 5-1. コンテンツ提供者向けWebhook

課金イベントをリアルタイムで通知する。

**登録方法:** ダッシュボードのWebhook設定から URL を登録

**ペイロード例:**
```json
{
  "event": "crawl.billed",
  "timestamp": "2026-05-25T10:30:00Z",
  "data": {
    "crawl_id": "crw_xxxxxxxx",
    "crawler_model": "openai_gpt",
    "url": "/news/llmo-guide/",
    "charge_jpy": 1.95,
    "your_share_jpy": 1.365
  }
}
```

**署名検証:** `X-HackII-Signature` ヘッダーにHMAC-SHA256署名を付与。

---

## 6. インフラ要件

| 項目 | 要件 |
|------|------|
| デプロイ先 | Cloudflare Workers（エッジ）推奨 |
| レイテンシ | ゲートウェイ追加遅延 < 10ms (p99) |
| 可用性 | 99.99%（Cloudflare SLA準拠） |
| キャッシュ | 課金処理はキャッシュ不可。コンテンツはCDNキャッシュ可 |
| TLS | TLS 1.2 以上必須 |

---

## 7. 受け入れ条件

- [ ] APIキーなしのクロールはオリジンにそのままプロキシされ、課金イベントは記録されないこと
- [ ] ゲートウェイの追加レイテンシが p99 で 10ms 以内であること
- [ ] 同一 request_id は24時間以内に1回のみ課金イベントが記録されること（冪等性）
- [ ] Webhook 署名を検証するサンプルコード（Node.js）が提供されること
- [ ] 月次レポートCSVがダッシュボードからダウンロードできること
