# Feature 03: Tsukull（ツクル）— AIエージェント制御・アクセスコントロール仕様

> 機能コードネーム: Tsukull  
> 役割: 不要なAIからのアクセスを制御・ブロック、適正なインデックスを促す  
> 優先度: Phase 2  
> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. 機能概要

### 1-1. 解決すべき課題

AIクローラーが全て「好ましい」わけではない。以下の問題が存在する：

| 問題 | 具体例 | 影響 |
|------|--------|------|
| **サーバー負荷** | CCBot等が大量クロールし帯域を圧迫 | サイト表示速度低下 |
| **学習データ無断利用** | 意図しないAIモデルが商用学習データに利用 | 知的財産侵害リスク |
| **競合AIへの情報提供** | 自社サービスの競合に当たるAIに最適化データを渡す | 競争上の不利益 |
| **スクレイピング bot** | AIに偽装したデータ収集bot | コンテンツ盗用 |

Tsukullはこれらを「**誰に・何を・どのように見せるか**」をコンテンツ提供者が制御できるダッシュボードとして実装する。

---

## 2. 制御ポリシーの定義

### 2-1. 制御アクション一覧

| アクション | 動作 | 用途 |
|-----------|------|------|
| `allow` | 通常通りアクセスさせる | デフォルト |
| `allow_optimized` | モデル別最適化ファイルを優先配信 | HackⅡ推奨クローラーに最適コンテンツを提供 |
| `throttle` | レートリミットをかけてアクセスを制限 | 負荷対策（完全ブロックはしない） |
| `block` | 403 Forbidden を返す | 不要なAIを完全ブロック |
| `redirect` | 指定URLへリダイレクト | 専用ページに誘導 |
| `honeypot` | 偽コンテンツページへ誘導（上級者向け） | スクレイパー検知・トラップ |

### 2-2. デフォルト制御ポリシー（HackⅡ推奨設定）

```yaml
# HackⅡ デフォルトポリシー
default_policy: allow

rules:
  # 主要AIモデル（推奨: allow_optimized）
  - crawler: openai_gpt
    action: allow_optimized
    optimized_file: /llms-chatgpt.txt

  - crawler: anthropic_claude
    action: allow_optimized
    optimized_file: /llms-claude.txt

  - crawler: google_gemini
    action: allow_optimized
    optimized_file: /llms-gemini.txt

  - crawler: perplexity
    action: allow_optimized
    optimized_file: /llms-aio.txt

  # 汎用クローラー（スロットリング推奨）
  - crawler: common_crawl
    action: throttle
    rate_limit: 10/hour

  # 未識別クローラー（デフォルトはallow、ユーザーが変更可能）
  - crawler: unknown
    action: allow
```

### 2-3. カスタムポリシー設定（ユーザーが変更可能な項目）

コンテンツ提供者がダッシュボードから設定できる項目：

| 設定項目 | 選択肢 | 説明 |
|---------|--------|------|
| モデル別許可/ブロック | allow / throttle / block | 各AIモデルへの対応 |
| 時間帯制限 | 時刻・曜日指定 | 業務時間外のみ許可 等 |
| URL別制御 | パスプレフィックス指定 | `/admin/` は全クローラーブロック 等 |
| レートリミット | req/時間 を数値指定 | throttle 時の上限値 |
| コンテンツ保護レベル | 全許可/選択的許可/全ブロック | 簡易設定モード |

---

## 3. AIエージェント識別リスト（制御対象の完全定義）

### 3-1. ホワイトリスト（推奨許可）

| クローラーID | User-Agentパターン | 推奨アクション | 理由 |
|------------|-----------------|--------------|------|
| `openai_gpt` | GPTBot, ChatGPT-User, OAI-SearchBot | allow_optimized | 最大流入源 |
| `anthropic_claude` | ClaudeBot, Claude-Web, anthropic-ai | allow_optimized | 高品質引用 |
| `google_gemini` | Google-Extended, Google-GeminiBot | allow_optimized | AI Overview流入 |
| `google_search` | Googlebot | allow | SEO必須 |
| `perplexity` | PerplexityBot | allow_optimized | 急成長AI検索 |
| `microsoft_copilot` | Bingbot, MicrosoftPreview | allow | SEO+AI兼用 |

### 3-2. グレーリスト（設定推奨）

| クローラーID | User-Agentパターン | デフォルト | 推奨設定 |
|------------|-----------------|----------|---------|
| `common_crawl` | CCBot | allow | throttle（10/hour） |
| `meta_ai` | Meta-ExternalAgent | allow | allow（要監視） |
| `apple_siri` | Applebot | allow | allow |
| `duckduckgo` | DuckAssistBot | allow | allow |
| `youcom` | YouBot | allow | allow |

### 3-3. ブラックリスト（自動ブロック対象）

HackⅡがシステムレベルで自動ブロックするパターン（ユーザー変更不可）：

| パターン | 判定条件 | 理由 |
|---------|---------|------|
| スクレイパー偽装 | User-Agentは既知AIだが、IPがデータセンターではない | 不正クロール |
| ヘッドレスブラウザ | HeadlessChrome / PhantomJS 等 | 自動スクレイピング |
| 過剰クロール | 5分間に500件超 | DDoS的アクセス |

---

## 4. allow_optimized の動作仕様（特許出願中技術）

### 4-1. 処理フロー

```
クローラーからのリクエスト受信
    ↓
User-Agent識別（crawler_model 判定）
    ↓
ポリシー確認 → action = allow_optimized
    ↓
optimized_file のパスを取得（例: /llms-chatgpt.txt）
    ↓
[判定] リクエストURLがllms.txt系ファイルの場合
    → モデル専用ファイルの内容を返す（透過的リダイレクト）

[判定] リクエストURLが通常コンテンツページの場合
    → 通常HTMLを返す + レスポンスヘッダーにヒントを付与
    X-AI-Optimized-Context: /llms-chatgpt.txt
```

### 4-2. モデル別最適化ファイルマップ

```json
{
  "openai_gpt":     "/llms-chatgpt.txt",
  "anthropic_claude": "/llms-claude.txt",
  "google_gemini":  "/llms-gemini.txt",
  "perplexity":     "/llms-aio.txt",
  "microsoft_copilot": "/llms-aio.txt",
  "meta_ai":        "/llms-faq.txt",
  "common_crawl":   "/llms-full.txt",
  "unknown":        "/llms.txt"
}
```

---

## 5. ダッシュボードUI要件

### 5-1. 制御設定画面

**画面構成:**
```
AIエージェント制御
├── [クイック設定] — シンプルトグルUI
│   ├── 主要AIに最適化コンテンツを配信する [ON/OFF]
│   ├── 汎用クローラーをスロットリングする [ON/OFF]
│   └── 未識別botをブロックする [ON/OFF]
│
└── [詳細設定] — モデル別テーブル
    ├── モデル名 | 今月アクセス数 | 制御設定 | 変更ボタン
    ├── GPTBot   | 2,450件       | 最適化配信 | [変更]
    ├── ClaudeBot| 1,280件       | 最適化配信 | [変更]
    └── CCBot    | 890件         | 10件/時制限 | [変更]
```

### 5-2. リアルタイムプレビュー

設定変更時に「このクローラーが来たらどう動作するか」をシミュレーション表示する：

```
プレビュー: GPTBot がアクセスしたとき
  → /llms-chatgpt.txt の内容を返します
  → 最後のアクセス: 2026-05-25 10:30
  → 今月のアクセス: 2,450件
```

---

## 6. robots.txt との連携

Tsukullの設定はrobots.txtの自動生成に連携する（詳細は `robots_config.md` 参照）。

**連携ルール:**
- `block` 設定のクローラー → robots.txt の `Disallow: /` に自動追加
- `allow_optimized` 設定のクローラー → robots.txt にAIパッチファイルへのヒントを追加
- `throttle` 設定のクローラー → Crawl-delay ディレクティブを自動追加

---

## 7. 受け入れ条件

- [ ] ダッシュボードからのポリシー変更が30秒以内に全エッジノードに反映されること
- [ ] `allow_optimized` アクションで、モデル別最適化ファイルが正しく配信されること（テスト必須）
- [ ] `block` 設定のクローラーに403を返しつつ、ログに記録されること
- [ ] ポリシー変更の全履歴がダッシュボードで確認できること（監査ログ）
- [ ] クイック設定UIで3タップ以内に基本設定が完了できること（UXテスト）
- [ ] robots.txt の自動更新が設定変更から5分以内に反映されること
