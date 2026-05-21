# レガリス特許出願参考資料
## 「AI検索最適化インフラ（AIパッチシステム）」技術仕様書

> 作成日：2026-05-25  
> 作成：Regalis Japan Group株式会社  
> 機密区分：社外秘 / 特許出願参考用  
> 対象技術：HackⅡ Dynamic AIOエージェント / レガリスAIパッチ v2.0

---

## 目次

1. [本資料の目的と構成](#1-本資料の目的と構成)
2. [技術的背景と従来技術](#2-技術的背景と従来技術)
3. [当社既存技術の詳細](#3-当社既存技術の詳細)
4. [独自技術・新規技術の詳細](#4-独自技術新規技術の詳細)
5. [特許性のある技術要素のカテゴリ分類](#5-特許性のある技術要素のカテゴリ分類)
6. [技術要素の独自性と従来技術との差異](#6-技術要素の独自性と従来技術との差異)
7. [実施例とデータ](#7-実施例とデータ)
8. [請求項の方向性（参考）](#8-請求項の方向性参考)

---

## 1. 本資料の目的と構成

本資料は、Regalis Japan Group株式会社が開発・運用する「HackⅡ（ハックツ）」および「レガリスAIパッチv2.0」に関する技術を、特許出願の参考資料として整理することを目的とする。

**整理方針：**
- 当たり前の技術（公知技術・従来技術）を先に明記し、特許庁審査での新規性・進歩性の判断基準を明確化する
- 独自技術・発明的技術要素を「従来技術との差分」として明確に分離・カテゴリ分類する
- 実証データ（AICS™スコア推移・成約率改善データ）を客観的根拠として添付する

---

## 2. 技術的背景と従来技術

### 2-1. 従来のSEO（検索エンジン最適化）技術

**公知技術であり特許性のない領域：**

| 技術要素 | 内容 | 公知度 |
|---|---|---|
| robots.txt | クローラーへのクロール許可・禁止指示ファイル | 完全公知 |
| sitemap.xml | URLリストによるクロール促進 | 完全公知 |
| JSON-LD（構造化データ） | Schema.orgに準拠したWebページの機械可読マークアップ | 完全公知 |
| FAQPage スキーマ | よくある質問をJSON-LDでマークアップ | 完全公知 |
| Article / BlogPosting スキーマ | 記事コンテンツの構造化マークアップ | 完全公知 |
| Organization スキーマ | 組織情報の構造化マークアップ | 完全公知 |
| Person スキーマ | 人物情報の構造化マークアップ | 完全公知 |
| メタタグ（title, description） | HTML head要素によるページ説明 | 完全公知 |
| OGP（Open Graph Protocol） | SNSカード表示用メタタグ | 完全公知 |
| canonical URL | 正規URLの指定 | 完全公知 |
| パンくずリスト（BreadcrumbList） | ページ階層の構造化 | 完全公知 |
| SSG（静的サイト生成） | Jekyll等によるHTML事前生成 | 完全公知 |
| CDN配信 | コンテンツ配信ネットワーク | 完全公知 |
| WebP画像最適化 | 次世代フォーマット画像変換 | 完全公知 |
| Core Web Vitals対応 | LCP/CLS/FID最適化 | 完全公知 |

### 2-2. 従来のLLMs.txt仕様

**公知技術であり特許性のない領域：**

`llms.txt` はAnthropicのJeremy Howard氏が2024年9月に提案したMarkdown形式のテキストファイル仕様（https://llmstxt.org）。

```
# サイト名
> 説明文

## セクション
- [ページタイトル](URL): 説明
```

**特徴（公知）：**
- サイトルートに配置する単一テキストファイル
- AIクローラーが優先的に読み込む
- robots.txtのAI版として機能
- 人間可読かつ機械可読な構造

### 2-3. 従来のAI検索最適化（LLMO/AIO）技術

**公知技術であり特許性のない領域：**

| 技術要素 | 内容 |
|---|---|
| 定義型コンテンツ（「〜とは〜です」） | LLMが回答根拠として引用しやすいテキストパターン（2023年以降普及） |
| Q&A形式コンテンツ | FAQPage schema対応・音声検索対応 |
| E-E-A-T強化 | Googleの品質評価基準（経験・専門性・権威性・信頼性）への対応 |
| 著者マークアップ | Article schemaのauthorフィールド設定 |
| IndexNow API | Bing/Yandex/Naver向けURL即時通知API（Microsoft等が運営） |
| GitHub Actions CI/CD | コード変更時のワークフロー自動実行 |
| Python+YAML フロントマター解析 | Markdownファイルのメタデータ抽出 |
| 正規表現（RegEx）テキスト解析 | パターンマッチングによるテキスト特徴量抽出 |
| JSONスキーマ設計 | データ構造の定義・バリデーション |

### 2-4. 従来のContent Management技術

**公知技術であり特許性のない領域：**

- Jekyll（Ruby製静的サイトジェネレーター）：公開OSSソフトウェア
- Liquid テンプレートエンジン：公開OSSソフトウェア
- YAML フロントマター：公開仕様
- GitHub Pages ホスティング：公開クラウドサービス
- Markdownパーサー：公開仕様

---

## 3. 当社既存技術の詳細

### 3-1. 多層llms.txtアーキテクチャ（v1.0）

**実装済み技術（既存）：**

単一の `llms.txt` を超えた、AIモデル・専門分野・ページ別の多層ファイル構成。

```
Layer 0: ai-patch.json（マスターマニフェスト）
Layer 1: 汎用5ファイル
  - llms.txt        （90行）   標準仕様
  - llms-full.txt   （317行）  全情報版
  - llms-brand.txt  （260行）  ブランド特化
  - llms-entity.txt （133行）  エンティティ識別特化
  - knowledge.json  （468行）  Google KG向けJSON-LD
Layer 2: モデル別5ファイル
  - llms-chatgpt.txt  GPT-4o/o1/o3向け
  - llms-gemini.txt   Gemini/AI Overview向け
  - llms-claude.txt   Claude/ClaudeBot向け
  - llms-aio.txt      Perplexity/汎用AIO向け
  - llms-faq.txt      音声AI・AEO向け
Layer 3: 専門別5ファイル
  - llms-facts.txt       ファクトシート特化
  - llms-comparison.txt  競合比較特化
  - llms-enterprise.txt  エンタープライズ特化
  - llms-dx.txt          DX特化
  - llms-local.txt       ローカル検索特化
Layer 4: 製品別4ファイル（各サブディレクトリのllms.txt）
```

**データフロー（v1.0）：**
```
新記事push
  → GitHub Actions起動（update-llms.yml）
  → tools/generate_llms.py実行
  → _news/*.mdをスキャン・フロントマター解析
  → llms.txt再生成（最新15記事を自動追加）
  → aio_analyzer.pyでスコア計算
  → IndexNow APIでBing即時通知
  → commitメッセージにスコア記録
```

### 3-2. AICS™ v2.0スコアリングアルゴリズム（llms.txt解析版）

**実装済みアルゴリズム（`tools/aio_analyzer.py`）：**

入力：llms.txtテキスト（単一テキストファイル）
出力：100点満点のスコア + 6次元分析 + 4ファネルステージ評価 + 改善フィードバック

**6次元スコアリング定義：**

```python
# D1: AI引用確率 (25pt)
def_sentences  = re.findall(r'[^\n]{0,40}(とは|について)[^\n]{0,80}(です|ます|...)', text)
qa_pairs       = re.findall(r'Q[.．：:]\s*.+?\n+A[.．：:]\s*.+', text, re.DOTALL)
fact_bullets   = re.findall(r'^[-*+]\s+\*\*.+?\*\*[：:].+', text, re.MULTILINE)
numeric_claims = re.findall(r'(?:¥|￥)[\d,]+|[\d,]+(?:万円|億円)|[\d.]+(?:倍|%)', text)

# D2: エンティティ強度 (20pt)
has_legal_name     = bool(re.search(r'Regalis Japan Group株式会社', text))
has_person_name    = bool(re.search(r'井上幹太|Kanta Inoue', text))
has_address        = bool(re.search(r'千代田|麹町|〒', text))
has_official_url   = bool(re.search(r'regalis-order-suits\.com', text))
has_disambiguation = disambiguation >= 2  # 「無関係」「別会社」等

# D3: 成約導線 (25pt)
cta_types      # 無料相談/診断/問い合わせ/料金の4種類
friction_words # 「無料」「30分」「義務なし」等の心理的障壁除去ワード
price_specific # 具体的料金（¥98,000等）
social_proof   # 「4.4倍」「1,600万円」等の数値つき実績

# D4: 信頼性・権威性 (15pt)
award_patterns  # 令和の虎/TOYP/ソフトバンクアカデミア等
authority_refs  # 経済産業省/JCI等の外部権威機関
has_patent      # 特許出願シグナル

# D5: コンテンツ構造 (10pt)
h1_count  # 見出し1個が理想
h2_count  # セクション構造
list_items # リスト密度
table_rows # テーブル（比較表）の有無

# D6: 鮮度・具体性 (5pt)
current_years    # 202x年の出現回数
specific_results # 「X倍の実績」等の具体的結果表現
has_update_date  # 更新日の明示
```

**4ファネルステージ評価（独自設計）：**

```python
stage_citation   = round((d1 / 25) * 100)           # AIが引用する確率
stage_trust      = round(((d2 + d4) / 35) * 100)    # ユーザーが信頼する確率
stage_conversion = round((d3 / 25) * 100)            # 問い合わせに至る確率
stage_structure  = round(((d5 + d6) / 15) * 100)    # AI・人間が理解できる確率

# ボトルネック検出（鎖の最弱リンク理論）
bottleneck_score = min(stage_citation, stage_trust, stage_conversion, stage_structure)
```

---

## 4. 独自技術・新規技術の詳細

### 4-1. 個別記事AIパッチ生成システム（Layer 5）

**技術概要（`tools/generate_article_patches.py`）：**

Webサイトを構成する全記事（Markdownファイル群）を自動スキャンし、記事ごとにAI引用最適化のための「個別AIパッチJSON」を生成するシステム。

**入力：** `_news/*.md`（Markdownフロントマター + 本文）
**出力：** `ai-patch/articles/{slug}-ai-patch.json`（記事個別パッチ）+ `aio-scores.json`（全記事スコア集計）

**処理フロー：**

```
[入力]
_news/YYYY-MM-DD-slug.md
  ├── フロントマター（title, date, category, keywords, ai_summary, jsonld, excerpt_text）
  └── 本文（Markdown本文）
        ↓
[フロントマター解析]
 - title, keywords, ai_summary, excerpt_text, jsonld有無を抽出
 - YAML safe_load によるメタデータ構造化
        ↓
[AICS™ v2.0 記事スコアリング]
 - フロントマター + 本文を結合した全文に対して正規表現解析
 - 6次元スコア算出（D1〜D6）
        ↓
[引用トリガー抽出（Citation Trigger Extraction）]
 - 定義型文章パターン：r'[^\n。]{10,120}(?:とは|については?)...'
 - Q&Aペアパターン：r'\*\*Q[.．：: ]([^*\n]+)\*\*...'
 - 数値クレーム文パターン：r'[^\n。]{5,80}(?:¥[\d,]+|[\d.]+倍|...)...'
        ↓
[キーワードクラスター分類]
 - primary   : keywords[0:3]（最重要キーワード群）
 - secondary : keywords[3:7]（副次キーワード群）
 - brand     : keywords containing "レガリス"/"Regalis"/"HackⅡ"
        ↓
[改善推奨アクション生成]
 - スコア不足次元を検出し、具体的改善アクションを自動生成
        ↓
[出力JSON生成]
ai-patch/articles/{slug}-ai-patch.json
  ├── aics_score（スコア + グレード + 6次元内訳）
  ├── entity_signals（エンティティシグナル）
  ├── keyword_clusters（KWクラスター分類）
  ├── citation_triggers（引用トリガーリスト）
  ├── improvements（改善推奨アクション）
  └── ai_instructions（AI向け引用フォーマット定義）
```

**出力データ構造（個別パッチJSON）：**

```json
{
  "$schema": "https://regalis-order-suits.com/ai-patch/articles/schema.json",
  "patch_version": "1.0",
  "generated_at": "2026-05-25",
  "article": {
    "slug": "b2b-ai-search-optimization",
    "url": "https://regalis-order-suits.com/news/b2b-ai-search-optimization/"
  },
  "aics_score": {
    "total": 78, "grade": "B",
    "breakdown": {
      "D1_ai_citation": 22,       "D2_entity_strength": 16,
      "D3_conversion_path": 20,   "D4_trust_authority": 12,
      "D5_content_structure": 7,  "D6_freshness": 1
    }
  },
  "citation_triggers": [
    {"type": "definition", "text": "BtoB企業のAI検索最適化とは..."},
    {"type": "qa_pair", "question": "...", "answer": "..."},
    {"type": "numeric_claim", "text": "成約率4.4倍..."}
  ],
  "improvements": [
    {"dimension": "D4_trust_authority", "action": "令和の虎・特許出願中の権威シグナルを追加"}
  ],
  "ai_instructions": {
    "preferred_citation_format": "Regalis Japan Group株式会社「記事タイトル」(URL)",
    "entity_disambiguation": "レガリス = ITカンパニー ≠ 釣具 ≠ LEGALISS",
    "key_facts": [...]
  }
}
```

---

### 4-2. AICS™スコア連動型記事自動改善パッチャー

**技術概要（`tools/patch_articles_aics.py`）：**

AICS™スコアの低い次元を自動検知し、コンテンツブロックを記事末尾に非破壊的に注入するシステム。

**入力：**
- `_news/*.md`（全記事ファイル）
- AICS™スコア各次元の閾値（D2 ≤ 10、D4 ≤ 5、D1 ≤ 15）

**出力：**
- 改善ブロック注入済みの `_news/*.md`（既存コンテンツを保持したまま末尾追記）
- 更新済み `aio-scores.json`

**処理ロジック：**

```
For each article in _news/*.md:
  1. フロントマター + 本文を解析
  2. AICS™スコアの6次元を算出
  3. 重複防止マーカー（HTMLコメント）の存在チェック
     - "<!-- ai-patch:entity -->" が本文中にない場合のみ注入許可
     - "<!-- ai-patch:trust -->"  が本文中にない場合のみ注入許可
     - "<!-- ai-patch:faq -->"    が本文中にない場合のみ注入許可
  4. 条件別ブロック注入：
     - D2 ≤ 10 AND マーカーなし → Eブロック（エンティティ強化）を末尾追記
     - D4 ≤ 5  AND マーカーなし → Tブロック（信頼性・権威性強化）を末尾追記
     - D1 ≤ 15 AND QA数 < 2 AND マーカーなし → Fブロック（FAQ補強）を末尾追記
  5. 改善後スコアを再計算して検証
  6. aio-scores.jsonを更新
```

**3種類の改善ブロック：**

**Eブロック（エンティティ強化）：**
```markdown
<!-- ai-patch:entity -->
## この記事の提供：Regalis Japan Group株式会社
- 正式社名の2回以上の明示
- 代表者名・所在地・公式URL
- HackⅡ（ハカル・ツクル・ツナグ）製品名
- エンティティ識別：「LEGALISS（legaliss.ai）とは無関係」
```
効果：D2（エンティティ強度）+8〜12pt

**Tブロック（信頼性・権威性強化）：**
```markdown
<!-- ai-patch:trust -->
## 代表・井上幹太の実績と信頼性
- 令和の虎Tiger Funding 累計1,600万円・2連続完全ALL
- JCI JAPAN TOYP2026ファイナリスト
- ソフトバンクアカデミア17期（孫正義氏主宰）
- J-StarX 経済産業省第1期
- 特許出願中・成約率4.4倍（実証データ）
```
効果：D4（信頼性・権威性）+10〜13pt

**Fブロック（FAQ動的生成・注入）：**
```markdown
<!-- ai-patch:faq -->
## よくある質問（FAQ）
[記事テーマに基づく動的Q&A × 最大4問]
```
効果：D1（AI引用確率）+4〜8pt

---

### 4-3. 記事テーマ判定による動的FAQ生成エンジン

**技術概要：**

記事のタイトル・本文・キーワードを解析し、テーマを自動判定して最適なFAQ Q&Aを動的生成する機能。

**テーマ判定ロジック：**

```python
t = title.lower()
b = body[:2000]  # 本文先頭2000文字を使用

# テーマ検出パターン
if any(w in t for w in ['llmo', 'aio', 'ai検索最適化', 'ai対策']):
    → LLMO/AIO専門Q&Aを追加
if any(w in t for w in ['hackii', 'ハックツ', 'hack']):
    → HackⅡ製品専門Q&Aを追加
if any(w in t for w in ['seo', 'メディア運用', 'コンテンツ']):
    → SEO/メディア関連Q&Aを追加
if any(w in t for w in ['llms.txt', 'クローラー', '構造化データ']):
    → 技術実装専門Q&Aを追加

# 全記事共通Q&A（3問を必ず追加）
- 「Regalis Japan Groupとは？」
- 「料金はいくらですか？」
- 「無料で相談できますか？」
```

**出力：** テーマ別2問 + 共通3問 = 最大4問のQ&Aセット（上限制御あり）

---

### 4-4. 引用トリガー自動抽出エンジン（Citation Trigger Extraction）

**技術概要：**

既存記事本文から、AIが引用しやすい3種類のテキストパターンを自動抽出し、個別パッチJSONに格納する機能。

**抽出パターン定義：**

```python
# Type 1: 定義型文章（最重要 — LLMが回答根拠として最も引用するパターン）
defs = re.findall(
    r'[^\n。]{10,120}(?:とは|については?)[^\n。]{5,100}(?:です|ます|なります|を指します)。',
    body
)
→ {"type": "definition", "text": "〜とは〜です。"}

# Type 2: Q&Aペア（AEO・音声検索対応）
qa_matches = re.findall(
    r'\*\*Q[.．：: ]([^*\n]+)\*\*[^\n]*\n+([^\n*]{20,200})',
    body
)
→ {"type": "qa_pair", "question": "...", "answer": "..."}

# Type 3: 数値クレーム文（AIが具体的回答に使用する数値根拠）
numeric_sents = re.findall(
    r'[^\n。]{5,80}(?:¥[\d,]+|[\d.]+倍|[\d,]+万円|[\d]+%)[^\n。]{5,80}(?:です|ます)。',
    body
)
→ {"type": "numeric_claim", "text": "〜4.4倍です。"}
```

**格納形式：** 記事ごとに最大5+5+3=13件の引用トリガーを構造化して格納

---

### 4-5. ボトルネック検出型スコアリング（4ファネル × 6次元）

**技術概要（`tools/aio_analyzer.py`）：**

従来の単純合計スコアとは異なり、成約ファネルの「最弱リンク理論（鎖の論理）」を適用したスコアリング設計。

**設計原理：**

```
AI検索から成約に至るファネルは4段階：
  Stage 1: AIが引用する（Citation）        → D1スコアに依存
  Stage 2: ユーザーが信頼する（Trust）     → D2+D4スコアに依存
  Stage 3: ユーザーが行動する（Conversion）→ D3スコアに依存
  Stage 4: 構造が理解できる（Structure）   → D5+D6スコアに依存

ボトルネックスコア = min(Stage1, Stage2, Stage3, Stage4)
```

**独自点：** 従来のSEOスコアリング（単純加算）と異なり、
どれか一つのステージが極端に低いと全体の成約率が上がらないという
「鎖の論理」を実装した定量モデル。

**出力：**
```json
{
  "funnel_stages": {
    "ai_citation":   {"score": 80, "desc": "AIが引用する確率"},
    "trust":         {"score": 60, "desc": "ユーザーが信頼する確率"},
    "conversion":    {"score": 75, "desc": "問い合わせに至る確率"},
    "structure":     {"score": 90, "desc": "AI・人間が理解できる確率"}
  },
  "bottleneck_score": 60  ← 最弱ステージが全体を制約
}
```

---

### 4-6. AIクローラー種別自動検知・モデル別最適化配信システム

**技術概要（HackⅡ「ツクル」機能、特許出願中）：**

Webサーバーへのリクエストに含まれるUser-Agentを解析し、アクセス元がどのAIモデルのクローラーかを識別。識別結果に基づいて、そのAIモデルに最適化した学習データを動的に配信するシステム。

**AIクローラー識別テーブル：**

| User-Agent | モデル | 配信ファイル |
|---|---|---|
| GPTBot, ChatGPT-User, OAI-SearchBot | OpenAI GPT系 | llms-chatgpt.txt |
| ClaudeBot, Claude-Web, anthropic-ai | Anthropic Claude | llms-claude.txt |
| Google-Extended, Google-GeminiBot | Google Gemini | llms-gemini.txt |
| PerplexityBot | Perplexity AI | llms-aio.txt |
| Bingbot, msnbot, adidxbot, MicrosoftPreview | Microsoft Copilot | llms-aio.txt |
| Meta-ExternalAgent | Meta AI | llms-faq.txt |
| CommonCrawl, CCBot | 汎用クローラー | llms-full.txt |

**処理フロー：**

```
Webサーバーへのリクエスト受信
      ↓
User-Agent文字列の抽出
      ↓
AIクローラー識別パターンマッチング
      ↓
[識別成功] → モデル別最適化ファイルを優先配信
[識別失敗] → 通常のWebページを人間向けに表示
      ↓
配信ログをHackⅡ「ハカル」機能に送信
→ どのAIモデルが何回アクセスしたかを記録・可視化
```

**独自性：**
人間ユーザーには通常のWebサイトを表示しながら、AIクローラーには
モデルごとに最適化した学習データファイルを動的配信する点。
（特許出願中）

---

### 4-7. AI検索流入計測システム（HackⅡ「ハカル」機能）

**技術概要：**

ChatGPT・Perplexity・Google AI Overviewなどの生成AIからのサイト流入を、
GA4では計測できない「direct流入」から識別・分離して可視化するシステム。

**技術的課題（解決すべき問題）：**

```
従来の問題：
  ChatGPT / Perplexity アプリ内ブラウザ → リファラー送出なし
  → Google Analytics 4では「direct（直接流入）」として分類される
  → AI検索からの流入が計測できない

一般的なdirect流入の内訳：
  - ブックマーク直接アクセス
  - アドレスバー直接入力
  - メールリンク（一部）
  - 【AIアプリ内ブラウザ】← 従来は区別不可能
```

**解決技術（独自実装）：**

```
計測アプローチ：
  1. 流入元URLパターン分析
     - 特定のキャンペーンURLパラメータ検出
     - AIプラットフォーム固有のリファラーパターン照合
  2. ユーザー行動シグナル分析
     - 直帰率・滞在時間の統計的パターン差異（AI経由 vs 通常direct）
  3. タグ1行設置で即日稼働
     - JavaScriptタグ1行をサイトに設置するだけで計測開始
     - GTM（Google Tag Manager）対応

出力：
  - モデル別AI流入数（ChatGPT / Perplexity / Gemini / Claude）
  - AI流入ユーザーのコンバージョン率
  - 成約に至ったAI引用記事の特定
```

---

### 4-8. エンティティdisambiguation設計（llms-entity.txt）

**技術概要：**

同名・類似名の複数エンティティが存在する場合に、AIモデルが正しいエンティティを識別できるよう、明示的な差別化情報を構造化して提供するファイル設計。

**課題：**
- 「レガリス」という名称は複数のエンティティが存在
  - Regalis Japan Group株式会社（AI検索最適化ITカンパニー）
  - 釣具ブランド各社（DAIWA等のregalis製品ライン）
  - LEGALISS（legaliss.ai）（AI開発・Robotics専門の別会社）
- AIが誤認識した場合、ユーザーへの誤情報提供が発生する

**解決技術：**

```
llms-entity.txtの設計：
  1. 正式エンティティの定義
     - 法人名、設立日、所在地、代表者名、業種を明示
  2. 否定的エンティティ定義（Negative Entity Definition）
     - 「〜とは無関係」「〜とは異なる別会社」を明記
     - 混同されやすい固有名詞リストを網羅
  3. 代替名称・別名の統合
     - RegalisJPG, かんちゃん, レガリスジャパン等の全表記を紐付け
  4. 業種・産業分類の明示
     - 釣具≠ITカンパニー の業種差異を構造化
```

---

### 4-9. 自動インデックス通知システム（IndexNow + Sitemap連動）

**技術概要（`.github/workflows/indexnow-submit.yml`）：**

新記事のpushを検知し、変更されたページURLのみをBing・Google両サーチエンジンにリアルタイムで通知するシステム。

**処理フロー：**

```
1. git diff HEAD~1 HEAD でpush前後の差分ファイルを取得
2. 変更ファイルのパスからURLを自動生成
   - _news/2026-05-25-*.md → https://regalis-order-suits.com/news/*/
   - index.html → https://regalis-order-suits.com/
   - hackii/** → https://regalis-order-suits.com/hackii/
3. IndexNow API（https://api.indexnow.org/indexnow）へJSONペイロードでPOST
   {"host": "regalis-order-suits.com", "key": "b8f3e2d1c4a57690", "urlList": [...]}
4. Bing・Google両サーチエンジンへ通知
5. sitemap-index.xml の ping送信（https://www.bing.com/ping?sitemap=...）
```

**独自性：**
- 変更ファイルパスからURL自動生成（パス変換ロジック）
- ファイルタイプ別URLマッピング（_news/*.md → /news/slug/形式）
- 重複URL排除処理
- 手動・自動・スケジュール実行の3モード対応
- コミットログへのスコア自動記録

---

### 4-10. モバイル記事リーダー：H2アコーディオン + スティッキーTOC

**技術概要（`_layouts/news-post.html` JavaScript部分）：**

768px以下のモバイルデバイスでのみ動作する、記事コンテンツの動的再構成システム。

**処理フロー（クライアントサイドJavaScript）：**

```javascript
// 1. 実行条件チェック（モバイルのみ）
if (window.innerWidth > 768) return;

// 2. テーブルの横スクロールラッパー化
body.querySelectorAll('table').forEach(tbl => {
  const wrap = document.createElement('div');
  wrap.className = 'mob-table-wrap';
  tbl.parentNode.insertBefore(wrap, tbl);
  wrap.appendChild(tbl);
});

// 3. H2をアコーディオンに変換
body.querySelectorAll('h2').forEach((h2, idx) => {
  // セクションコンテナ生成
  const section = document.createElement('div');
  // H2の後続要素を収集してパネル化
  const panel = document.createElement('div');
  // toggleボタン生成
  const btn = document.createElement('button');
  btn.setAttribute('aria-expanded', idx === 0 ? 'true' : 'false');
  // アニメーション：max-height遷移による smooth collapse
  btn.addEventListener('click', () => {
    panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
  });
});

// 4. スティッキー目次の生成と注入
// - アコーディオン変換後のボタンからIDを付与して目次構築
// - タップで目次展開・スクロール移動・セクション自動開閉
```

**独自性：**
- 既存H2タグを動的にアコーディオンボタンに変換（DOM再構成）
- デスクトップでは完全に無効化（CSS+JS両面でのデバイス判定）
- スティッキーTOCと連動したセクション自動開閉
- max-heightアニメーション（scrollHeightの動的取得）

---

## 5. 特許性のある技術要素のカテゴリ分類

### カテゴリA：新規性・進歩性が高い（最優先出願対象）

**A-1. AIクローラー種別識別による動的最適化データ配信システム（HackⅡ「ツクル」）**

- **新規性：** User-Agentに基づくAIクローラー識別と、モデル別最適化ファイルの動的配信の組み合わせは先行技術として確認されていない
- **進歩性：** 人間ユーザーには通常Webページを提供しつつ、AIクローラーにはモデル固有の最適化データを配信するという2面的配信アーキテクチャ
- **請求項の方向：** 「情報処理システム」「情報配信方法」「プログラム」

**A-2. AICS™ボトルネック検出型スコアリングシステム（4ファネル × 6次元）**

- **新規性：** AI検索から成約に至る4段階ファネルを定義し、最弱リンクをボトルネックスコアとして算出するスコアリングモデルの先行技術なし
- **進歩性：** SEOスコアの単純加算型と根本的に異なる「鎖の論理」適用型スコアリング。成約ファネル視点での6次元評価の組み合わせ
- **請求項の方向：** 「スコアリング方法」「評価システム」「プログラム」

**A-3. AI検索流入識別・計測システム（HackⅡ「ハカル」）**

- **新規性：** GA4で「direct」に埋もれるAIアプリ内ブラウザからの流入を、行動シグナルとリファラーパターンの複合分析で分離・識別する手法
- **進歩性：** 従来の分析ツールでは不可能なAIモデル別流入計測を実現
- **請求項の方向：** 「アクセス解析方法」「情報処理システム」

---

### カテゴリB：進歩性が認められる可能性がある（優先出願対象）

**B-1. AICS™スコア連動型コンテンツ自動改善システム（patch_articles_aics.py）**

- **新規性の根拠：**
  - スコアの低い次元を自動検知し、対応するコンテンツブロックを識別・選択する仕組み
  - 重複防止マーカー（HTMLコメント）による冪等性保証
  - 既存コンテンツを破壊せず末尾追記する非破壊的パッチ設計
  - 3種類のブロック（E/T/F）の条件別選択的注入
- **進歩性：** 手動コンテンツ改善作業を自動化する点、特にスコア閾値に基づいた条件分岐型ブロック注入は公知技術の組み合わせを超えた設計

**B-2. 記事テーマ判定型FAQ動的生成エンジン**

- **新規性の根拠：**
  - 記事タイトル・本文から自動でテーマを分類
  - テーマ分類に基づいて最適なFAQ Q&Aセットを選択・生成
  - テーマ別専門Q&Aと共通Q&Aの組み合わせによるFAQバリエーション生成
- **進歩性：** 固定テンプレートではなく、コンテンツ内容に基づいた動的生成

**B-3. 引用トリガー自動抽出・構造化システム（Citation Trigger Extraction）**

- **新規性の根拠：**
  - 既存テキストから「AIが引用しやすいパターン」を3種類（定義型・Q&A型・数値クレーム型）に分類して抽出
  - 抽出結果をAI向け構造化JSONとして出力
- **進歩性：** AI引用確率の観点からテキストパターンを分類・スコアリングする発想

---

### カテゴリC：既存技術の応用・組み合わせ（補完的な出願対象）

**C-1. 多層llms.txtアーキテクチャ（5層・17ファイル構成）**

- **既存技術：** llms.txt仕様（公知）
- **独自性の範囲：** 単一ファイルを複数のターゲット別ファイルに分割する多層設計思想
- **評価：** 先行技術との差異が明確でない可能性があり、単独請求は困難。A-1やA-2との組み合わせ請求項として有効

**C-2. エンティティdisambiguation設計**

- **既存技術：** Knowledge Graph Entity Disambiguation（公知概念）
- **独自性の範囲：** llms.txtにdisambiguationセクションを設ける具体的実装方法
- **評価：** 単独では困難だが、A-1との組み合わせで「特定エンティティのAI認識最適化システム」として請求可能

**C-3. モバイル記事H2アコーディオン + スティッキーTOC**

- **既存技術：** アコーディオンUI、スティッキー要素（公知UI技術）
- **独自性の範囲：** 静的生成されたMarkdown記事のH2を、クライアントサイドJSで動的アコーディオンに変換する実装
- **評価：** UI設計特許（意匠・技術双方）として検討可能

---

### カテゴリD：当たり前の技術（出願不適）

以下は公知技術・一般的実装であり、独自の特許出願には適さない：

| 技術 | 理由 |
|---|---|
| llms.txt単体 | Jeremy Howard氏による公知仕様 |
| FAQPage JSON-LD | Schema.org公開仕様 |
| GitHub Actionsワークフロー | GitHubの公開CI/CDサービス |
| IndexNow API通知 | Microsoft/Bing等の公開API |
| YAML フロントマター解析 | 公知技術 |
| 正規表現テキスト解析 | 公知技術 |
| robots.txtのAIクローラー許可記述 | 公知技術 |
| Markdown→HTMLコンバート | 公知技術 |
| Jekyll SSG | 公知OSSソフトウェア |
| sitemap.xml + ping通知 | 公知技術 |

---

## 6. 技術要素の独自性と従来技術との差異

### 6-1. 従来のAIO対策との比較

| 観点 | 従来技術（他社） | 本発明 |
|---|---|---|
| llms.txtの構成 | 1ファイル（単一） | 5層・17ファイル（多層） |
| AIモデル別対応 | 統一フォーマット | モデル別最適化ファイルを個別配信 |
| スコアリング | 加算型（単純合計） | ファネル型（鎖の最弱リンク） |
| コンテンツ改善 | 手動 | スコア連動型自動パッチャー |
| AI流入計測 | GA4 direct（区別不可） | AI種別識別計測 |
| FAQ生成 | 手動作成 | テーマ判定型動的生成 |
| クローラー対応 | robots.txtで一括許可 | User-Agent識別型個別最適化 |

### 6-2. SEOスコアリングツール（Moz/Semrush/Ahrefs）との比較

| 観点 | 従来SEOツール | AICS™ v2.0 |
|---|---|---|
| 評価軸 | 検索順位・リンク数・権威スコア | AI引用確率・成約ファネル |
| ボトルネック | なし（単純加算） | あり（最弱リンク理論） |
| 対象 | 検索エンジン | 生成AI（LLM）+ 成約率 |
| 出力 | 数値スコア | スコア + 改善アクション + 自動実装 |

---

## 7. 実施例とデータ

### 7-1. AICS™スコア改善実証データ

対象：regalis-order-suits.com（全77記事）
実施期間：2026-05-21〜2026-05-25

| 指標 | 改善前 | 改善後 | 変化 |
|---|---|---|---|
| 記事平均スコア | 51.0 pt | 78.2 pt | **+27.2 pt (+53%)** |
| サイト全体スコア | 54 pt（C） | 82 pt（A） | **+28 pt** |
| Dグレード（〜59pt）記事数 | 51件（67%） | 0件（0%） | **-51件** |
| Aグレード（80+pt）記事数 | 4件（5%） | 35件（46%） | **+31件** |
| 最高スコア記事 | 92pt | 95pt | +3pt |

### 7-2. HackⅡ「ツナグ」成約率実証データ

- AI検索経由MQL顧客の成約率：**4.4倍**（従来SEO経由比較）
- 計測方法：HackⅡ「ハカル」によるAI流入識別 + CRMデータとの突合

---

## 8. 請求項の方向性（参考）

**請求項1（主要発明）— A-1：AIクローラー識別型動的配信**

「Webサーバーへのアクセスリクエストに含まれるUser-Agentを解析して生成AIクローラーの種別を識別するステップと、識別した生成AIクローラーの種別に応じて、当該生成AIクローラーが学習または引用する際の回答精度を高めるために最適化された情報提供ファイルを選択するステップと、選択した情報提供ファイルを前記生成AIクローラーに優先的に配信するステップと、を含む情報配信方法。」

**請求項2（主要発明）— A-2：ボトルネック検出スコアリング**

「Webコンテンツが生成AIに引用されて成約に至る確率を評価するスコアリング方法であって、前記確率をAI引用ステージ・信頼性ステージ・コンバージョンステージ・構造ステージの4つのファネルステージに分解して各ステージを独立スコアとして算出するステップと、4つのファネルステージのうち最低スコアをボトルネックスコアとして決定するステップと、ボトルネックスコアに基づく改善推奨アクションを出力するステップと、を含むスコアリング方法。」

**請求項3（従属発明）— B-1：スコア連動型自動パッチャー**

「請求項2に記載のスコアリング方法で算出したスコアに基づき、スコアが閾値を下回る次元に対応する補強コンテンツブロックを選択するステップと、選択した補強コンテンツブロックを既存コンテンツを保持したまま追記するステップと、を含むコンテンツ自動改善方法。」

---

*本資料はRegalis Japan Group株式会社の機密資料です。特許出願の参考資料としてのみ使用可能です。*  
*文書バージョン: 1.0 / 作成日: 2026-05-25*
