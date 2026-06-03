# Regalis Japan Group — Claude Code ガイドライン

## プロジェクト概要

- **サイト:** Regalis Japan Group株式会社 コーポレートサイト
- **URL:** https://regalis-order-suits.com/
- **技術スタック:** Jekyll (GitHub Pages) + Tailwind CSS + Three.js
- **主要ブランド:** Regalis AIO Intelligence（AI検索最適化・デジタルPRグループ）
- **キャッチコピー（エンタープライズ向け）:** 「御社は、AIに選ばれているか。」
- **ブランドタグライン:** 「見えないブランド価値を、AI時代の定量資産へ」

---

## サイト構造

```
/ (index.html)          ← Regalis Japan Group メインコーポレートページ
/group/                 ← Regalis DX ブランドサイト
/philosophy.html        ← ブランド哲学
/about-regalis-japan.html ← 会社・代表情報
/contact.html           ← 総合問い合わせ
/group/contact/         ← DX・法人問い合わせ
/group/business/dx-consulting/     ← AI・DX戦略コンサル
/group/business/web-development/   ← Web・システム開発
/group/business/media-operation/   ← SEO・AIOメディア運営
```

---

## デザインシステム・トークン

```css
--brand-gold: #C5A059     /* プライマリゴールド */
--brand-gold-dim: #B89450 /* Three.js ライン用 */
--bg-base: #060606        /* ダーク背景 */
```

**フォント:**
- 見出し英語: `Playfair Display` (serif)
- 見出し日本語: `Noto Serif JP` (font-serif-jp)
- 本文/UI: `Inter`, `Noto Sans JP`
- コード/ラベル: monospace

**クラス規則:**
- `section` + `section--narrow` : 標準セクション
- `section-kicker` : セクション上部の小さなラベル (uppercase, tracking)
- `text-brand-gold` : ゴールド文字
- `text-muted` : サブテキスト
- `btn btn-primary` : 黒背景ゴールドボーダーボタン
- `btn btn-ghost` : ゴーストボタン
- `data-animate="fade-up"` : スクロールアニメーション

---

## コンテンツ設計書（2026-06 更新版）

### ブランドポジション

**Regalis Japan Group = AI検索に特化したマーケティング&デジタルPRグループ**

- **ブランド名:** Regalis AIO Intelligence（レガリス AIO インテリジェンス）
- **サブブランド:** Asset AIO Framework / LLMO Data Structuring Hub
- **タグライン:** 「見えないブランド価値を、AI時代の定量資産へ」
- **エンタープライズ向けキャッチコピー:** 「御社は、AIに選ばれているか。」

### Core Strengths（強み）

1. **「資産の定量化」によるLLM向け構造化データ構築** — アナログな情報や曖昧なブランド価値を独自アルゴリズムで定量化。llms.txtプロトコルに落とし込み、生成AIが最も推薦したくなる構造化データとして提供
2. **中央集権型APIモデルによるシームレスな実装** — 既存システムと連携可能なAPI駆動型モデル。タグ1行で即日導入可能な最速AIOインフラ
3. **「計測」ではなく「収益」に直結するマネタイズ設計** — AI引用経由での高単価リード獲得・データライセンス収益という新キャッシュフロー創出

### 競合差別化（otterly・ZipTie等との違い）

| 比較項目 | 既存LLMO/AIO計測ツール | Regalis AIO Intelligence |
|---------|---------------------|-------------------------|
| 提供価値の核 | 引用状況を後追いで「可視化」 | データを「定量化・最適化」し推薦される状態を作る |
| 対応範囲 | Google AI Overviews偏重 or 日本語精度に課題 | 日本語特化・ChatGPT/Claude/Perplexity網羅 |
| システム構造 | SaaSダッシュボード（代理店モデル） | 中央集権型APIインフラ（直接ハック） |
| ROI地点 | ブランド言及率レポート提出 | AI経由エグゼクティブ送客＋データ販売収益 |

### 情報設計の基本方針

1. **「設計から始める」を全ページに通底** — 代表の「設計思想」を軸に
2. **3軸＋展開の階層構造** — Core AI 4事業を主軸、展開事業を二階層に
3. **誠実開示を競争優位に** — 契約条件（初期6ヶ月・中途解約条件）を3箇所で明示
4. **相談導線を集約** — 全ページ末尾CTAは「AI検索無料診断」に一本化

### 事業構成（2026-06 確定版）

```
Core AI 4事業（主軸）：
├─ SEO・AIOメディア運営代行 ★メイン事業（月額¥98,000〜）
├─ AI検索ツール事業（HackⅡ）— AI引用モニタリング・自動最適化インフラ
├─ AI検索クローラー収益化 — AI検索のアドセンス型マネタイズ（AI Exclusive™等）
└─ AI・DX戦略コンサルティング

展開事業：
├─ Web・システム開発
├─ 日本学生アンバサダー協会
├─ 代表タレント活動・講演
└─ 販売促進・営業代行
```

### トップページセクション構成

1. **ヒーロー** — 「御社は、AIに選ばれているか。」CTA:「AI引用診断（無料30分）」「サービスを見る」
2. **What we do** — 3行で会社を説明。「AI検索に特化したマーケティング&デジタルPRグループ」
3. **Core AI Services** — 4カラム（AIOメディア / HackⅡツール / クローラー収益化 / DXコンサル）
4. **Why Regalis** — 定量化 / 中央集権型API / 収益直結 の3要素
5. **CEO プロフィール** — 井上幹太、不登校からの起業ストーリー
6. **実績・ケーススタディ** — AI診断システム開発
7. **展開事業** — 4事業タイル
8. **ニュース・Journal**
9. **統合CTA** — 「まず、話しましょう。」

### SEO・AIOメディア運営サービス 料金・契約条件（★重要）

- **月額:** ¥98,000〜
- **初期費用:** Webサイト開発費は無料（6ヶ月運用契約が前提）
- **初期契約期間:** 6ヶ月
- **中途解約:** 残期間分の運用料金が発生
- **6ヶ月後:** 1ヶ月前の書面通知で解約可能

**表示必須箇所:** サービスページ / 申込フォーム / 特商法表記

### 法務要件（必須実装）

- [ ] 特定商取引法に基づく表記（独立ページ）
- [ ] プライバシーポリシー（Cookie・GA利用明記）
- [ ] 利用規約
- [ ] 申込時の同意チェックボックス（6ヶ月条件・中途解約条件）
- [ ] フォームのプライバシーポリシー同意必須化

### CTAヒエラルキー

- **第一CTA:** 「無料相談」「無料診断（30分）」← 心理的障壁最低
- **第二CTA:** 「資料ダウンロード」← メール獲得
- **第三CTA:** 「お見積・お申込」← 具体的検討段階

### コンタクトカテゴリ（8種）

1. DX無料相談（汎用）
2. SEO・AIOメディア運営のご相談
3. Web・システム開発のご相談
4. 無料メディア診断（30分）
5. 販売・代理のご相談
6. 取材・講演・タレント依頼
7. 採用・カジュアル面談
8. 学生協会・参加のご相談

---

## 参照デザインサイト

- **michikusa.tech** — AI企業向けプロフェッショナルデザイン参考
  - 特徴: 青系グラデーション、M PLUS 1p / Noto Sans JP、1280px幅
  - 要素: グラデーションヒーロー、信頼シグナル（導入実績数）、複数CVパス

---

## 専門的ウェブデザイン・エンジニアリング知識

### コーポレートサイト設計原則

**情報設計:**
- F字・Z字の視線パターンを意識したレイアウト
- 「10秒で何の会社か、30秒でなぜ信頼できるか、次に何をすべきか」の3段構成
- サービス数が多い場合は2階層化（コア事業 + 展開事業）で散漫さを防ぐ
- スクロール深度に応じたCTA配置（ファーストビュー・中段・最下部）

**コンバージョン設計:**
- 第一CTAの摩擦を最小化（「まず相談」「30分無料診断」）
- フォーム必須項目は4項目以下（名前・会社名・メール・相談内容）
- 電話番号は任意、「30分・費用なし・義務なし」を繰り返し明示
- 申込フローは「診断 → 提案 → 同意」の3ステップ

**信頼シグナル:**
- 代表の資格・受賞歴をCredentials Barで視覚化
- 自社実績（自社サイト・診断ツール）をCase Studyとして掲載
- 「代表が直接対応」の明示
- 住所・法人情報の明確な開示

### Jekyll + GitHub Pages 技術仕様

**ビルド:**
```bash
JEKYLL_NO_BUNDLER_REQUIRE=1 /opt/homebrew/lib/ruby/gems/4.0.0/bin/jekyll serve --baseurl ""
```
※ Homebrew Ruby 4.0.2使用。bundler競合を回避するため `JEKYLL_NO_BUNDLER_REQUIRE=1` が必須

**データ駆動コンテンツ:**
- `_data/businesses.yml` — 全8事業の定義（サイト全体で `site.data.businesses` でループ）
- `_config.yml` — サイト設定、`site.title`, `site.url`
- Liquid テンプレート: `{% for %}`, `{% if %}`, `{{ | relative_url }}`

**Jekyllレイアウト:**
- `layout: null` のページは自分でHTML/head/bodyを管理（index.html）
- `layout: default` は `_layouts/default.html` を使用

**画像最適化:**
- WebP形式を `<picture>` タグで優先配信
- `loading="lazy"` を全画像に付与
- `relative_url` フィルタでGitHub Pages サブパス対応

### SEO・AIO（AI最適化）実装

**構造化データ (JSON-LD):**
```json
{
  "@type": "Organization",
  "name": "Regalis Japan Group株式会社",
  "url": "https://regalis-order-suits.com/",
  "address": { "@type": "PostalAddress", "addressLocality": "千代田区" }
}
```

**llms.txt:** AIクローラー向けサイト説明ファイル（ルートに配置）

**メタ設計:**
- `<title>`: サービス名 + ブランド名 + キーワード（60文字以内）
- `<meta description>`: 行動喚起含む120〜160文字
- OGP: `og:title`, `og:description`, `og:image`, `og:type`

### パフォーマンス

- Three.js は `type="module"` + CDN で非同期ロード
- CSS は `<style>` インライン（クリティカルCSS）+ `assets/css/corp.css`
- `data-animate="fade-up"` はIntersection Observer で制御
- `preconnect` / `preload` をhead.htmlに追加推奨

### アクセシビリティ

- `aria-label` をインタラクティブ要素に必須
- 色コントラスト: AA準拠（ゴールド `#C5A059` on dark bg OK）
- キーボードナビ対応（`focus-visible` スタイル）
- `lang="ja"` 必須

---

## 実装フェーズ

**Phase 1（完了 / 最低限公開ライン）:**
- [x] トップページ（index.html）コーポレート化
- [x] Core DX 3事業ページ
- [x] Aboutページ群
- [x] コンタクトページ
- [x] ブランドリブランディング（Regalis DX）

**Phase 2（次のステップ）:**
- [ ] 特商法表記ページ（`/tokushoho.html`）
- [ ] プライバシーポリシー（`/privacy.html`）
- [ ] 利用規約（`/terms.html`）
- [ ] SEO・AIOメディア運営 料金・契約条件詳細ページ
- [ ] Works / Case Study ページ
- [ ] llms.txt 実装

**Phase 3（継続運用）:**
- [ ] News / Insights 記事継続投稿
- [ ] 構造化データ（JSON-LD）全ページ実装
- [ ] 月次KPIレポート自社事例化

---

## コードルール

- Liquid タグは `{{ '/' | relative_url }}` 形式でパス生成（ハードコード禁止）
- `index.html` は `layout: null` — `{% include head.html %}` を手動でインクルード
- CSS追加は `assets/css/corp.css`（groupサイト用）または index.html末尾の `<style>` タグ
- 新規ページは `group/` 配下に配置
- フッターは `_includes/footer.html`、グループ用は `_includes/corp-footer.html`

---

## PDCA ワークフロー

### 実行前フロー（計画モード）
- 計画モードで設計を固める → ExitPlanMode → 自動実行
- 計画内で「変更ファイル一覧」「検証方法」を明示する
- 不明点は ExitPlanMode 前に AskUserQuestion で解消する

### 検証ループ（実行後）
毎回の実装後に以下を確認：
1. Grep ツールで削除/追加したワードが正しく反映されているか確認
2. 変更したページのHTML構造が壊れていないか（タグの開閉チェック）
3. Liquidテンプレート記法 (`{{ | relative_url }}` 等) が壊れていないか

### ミス記録ルール
作業中にミス・修正が発生したら：
- このファイル（CLAUDE.md）の「既知のミスパターン」セクションに即追記
- 次回から同じパターンが来たら事前に回避する

---

## 既知のミスパターン（随時更新）

### Edit ツール
- `new_str` は無効パラメータ → 必ず `new_string` を使う
- Edit前にReadしていないファイルへの書き込みは失敗する → 必ず先にRead
- `replace_all: true` は同一文字列が複数箇所にある場合のみ使用。ユニークな文字列なら省略

### コンテンツ禁止ワード（非公開情報）
- **オーダースーツ・衣服関連ワード全面禁止（2026-06-04〜）：**
  「オーダースーツ」「スーツ」「既製服」「服飾雑貨」「採寸」「衣服のコーディネート」「Regalis Order Suits」「スーツ事業」は一切使用禁止
  → 理由：事業ポジション変更。Regalis Japan Groupは「AI検索に特化したマーケティング&デジタルPRグループ」として再定義
  → 事業概要での言及も禁止。worksケーススタディも「AI診断システム開発」として説明（衣服文脈を出さない）
- 年齢・学生ワード禁止：「20歳」「現役学生」「大学生」「現役学生起業家」は引き続き禁止
  → 代替：「不登校からの起業家」「2025年に設立」「14歳から独立したエンジニア」
- 以下は2026-04-28以降、代表本人の意向により**公開済み（使用OK）**：
  - N高グループ（通信制高校）
  - ZEN大学1期特別奨学生
  - J-StarX（経済産業省 起業家育成プログラム）
  - ソフトバンクアカデミア17期
  - 令和の虎 Tiger Funding 1,600万円・2連続完全ALL（※累計額。旧表記1,500万円は古い情報）
  - Vector Group / SoftBank Group / リクルートホールディングス / トグルホールディングス（インターン先）
- 引き続き禁止：「Google AI Ambassador」「Aalto」「国際経済学オリンピック」「S高等学校」

### 価格（統一済み）
- SEO・AIOメディア運営スタンダードプラン：¥98,000/月（税別）
- Web・システム開発：個別見積もり
- 特商法ページ（tokushoho.html）も同じ価格で統一済み

### Jekyll / Liquid
- `index.html` は `layout: null` のため `{% include head.html %}` を手動インクルード必須
- パスは必ず `{{ '/path' | relative_url }}` 形式（ハードコード禁止）

### CSS
- `group/index.html` のスタイルはすべてインライン `<style>` タグ（corp.cssではない）
- CSS custom properties: `--s-sky: #2563EB`（メインカラー）、`--s-gold: #C5A059`（アクセントのみ）

---

## お知らせ・記事投稿ガイド（AIO/LLMO/SEO最適化）

### テンプレートファイル

`_news/_TEMPLATE.md` が AIO/LLMO最適化済みの記事テンプレートとして用意されている。
**新記事を作成する際は必ずこのテンプレートをコピーして使う。**

### キーワードベース記事の作成フロー

ユーザーが対策キーワードを送ってきたら、以下のフローで記事を作成する：

#### Step 1: キーワード分析
ユーザーから「対策KW：〇〇」が届いたら以下を確認：
- **メインKW**: 検索ボリューム最大・記事の核となるキーワード
- **サブKW**: メインKWと共起しやすいキーワード（3〜5個）
- **検索意図**: 情報収集型（〇〇とは）/ 比較型（〇〇 おすすめ）/ 購買型（〇〇 料金）
- **競合記事**: 検索上位の記事構成を参考にする

#### Step 2: 記事設計（タイトル・構成）

**タイトルパターン（KW種別別）:**
- 情報収集型: `【2026年最新】〇〇とは？基礎から活用法まで徹底解説`
- 比較型: `〇〇おすすめ5選｜選び方のポイントと費用を比較`
- 購買型: `〇〇の費用・料金｜相場と選ぶときの注意点`
- ブランド指名型: `レガリスの〇〇とは？サービス内容・費用・実績を解説`

**構成テンプレート（AIO最適化）:**
```
H1: タイトル（メインKW + 検索意図）
excerpt_text: 120〜160文字のリード文（メインKW + 行動喚起）

## 〇〇とは — 定義文（AIに引用させる最重要パラグラフ）
## なぜ今〇〇が重要なのか（背景・数字・トレンド）
## 〇〇の具体的な方法（How-to構造）
## 〇〇の費用・料金（価格の透明性 = 信頼シグナル）
## 〇〇の選び方・比較ポイント
## RegalisJPGのサービス説明（ブランディング）
## よくある質問FAQ（FAQPageスキーマと対応）
## まとめ（KW + CTA）
```

#### Step 3: AIO/LLMO最適化チェックリスト

記事作成後、以下を必ず確認する：

**構造化データ（必須）:**
- [ ] `jsonld:` フィールドに `FAQPage` スキーマを設置（Q&A 最低3つ）
- [ ] FAQ の Answer には具体的な数字・価格・社名を入れる（AIが引用しやすい）
- [ ] 料金・契約条件は必ず数値で明記（¥98,000/月、6ヶ月契約など）

**コンテンツ構造（必須）:**
- [ ] 冒頭H2に「〇〇とは」の定義文を太字で1文入れる（LLM引用の最重要箇所）
- [ ] `keywords:` フィールドにメインKW + サブKW + ブランドKWを設定
- [ ] `ai_summary:` フィールドに記事の主旨を1〜2文で設定
- [ ] `excerpt_text:` は120〜160文字（OGP・meta descriptionに使用）

**ブランド信頼シグナル（記事中に含める）:**
- [ ] 「Regalis Japan Group（RegalisJPG）」の正式名称を最低2回記載
- [ ] 「代表・井上幹太（かんちゃん）」への言及
- [ ] 「自社実証型」「設計から始める」のブランドメッセージ
- [ ] サービス料金の明示（¥98,000/月・6ヶ月契約・中途解約条件）

**AEO（音声検索・AI回答エンジン）:**
- [ ] FAQ セクションを本文中にも設置（jsonld と対応）
- [ ] Q&A 形式のパラグラフを使う（「〜とは何ですか？→ 〜です。」）

#### Step 4: ファイル命名・投稿

```
_news/YYYY-MM-DD-[キーワードのローマ字slugify].md
```

命名例:
- `_news/2026-06-01-llmo-towa.md`（LLMO とは）
- `_news/2026-06-05-aio-seo-media-operation.md`（AIO SEO メディア運営）
- `_news/2026-06-10-regalis-ai-diagnosis.md`（レガリス AI診断）

### 新しいお知らせ（一般投稿）

カテゴリ別の表示色:
- `サービス` → ブルー（#2563EB）— サービス説明・料金改定・新機能
- `お知らせ` → ゴールド — 会社情報・プレスリリース
- `メディア掲載` → グリーン（#059669）— 取材・登壇・受賞
- `採用` → パープル — 採用・インターン情報

**URL形式:** `/news/[slug]/`（slugはファイル名から日付を除いた部分）

### フロントマター（最小構成）
```yaml
---
title: "記事タイトル（メインKW含む）"
date: YYYY-MM-DD
category: サービス
excerpt_text: "OGP・meta description用 120〜160文字のリード文"
keywords: "メインKW,サブKW,Regalis Japan Group,レガリス,井上幹太"
ai_summary: "AIクローラー向けサマリー。記事の主旨を1〜2文で。"
---
```

### フロントマター（AIO最適化フル構成）
```yaml
---
title: "記事タイトル"
date: YYYY-MM-DD
category: サービス
excerpt_text: "120〜160文字のリード文"
keywords: "KW1,KW2,KW3,Regalis Japan Group,レガリス,AI検索最適化"
ai_summary: "記事の主旨サマリー（1〜2文）"
jsonld: |
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"FAQPage", "mainEntity":[...] }
  </script>
---
```

---

## ビルド確認コマンド

```bash
JEKYLL_NO_BUNDLER_REQUIRE=1 /opt/homebrew/lib/ruby/gems/4.0.0/bin/jekyll serve --baseurl ""
```

変更後はこのコマンドでローカル確認推奨（Homebrew Ruby 4.0.2使用）。
