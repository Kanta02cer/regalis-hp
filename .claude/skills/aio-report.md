---
name: aio-report
description: サイトのAIO/SEO/構造化データを4軸並列で診断し、統合レポートを生成する
user_invocable: true
---

# AIO Intelligence Report 診断スキル

Regalis Japan Group コーポレートサイト（Jekyll + GitHub Pages）を対象に、AI検索最適化の観点から4軸の診断を実行し、統合レポート（Markdown形式）を `tools/aio_report.md` に出力する。

---

## 実行手順

このスキルが呼ばれたら、以下の4軸を **並列** で診断し、統合レポートを生成する。
各軸の診断は Claude Code のネイティブツール（Glob, Grep, Read）を使って実行する。Python は使わない。

---

### 軸1: llms.txt 品質診断（配点25%）

**対象:** プロジェクトルート直下の `llms*.txt` 全バリエーション

**手順:**
1. `Glob` で `llms*.txt` を検索
2. 各ファイルを `Read` して以下をチェック

**チェック項目と配点（各ファイル100点満点）:**

| チェック項目 | 判定方法 | 配点 |
|---|---|---|
| 文字数 | `文字数 / 200`（上限15pt） | 最大15pt |
| タイトル（H1） | `^# ` で始まる行があるか | 10pt |
| セクション構造（H2） | `^## ` の数 x 3（上限15pt） | 最大15pt |
| URL含有 | `https?://` が含まれるか | 10pt |
| 料金情報 | `[¥￥][\d,]+` or `[\d,]+(?:万円\|円/月)` | 10pt |
| 問い合わせ導線 | `問い合わせ\|相談\|contact\|お問い合わせ` | 5pt |
| 代表情報 | `井上幹太\|かんちゃん\|代表` | 10pt |
| サービス記載 | `HackII\|Hack2\|メディア運営\|AIO\|LLMO` | 10pt |
| ファクト密度 | `^[-*]\s+\*\*.+?\*\*` の数 x 2（上限10pt） | 最大10pt |
| 定義文 | `とは[、。]\|について` の数（上限5pt） | 最大5pt |

**軸スコア算出:**
- メインllms.txt スコア x 70% + 全バリエーション平均 x 30%
- バリエーション数ボーナス: (ファイル数 - 3) x 2（最大+10pt、3種未満は0）
- 上限100pt

**Issues 検出:**
- メインllms.txt に料金情報がない場合
- メインllms.txt に代表情報がない場合
- バリエーションが3種未満の場合

---

### 軸2: 構造化データ・メタタグ診断（配点25%）

**対象:** `_layouts/corp.html`, `index.html`, `business/*/index.html`, `hackii/*/index.html`, `contact/index.html`, `company/index.html`, `_news/*.md`

**手順:**
1. `Read` で `_layouts/corp.html` を読み、`"@type"\s*:\s*"([^"]+)"` でスキーマタイプを検出
2. `Glob` で `business/*/index.html`, `hackii/*/index.html` 等を検索し、各ページの JSON-LD ブロックを検出
3. `Grep` で `_news/*.md` 内の `FAQPage` 含有率を計算

**チェック項目と配点:**

| チェック項目 | 判定方法 | 配点 |
|---|---|---|
| 必須スキーマ | Organization, WebSite, WebPage, LocalBusiness, BreadcrumbList の各存在 | 各5pt（最大25pt） |
| サービス系スキーマ | Service, Product, FAQPage, HowTo, Person, Corporation の各存在 | 各2.5pt（最大15pt） |
| 記事FAQPage普及率 | `_news/` 内の FAQPage 含有率 x 15 | 最大15pt |
| ページカバレッジ | JSON-LD を持つページ / 検査ページ数 x 10 | 最大10pt |
| Speakable | SpeakableSpecification の存在 | 5pt |
| スキーマ多様性 | 検出スキーマ種類数 x 1 | 最大10pt |
| FAQ率ボーナス | 記事FAQスキーマ率 > 80% の場合 | +5pt |

**Issues 検出:**
- FAQPage スキーマが全く未実装
- Service スキーマが未実装
- Person スキーマが未実装

---

### 軸3: コンテンツAIO最適化診断（配点30%）

**対象:** `_news/*.md`（`_TEMPLATE.md` 除く）, `index.html`

**手順:**
1. `Glob` で `_news/*.md` を検索（`_` 始まりは除外）
2. 各記事を `Read` してフロントマターを解析
3. `Read` で `index.html` のブランドシグナルを確認

**チェック項目と配点:**

| チェック項目 | 判定方法 | 配点 |
|---|---|---|
| 記事数 | 記事数 / 100 x 15（上限15pt） | 最大15pt |
| ai_summary 実装率 | ai_summary フィールド保有率 x 10 | 最大10pt |
| keywords 実装率 | keywords フィールド保有率 x 5 | 最大5pt |
| 定義型見出し率 | `^#{1,3}\s+.{2,30}とは` の含有記事率 x 15 | 最大15pt |
| 太字定義文率 | `\*\*.{2,40}とは[、,]` の含有記事率 x 10 | 最大10pt |
| FAQ HTML率 | FAQ/よくある質問 セクション含有率 x 10 | 最大10pt |
| 投稿鮮度 | 直近2ヶ月の記事数 / 8 x 10（上限10pt） | 最大10pt |
| ブランドシグナル（トップ） | Regalis/レガリス 出現数//3（上限4）+ CEO言及3pt + 料金言及3pt | 最大10pt |
| カテゴリ多様性 | ユニークカテゴリ数（上限5pt） | 最大5pt |

**Issues 検出:**
- 直近2ヶ月の記事数が4本未満
- 定義型見出し率が50%未満
- FAQ HTMLセクション含有率が30%未満

---

### 軸4: 技術SEO・パフォーマンス診断（配点20%）

**対象:** `_config.yml`, `robots.txt`, `sitemap*.xml`, `_layouts/corp.html`, 各種AIディスカバリーファイル

**手順:**
1. `Read` で `_config.yml` を読み、url/title/description/timezone を確認
2. `Read` で `robots.txt` を読み、AIクローラー許可状況を確認
3. `Glob` で `sitemap*.xml` を検索
4. `Read` で `_layouts/corp.html` を読み、メタタグ実装を確認
5. `Glob` で AIディスカバリーファイル（llms.txt, ai-patch.json, knowledge.json, aio-scores.json）を確認
6. `Grep` で画像最適化（WebP, lazy loading）を確認

**チェック項目と配点:**

| チェック項目 | 判定方法 | 配点 |
|---|---|---|
| 基本SEO設定 | url, title, description, timezone, robots.txt の各存在 | 各3pt（最大15pt） |
| canonical | corp.html 内に `canonical` | 4pt |
| hreflang | corp.html 内に `hreflang` | 3pt |
| OGP | corp.html 内に `og:title` or `og:description` | 4pt |
| Twitter Card | corp.html 内に `twitter:card` | 2pt |
| preconnect | corp.html 内に `preconnect` | 2pt |
| lang="ja" | corp.html 内に `lang="ja"` | 3pt |
| aria 属性 | corp.html 内に `aria-` | 3pt |
| AIメタタグ | corp.html 内に `ai-summary` or `ai-entity` | 5pt |
| IndexNow | corp.html 内に `indexnow` or 検証ファイル存在 | 4pt |
| AIクローラー許可 | robots.txt 内の ChatGPT/GPTBot/Google-Extended/Anthropic/Claude/PerplexityBot/Bingbot の数 x 2（上限10pt） | 最大10pt |
| AIディスカバリー | llms.txt, ai-patch.json, knowledge.json, aio-scores.json の各存在 x 3pt | 最大12pt |
| サイトマップ数 | sitemap*.xml の数（上限3pt） | 最大3pt |
| 画像最適化 | lazy loading 適用率 x 5 + WebP画像数（上限5pt） | 最大10pt |

**Issues 検出:**
- ai-summary / ai-entity メタタグ未実装
- AIクローラー許可が3種未満
- WebP画像が0件
- lazy loading 適用率が50%未満

---

## 統合スコア算出

```
総合スコア = llms.txt(25%) + 構造化データ(25%) + コンテンツAIO(30%) + 技術SEO(20%)
```

**グレード判定:**

| スコア | グレード |
|--------|----------|
| 90-100 | S (Elite) |
| 80-89  | A (Strong) |
| 70-79  | B+ (Good) |
| 60-69  | B (Average) |
| 50-59  | C (Needs Work) |
| 0-49   | D (Critical) |

---

## 出力形式

レポートを `tools/aio_report.md` に保存する。形式は以下の通り:

```markdown
# AIO Intelligence Report
**Regalis Japan Group株式会社**
**診断日:** YYYY年MM月DD日 HH:MM JST | **サイト:** regalis-order-suits.com

---

## Executive Summary

| 指標 | 値 |
|------|-----|
| **総合AIOスコア** | **XX / 100** (グレード) |
| llms.txt品質 | XX/100 |
| 構造化データ | XX/100 |
| コンテンツAIO | XX/100 |
| 技術SEO | XX/100 |

---

## 1. llms.txt 品質: XX/100
[バリエーション別スコア表]

## 2. 構造化データ: XX/100
[検出スキーマタイプ一覧・FAQPage普及率]

## 3. コンテンツAIO最適化: XX/100
[記事統計・月別投稿トレンド・カテゴリ分布]

## 4. 技術SEO: XX/100
[チェック項目ごとの対応状況]

---

## 改善アクション（N件）
[優先度付き改善提案リスト]

---
*Generated by Regalis AIO Intelligence Report v1.0*
```

---

## ターミナル表示

レポートファイル保存後、以下の要約をターミナルに表示する:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Regalis AIO Intelligence Report v1.0
  診断日: YYYY-MM-DD HH:MM JST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

総合AIOスコア: XX / 100  [グレード]

4軸スコア:
  llms.txt 品質           XX/100  (25%)
  構造化データ・メタタグ    XX/100  (25%)
  コンテンツAIO最適化      XX/100  (30%)
  技術SEO・パフォーマンス   XX/100  (20%)

主要指標:
  記事総数               XX本
  llms.txtバリエーション  XX種
  JSON-LDスキーマ種類     XX種
  記事FAQスキーマ率       XX%
  ai_summary実装率       XX%
  定義型見出し率          XX%
  AIクローラー許可数      XX種
  AIディスカバリーファイル XX/4
  直近2ヶ月記事数         XX本

改善項目（N件）:
  [領域] 内容
  ...

レポート保存先: tools/aio_report.md
```

---

## 注意事項

- 全てのファイルパスはプロジェクトルート（`/Users/wantan/regalis-hp/`）からの相対パスで扱う
- `_news/` 内の `_TEMPLATE.md` やその他 `_` 始まりのファイルは集計対象外
- 日付はJST（UTC+9）で表示
- レポート出力先は `tools/aio_report.md`（既存ファイルがあれば上書き）
- 4軸の診断は可能な限り並列で実行し、高速化する
