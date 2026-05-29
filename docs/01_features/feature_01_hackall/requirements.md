# Feature 01: Hackall（ハカル）— 要件定義書

> 機能コードネーム: Hackall  
> 役割: AIクローリング計測・可視化  
> 優先度: Phase 1（最優先）  
> 作成日: 2026-05-25  
> バージョン: 1.0

---

## 1. 機能概要

### 1-1. 解決すべき課題

現状、企業のWebサイトがいつ・どのAIにクロールされているかを把握する手段がない。

```
既存ツールの限界:
  Google Analytics 4 → AIクローラーのbot流入は計測対象外
  Google Search Console → 検索インデックス状況のみ（AI引用は非対象）
  サーバーアクセスログ → 生ログは存在するが、AIエージェント別の集計・可視化ができない
```

**Hackallが解決すること:**
- AIクローラーのアクセスを、モデル別・ページ別・時系列でリアルタイム計測する
- GA4で「direct」に埋もれるAIアプリ内ブラウザからのユーザー流入を識別・分離する
- 「AIに読まれている」から「AIに成約させている」までの全ファネルを可視化する

---

### 1-2. 機能スコープ（In-scope / Out-of-scope）

**In-scope（本機能に含む）:**
- AIクローラーのアクセスログ収集（User-Agent識別）
- クローラー種別・アクセス先URL・タイムスタンプの記録
- ダッシュボードUI（モデル別・ページ別・時系列グラフ）
- AI経由ユーザー流入の識別・分離（ハカル計測タグ）
- アラート通知（新規AIモデル検知・異常アクセス数検知）

**Out-of-scope（本機能に含まない）:**
- クローラーのブロック・制御 → Feature 03 (Tsukull) の担当
- 課金処理 → Feature 02 (Pay per Crawl) の担当
- AIパッチファイル生成 → Feature 04 (Misell) の担当

---

## 2. AIクローラー識別定義

### 2-1. 対象AIクローラー一覧（識別テーブル v1.0）

| User-Agent パターン | AIモデル / 企業 | 分類 | 優先度 |
|-------------------|----------------|------|--------|
| `GPTBot` | OpenAI GPT系（学習クローラー） | 学習型 | 高 |
| `ChatGPT-User` | ChatGPT プラグイン | 推論型 | 高 |
| `OAI-SearchBot` | ChatGPT 検索 | 推論型 | 高 |
| `ClaudeBot` | Anthropic Claude（学習クローラー） | 学習型 | 高 |
| `Claude-Web` | Claude Web版 | 推論型 | 高 |
| `anthropic-ai` | Anthropic 汎用 | 学習型 | 高 |
| `Google-Extended` | Google Gemini 学習 | 学習型 | 高 |
| `Google-GeminiBot` | Gemini 推論 | 推論型 | 高 |
| `Googlebot` | Google 検索インデックス | 検索型 | 中 |
| `PerplexityBot` | Perplexity AI | 推論型 | 高 |
| `Bingbot` | Microsoft/Copilot | 検索型 | 中 |
| `MicrosoftPreview` | Copilot プレビュー | 推論型 | 中 |
| `Meta-ExternalAgent` | Meta AI | 推論型 | 中 |
| `CCBot` | CommonCrawl（学習データ） | 学習型 | 中 |
| `Applebot` | Apple Siri / AI | 推論型 | 低 |
| `DuckAssistBot` | DuckDuckGo AI | 推論型 | 低 |
| `YouBot` | You.com | 推論型 | 低 |

**識別ロジック:** User-Agentの部分一致（`contains`）で判定。大文字小文字を無視する。

### 2-2. AIモデル種別の分類

| 分類 | 定義 | 計測上の意味 |
|------|------|------------|
| **学習型** | AIモデルの学習データ収集目的のクローラー | 将来の回答精度に影響する（間接的効果） |
| **推論型** | ユーザーの質問に回答するためリアルタイムでアクセスするクローラー | 現在の回答・引用に直接影響する（直接的効果） |
| **検索型** | 検索エンジンのインデックス目的のクローラー | SEO文脈で重要（参考計測） |

---

## 3. 計測タグ仕様（クライアントサイド）

### 3-1. Hackall 計測タグ（JavaScript）

顧客サイトの `<head>` タグに1行設置するだけで計測を開始するスクリプト。

**設置方法:**
```html
<script async src="https://cdn.hackii.jp/hackall.min.js" data-site-id="YOUR_SITE_ID"></script>
```

**タグが計測すること:**
1. ページビュー（全ページ）
2. リファラー解析（AIプラットフォーム固有パターン検知）
3. UTMパラメータ解析（AI経由キャンペーン識別）
4. 行動シグナル取得（滞在時間・スクロール深度・クリック）

**AI経由ユーザーの識別ロジック:**

```
Step 1: リファラーチェック
  - referer が chat.openai.com / perplexity.ai / gemini.google.com 等 → AI確定

Step 2: UTMパラメータチェック
  - utm_source が "chatgpt" / "perplexity" / "gemini" 等 → AI確定

Step 3: 行動パターン判定（direct流入の分離）
  - referer が空（direct）かつ
  - 滞在時間が通常direct平均の±1.5σ内 かつ
  - 特定コンテンツページへの直接着地 → AI経由probable（信頼度スコア付与）
```

### 3-2. 計測イベント定義

| イベント名 | トリガー | 送信データ |
|-----------|---------|-----------|
| `page_view` | ページロード | url, title, timestamp, session_id |
| `ai_referral` | AI経由リファラー確定 | ai_source, url, session_id |
| `ai_probable` | AI経由推定（direct分離） | confidence_score, url, session_id |
| `conversion` | お問い合わせフォーム送信 | form_type, url, session_id |
| `scroll_depth` | 25/50/75/100%スクロール | depth, url, session_id |
| `cta_click` | CTAボタンクリック | cta_label, url, session_id |

---

## 4. サーバーサイド計測仕様

### 4-1. Webサーバーログ収集エージェント

顧客サーバーのアクセスログを収集・解析するエージェント（オプション）。

**対応ログ形式:**
- Combined Log Format（Apache/Nginx標準）
- JSON形式ログ（Cloudflare、Fastly等CDN）
- Webサーバーがない場合はDNSレベル計測も検討

**収集フィールド:**
```
timestamp       : ISO 8601形式
ip_address      : IPv4/IPv6（ハッシュ化して保存。生IPは保持しない）
user_agent      : 生文字列（識別処理後はパターンのみ保持）
request_method  : GET / HEAD / POST
request_url     : パス部分のみ（クエリパラメータは別フィールド）
status_code     : HTTPステータスコード
response_size   : バイト数
referer         : リファラーURL（ドメインのみ保持）
```

### 4-2. リアルタイム処理パイプライン

```
[顧客Webサーバー]
    ↓ ログストリーム（Webhook or エージェント）
[Hackall API（エッジ）]
    ↓ User-Agent識別 → AIクローラー判定
    ↓ 正規化・エンリッチメント
[イベントキュー（Kafka or SQS）]
    ↓ 集計処理
[時系列DB（TimescaleDB or ClickHouse）]
    ↓ 
[ダッシュボードAPI]
    ↓
[フロントエンド（React）]
```

---

## 5. ダッシュボード要件

### 5-1. 必須表示項目

**概要パネル（サマリー）:**
- 過去7日間のAIクローラーアクセス総数
- モデル別アクセス数（棒グラフ）
- 最も多くクロールされたページTop 10
- AI経由ユーザーのコンバージョン数

**詳細ビュー:**
- タイムライン（時系列折れ線グラフ）— 時間粒度: 時間 / 日 / 週
- ページ別クロール頻度ヒートマップ
- AIモデル別クロール比率（ドーナツグラフ）
- AI経由ユーザーのファネル（流入 → 閲覧 → CTA → 成約）

### 5-2. アラート要件

| アラート種別 | 発火条件 | 通知方法 |
|-----------|---------|---------|
| 新規AIモデル検知 | 未知のUser-Agentが識別テーブルにヒット | メール + Slack |
| 異常クロール数 | 1時間のクロール数が前週同曜日比 300% 超 | メール + Slack |
| クロール未検知 | 48時間以上Googlebot以外のAIクロールなし | メール |
| コンバージョン達成 | AI経由ユーザーがお問い合わせ完了 | Slack（リアルタイム） |

---

## 6. データ保持・プライバシー要件

| 項目 | 要件 |
|------|------|
| ログ保持期間 | 生ログ: 90日間, 集計データ: 2年間 |
| IPアドレス | 収集時にハッシュ化。生IPは保持しない |
| ユーザーID | セッションIDのみ（個人識別情報は収集しない） |
| 準拠法 | GDPR / 個人情報保護法に準拠 |
| Cookieレス | フィンガープリントベースの識別も実装予定（Cookie依存しない設計を推奨） |

---

## 7. 受け入れ条件（Acceptance Criteria）

- [ ] 識別テーブルに掲載された全User-Agentを正確に識別できること（テストスイート合格）
- [ ] アクセスログからAIクローラーイベントを1秒以内にダッシュボードに反映できること
- [ ] 計測タグをHTMLに設置するだけで（設定不要で）基本計測が動作すること
- [ ] ダッシュボードのページロード時間が3秒以内であること
- [ ] IPハッシュ化が必ずログ記録前に実行されること（生IP保持なし）
- [ ] API エンドポイントが99.9%以上のSLAを満たすこと

---

## 8. 関連ドキュメント

- `feature_01_hackall/api_log_spec.md` — APIエンドポイント仕様・ログデータ構造
- `feature_03_tsukull/access_control.md` — 識別結果を制御に使う場合の仕様
- `feature_02_pay_per_crawl/api_gateway_spec.md` — 計測データを課金に連携する場合の仕様
- `docs/patent-reference.md` — 技術特許性の整理（A-3: AI検索流入識別・計測システム）
