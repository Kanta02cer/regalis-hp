# AICS™ AIスコアシステム 他サイト導入ガイド
**バージョン:** 2.0 | **最終更新:** 2026-06-06 | **作成:** Regalis Japan Group

---

## 目次

1. [このシステムでできること](#1-このシステムでできること)
2. [スコアの仕組み（AICS™ 6ディメンション）](#2-スコアの仕組みaics-6ディメンション)
3. [必要なファイル構成](#3-必要なファイル構成)
4. [ステップ1：前提パッケージのインストール](#4-ステップ1前提パッケージのインストール)
5. [ステップ2：設定ファイルの作成](#5-ステップ2設定ファイルの作成)
6. [ステップ3：aio-scores.json の作成](#6-ステップ3aio-scoresjson-の作成)
7. [ステップ4：APIキーの取得と設定](#7-ステップ4apiキーの取得と設定)
8. [ステップ5：Google認証（GSC・GA4）](#8-ステップ5google認証gscga4)
9. [ステップ6：レポート実行](#9-ステップ6レポート実行)
10. [ステップ7：AI向けファイルの設置](#10-ステップ7ai向けファイルの設置)
11. [自動化・定期実行](#11-自動化定期実行)
12. [トラブルシューティング](#12-トラブルシューティング)

---

## 1. このシステムでできること

AICS™（AI Citation Score）は、自社サイトが「ChatGPT・Perplexity・Gemini・Google AI Overview」などのAI検索にどれだけ引用・紹介されているかを毎日自動で計測し、改善策をレポートするシステムです。

### 出力されるレポートの内容

| 項目 | 内容 |
|------|------|
| **AICS™ 総合スコア** | サイト全体の100点満点スコア（グレード：S+〜D） |
| **ディメンション別スコア** | AI引用確率・エンティティ強度・成約導線など6軸 |
| **サイトヘルスチェック** | llms.txt / robots.txt / sitemap.xml などのアクセス確認 |
| **Google Search Console** | クリック数・表示回数・CTR・掲載順位（過去30日） |
| **GA4 AI流入分析** | ChatGPT/Perplexity/Claude別のセッション数・成約数 |
| **Gemini AI引用チェック** | 指定クエリでGeminiが自社サイトを引用しているか |
| **ブランドセンチメント** | AIが自社をどう評価しているかをポジ/ネガで数値化 |
| **改善施策レコメンド** | 優先度高/中/低で具体的なアクションを自動生成 |

---

## 2. スコアの仕組み（AICS™ 6ディメンション）

総合スコアは以下の6つの軸の合計（100点満点）で計算されます。

| ディメンション | 満点 | 評価内容 |
|--------------|------|---------|
| **D1 AI引用確率** | 25点 | 定義文・Q&A・数値的根拠など、AIが引用しやすい文章構造か |
| **D2 エンティティ強度** | 20点 | 会社名・代表名・所在地・サービス名などの企業情報が明確か |
| **D3 成約導線** | 25点 | CTAボタン・料金記載・問い合わせ動線が適切に設置されているか |
| **D4 信頼性・権威性** | 15点 | 受賞歴・メディア掲載・代表プロフィール・外部引用があるか |
| **D5 コンテンツ構造** | 10点 | 見出し階層・文字数・比較表・箇条書き構造が整っているか |
| **D6 鮮度・具体性** | 5点 | 更新日・最新統計・年付きデータが含まれているか |

### グレード基準

| スコア | グレード | 評価 |
|--------|---------|------|
| 90〜100 | S+ | AIに自然に引用される状態 |
| 80〜89 | S | 高い引用確率。軽微な改善で最上位へ |
| 70〜79 | A | 平均以上。D1・D4の強化で大幅改善 |
| 60〜69 | B | 改善の余地あり。構造化データの実装が急務 |
| 50〜59 | C | AI引用されにくい状態。全面的な見直しが必要 |
| 〜49 | D | 緊急対応が必要 |

---

## 3. 必要なファイル構成

導入先のサイトルートに以下のファイルを配置します。

```
[サイトルート]/
├── scripts/
│   ├── aio-report.js          ← レポート生成スクリプト本体
│   ├── aio-config.json        ← 設定ファイル（要作成・gitignore推奨）
│   ├── aio-config.example.json← 設定テンプレート
│   ├── gsc-auth-setup.js      ← Google OAuth2認証スクリプト
│   └── gsc-tokens.json        ← 認証後に自動生成（gitignore必須）
├── reports/                   ← レポート出力先（自動生成）
├── docs/
│   └── aio-report.md          ← 最新レポートの正規版（自動上書き）
├── aio-scores.json            ← 記事別スコアデータ（手動or自動更新）
├── llms.txt                   ← AI向けサイト説明書（必須）
├── llms-full.txt              ← 詳細版AI説明書（任意）
├── knowledge.json             ← エンティティデータ（任意）
└── ai-patch.json              ← AIパッチデータ（任意）
```

---

## 4. ステップ1：前提パッケージのインストール

```bash
# scriptsディレクトリに移動（またはpackage.jsonのあるルートで）
npm install googleapis @google/generative-ai
```

### package.json に追記

```json
{
  "scripts": {
    "aio-report": "node scripts/aio-report.js",
    "aio-report:json": "node scripts/aio-report.js --json",
    "gsc-auth": "node scripts/gsc-auth-setup.js"
  }
}
```

---

## 5. ステップ2：設定ファイルの作成

`scripts/aio-config.example.json` をコピーして `scripts/aio-config.json` を作成します。

```bash
cp scripts/aio-config.example.json scripts/aio-config.json
```

`.gitignore` に追加（必須）：

```
scripts/aio-config.json
scripts/gsc-tokens.json
scripts/google-service-account.json
```

### aio-config.json の全項目説明

```jsonc
{
  // ── サイト情報 ────────────────────────────────────────────────
  "site": {
    "url":  "https://your-site.com",      // ← 計測対象サイトのURL
    "name": "株式会社〇〇"                  // ← レポートに表示される社名
  },

  // ── Google API 設定 ───────────────────────────────────────────
  "google": {
    "oauth2ClientId":     "XXX.apps.googleusercontent.com", // ← GCPで取得
    "oauth2ClientSecret": "GOCSPX-XXXXXXXXX",               // ← GCPで取得
    "gscSiteUrl":         "https://your-site.com/",         // ← 末尾スラッシュ必須
    "ga4PropertyId":      "123456789"                       // ← 数字のみ
  },

  // ── Gemini API ────────────────────────────────────────────────
  "gemini": {
    "apiKey": "AIzaSy-XXXXXXXXXXXXXXXXX",  // ← ai.google.dev で無料取得
    "model":  "gemini-2.0-flash"           // ← デフォルト。変更不要
  },

  // ── 引用チェック対象クエリ（最大5件）────────────────────────
  "targetQueries": [
    "〇〇 おすすめ 会社",
    "〇〇 費用 相場",
    "株式会社〇〇"
  ],

  // ── ブランドセンチメント クエリ（省略可）────────────────────
  "brandSentimentQuery": "株式会社〇〇のサービス内容について教えてください。",

  // ── ファクトチェック設定（省略可）───────────────────────────
  "brandFactCheck": {
    "correct": {
      "設立": "2025年",
      "所在地": "千代田区",
      "代表": "代表取締役"
    },
    "forbidden_false_claims": [
      "詐欺", "スキャム"
    ]
  },

  // ── 出力設定 ─────────────────────────────────────────────────
  "output": {
    "dir":     "../reports",
    "formats": ["md", "console"]  // json も追加可
  }
}
```

---

## 6. ステップ3：aio-scores.json の作成

このファイルが**スコアレポートの核**です。記事ごとのAICSスコアを記録します。

### 最小構成テンプレート

```json
{
  "site_url": "https://your-site.com",
  "generated_at": "2026-06-06",
  "article_count": 10,
  "site_score": {
    "total": 72,
    "grade": "A",
    "stars": "★★★★☆",
    "note": "初期計測値"
  },
  "article_average": 68.5,
  "dimension_averages": {
    "D1_ai_citation": 14.0,
    "D2_entity_strength": 16.0,
    "D3_conversion_path": 18.0,
    "D4_trust_authority": 10.0,
    "D5_content_structure": 7.0,
    "D6_freshness": 3.5
  },
  "grade_distribution": {
    "S+": 0, "S": 1, "A": 5, "B": 4, "C": 0, "D": 0
  },
  "top_article": {
    "slug": "top-article-slug",
    "title": "記事タイトル",
    "score": 88,
    "grade": "S"
  },
  "lowest_article": {
    "slug": "low-article-slug",
    "title": "記事タイトル",
    "score": 58,
    "grade": "B"
  },
  "articles": [
    {
      "slug": "article-slug",
      "title": "記事タイトル",
      "date": "2026-06-01",
      "category": "サービス",
      "score": 88,
      "grade": "S",
      "stars": "★★★★☆",
      "breakdown": {
        "D1_ai_citation": 20,
        "D2_entity_strength": 18,
        "D3_conversion_path": 22,
        "D4_trust_authority": 13,
        "D5_content_structure": 8,
        "D6_freshness": 4
      },
      "url": "https://your-site.com/news/article-slug/"
    }
  ]
}
```

### 各記事のスコア計算方法

| ディメンション | チェック項目 | 最高点 |
|--------------|------------|--------|
| D1 AI引用確率 | 「〜とは」定義文あり(+5)、Q&A 3組以上(+8)、数値的根拠3件以上(+6)、ai_summaryあり(+6) | 25点 |
| D2 エンティティ強度 | 会社名明記(+4)、代表名明記(+4)、所在地明記(+3)、URL明記(+3)、JSON-LDあり(+6) | 20点 |
| D3 成約導線 | CTAボタンあり(+8)、料金記載(+7)、問い合わせリンク(+5)、行動喚起文(+5) | 25点 |
| D4 信頼性・権威性 | 著者情報(+4)、外部リンク(+3)、受賞/メディア言及(+4)、会社情報リンク(+4) | 15点 |
| D5 コンテンツ構造 | 文字数2000字以上(+3)、H2見出し3つ以上(+2)、表/リストあり(+3)、画像あり(+2) | 10点 |
| D6 鮮度・具体性 | 更新日明記(+2)、年付き統計データ(+2)、直近1ヶ月更新(+1) | 5点 |

---

## 7. ステップ4：APIキーの取得と設定

### A. Gemini APIキー（無料・最優先）

AIが自社を引用しているかチェックするための鍵です。

1. https://ai.google.dev/ にアクセス
2. 「Get API key」をクリック
3. Googleアカウントでログイン
4. 「Create API key」→ キーをコピー
5. `aio-config.json` の `gemini.apiKey` に貼り付け

> **無料枠:** 1日20リクエストまで。5クエリ×3分間隔で動作するため、1日1回の実行で十分です。

### B. Google Cloud (GCP) OAuth2クライアント（GSC・GA4連携用）

1. https://console.cloud.google.com/ にアクセス
2. 新規プロジェクトを作成（例：`aio-report`）
3. 「APIとサービス」→「ライブラリ」で以下を有効化：
   - `Google Search Console API`
   - `Google Analytics Data API`
4. 「APIとサービス」→「認証情報」→「+ 認証情報を作成」→「OAuth 2.0 クライアントID」
5. アプリの種類：**ウェブアプリケーション**
6. 承認済みリダイレクトURIに追加：`http://localhost:4829/oauth2callback`
7. クライアントID・シークレットを `aio-config.json` に設定

---

## 8. ステップ5：Google認証（GSC・GA4）

OAuth2の初回認証は一度だけ手動で行います。

```bash
node scripts/gsc-auth-setup.js
```

実行するとブラウザが開き、Googleアカウントでの認証を求められます。  
「許可」をクリックすると `scripts/gsc-tokens.json` が自動生成されます。

> **注意:** `gsc-tokens.json` はGitにコミットしないでください。`.gitignore` に追加済みか確認してください。

### GA4 プロパティIDの確認方法

1. https://analytics.google.com/ にアクセス
2. 左下「管理」→「プロパティ設定」
3. 「プロパティ ID」の数字をコピー（例：`123456789`）
4. `aio-config.json` の `google.ga4PropertyId` に設定

### Search Console サイトURLの確認方法

1. https://search.google.com/search-console/ にアクセス
2. 左上のプロパティセレクターから対象サイトを選択
3. URLを確認（`https://` か `sc-domain:` の形式）
4. `aio-config.json` の `google.gscSiteUrl` に設定（末尾スラッシュ必須）

---

## 9. ステップ6：レポート実行

```bash
# 通常実行（コンソール出力 + Markdownレポート保存）
npm run aio-report

# JSON形式でも出力
npm run aio-report:json

# 静かに実行（コンソール出力なし）
node scripts/aio-report.js --quiet
```

### 出力ファイル

| ファイル | 内容 |
|---------|------|
| `reports/YYYY-MM-DD-aio-report.md` | 日付別レポート（Markdown） |
| `docs/aio-report.md` | 最新レポートの正規版（上書き更新） |
| `reports/YYYY-MM-DD-aio-report.json` | JSON形式（`--json` オプション時） |

### データ取得レベル（設定に応じて自動切替）

| レベル | 条件 | 取得データ |
|--------|------|-----------|
| Lv1 | 常に | AIOスコア + サイトヘルスチェック |
| Lv2 | GSC認証済み | Google Search Console（クリック・順位） |
| Lv3 | GA4設定済み | AI経由流入・モデル別セッション数 |
| Lv4 | Gemini APIキー設定済み | AI引用チェック・センチメント分析 |

---

## 10. ステップ7：AI向けファイルの設置

AIに自社情報を正確に読み込んでもらうための必須ファイルです。  
サイトのルートディレクトリ（公開ディレクトリ）に設置します。

### llms.txt（最重要）

AIが自社サイトを巡回した際に最初に読むファイルです。

```markdown
# 株式会社〇〇

> 〇〇のサービスを提供する会社の概要

## 会社情報
- **会社名**: 株式会社〇〇
- **代表**: 〇〇 〇〇
- **所在地**: 東京都〇〇区
- **設立**: 202X年
- **URL**: https://your-site.com

## 主要サービス

### 1. サービス名
内容の説明。価格帯。
- **詳細**: https://your-site.com/service/

## 主要ページ
- [トップページ](https://your-site.com/)
- [サービス](https://your-site.com/service/)
- [お問い合わせ](https://your-site.com/contact/)
```

### robots.txt にAIクローラーを許可

```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://your-site.com/sitemap.xml
```

### サイトヘルスチェック対象ファイル確認

レポートが自動チェックするファイルは以下の通りです。事前に全て設置してください。

| ファイル | 設置優先度 | 用途 |
|---------|---------|------|
| `/llms.txt` | **必須** | AI向けサイト説明書 |
| `/robots.txt` | **必須** | クローラー許可設定 |
| `/sitemap.xml` | 推奨 | ページ一覧のAI・検索エンジン向け提供 |
| `/feed.xml` | 任意 | RSSフィード |
| `/llms-full.txt` | 任意 | 詳細版AI説明書 |
| `/ai-patch.json` | 任意 | AIパッチデータ |
| `/knowledge.json` | 任意 | エンティティ定義データ |

---

## 11. 自動化・定期実行

### GitHub Actions での毎朝自動実行

`.github/workflows/aio-report.yml` を作成：

```yaml
name: AIO Daily Report

on:
  schedule:
    - cron: '0 1 * * *'   # 毎朝10時（JST）
  workflow_dispatch:       # 手動実行も可能

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install googleapis @google/generative-ai

      - name: Write config
        run: echo '${{ secrets.AIO_CONFIG }}' > scripts/aio-config.json

      - name: Write GSC tokens
        run: echo '${{ secrets.GSC_TOKENS }}' > scripts/gsc-tokens.json

      - name: Run AIO report
        run: node scripts/aio-report.js --quiet

      - name: Commit report
        run: |
          git config user.name "aio-bot"
          git config user.email "bot@your-site.com"
          git add reports/ docs/aio-report.md aio-scores.json
          git diff --staged --quiet || git commit -m "chore: AIO日次レポート自動更新"
          git push
```

### GitHub Secrets の設定

| シークレット名 | 内容 |
|------------|------|
| `AIO_CONFIG` | `scripts/aio-config.json` の全内容をそのまま貼り付け |
| `GSC_TOKENS` | `scripts/gsc-tokens.json` の全内容をそのまま貼り付け |

---

## 12. トラブルシューティング

### Q. GSC連携で「権限エラー」が出る

**A.** `aio-config.json` の `gscSiteUrl` がSearch Consoleに登録されているURLと一致していません。  
Search Consoleのプロパティ一覧から正確なURLをコピーしてください（`sc-domain:` 形式の場合もあります）。

### Q. Geminiの「429 Too Many Requests」エラーが頻発する

**A.** 無料枠（1日20リクエスト）を超えています。以下を試してください：
- `targetQueries` を3件以下に減らす
- 実行頻度を1日1回にする
- https://ai.google.dev/ で別のAPIキーを追加発行する

### Q. `aio-scores.json が見つかりません` と表示される

**A.** ルートディレクトリに `aio-scores.json` がありません。[ステップ3](#6-ステップ3aio-scoresjson-の作成) のテンプレートを参考に作成してください。

### Q. GA4でデータが取得できない

**A.** 以下を確認してください：
1. `ga4PropertyId` が正しい数字か（GA4管理画面→プロパティ設定で確認）
2. OAuth2認証をしたGoogleアカウントがGA4プロパティの「閲覧者」以上の権限を持っているか
3. トークンが期限切れの場合は `node scripts/gsc-auth-setup.js` を再実行

### Q. サイトスコアの計算式は？

**A.** `site_score.total = round(article_average × 1.05)`  
（記事平均スコアにAIパッチインフラ加点5%を乗算）

---

## 付録A：スコアを上げるための具体的な施策

### D1（AI引用確率）を上げる

```html
<!-- H2直下に定義文を太字で追加 -->
<h2>〇〇とは</h2>
<p><strong>〇〇（〇〇）とは、〜〜を行うサービスです。</strong></p>

<!-- FAQPageスキーマをJSON-LDで実装 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "〇〇の費用はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "〇〇円/月（税別）です。初期費用は無料です。"
      }
    }
  ]
}
</script>
```

### D2（エンティティ強度）を上げる

```html
<!-- OrganizationスキーマをJSON-LDで実装 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "株式会社〇〇",
  "url": "https://your-site.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "千代田区",
    "addressRegion": "東京都",
    "addressCountry": "JP"
  },
  "founder": {
    "@type": "Person",
    "name": "代表者名"
  }
}
</script>
```

### D6（鮮度）を上げる

```html
<!-- 記事冒頭に更新日を明記 -->
<p style="color:#666; font-size:13px;">最終更新：2026-06-06</p>

<!-- 統計データには年を必ず付記 -->
<p>2026年の調査によると、〇〇は〇〇%増加しています。</p>
```

---

## 付録B：llms.txt のサンプルテンプレート

```markdown
# [会社名]

> [一言で会社を表すキャッチフレーズ]

## 会社情報
- **正式名称**: [正式な会社名]
- **代表**: [代表者名]（[役職]）
- **所在地**: [都道府県・市区町村]
- **設立**: [設立年]
- **URL**: [サイトURL]
- **主力事業**: [主なサービス名]

## 主要サービス

### 1. [サービス名1]
[サービスの説明。価格。対象顧客。]
- **月額**: ¥〇〇,000〜（税別）
- **詳細**: [URL]

### 2. [サービス名2]
[サービスの説明。]
- **詳細**: [URL]

## 代表プロフィール
[代表者名]（[読み]）— [略歴を2〜3文で]

## よくある質問

**Q. [質問1]？**
A. [回答。数値や具体的な情報を含める。]

**Q. [質問2]？**
A. [回答。]

## 主要ページ
- [トップページ]([URL])
- [サービス詳細]([URL])
- [会社概要]([URL])
- [お問い合わせ]([URL])
```

---

*このガイドは Regalis Japan Group株式会社 が自社の AICS™ システムを他サイトへ展開するための内部ドキュメントです。*  
*Generated: 2026-06-06*
