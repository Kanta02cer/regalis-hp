# AI検索をされる時代のパートナー化 キーワード・記事・問い合わせ設計

作成日: 2026-08-30  
対象: 株式会社トリリオンバンク / HackⅡ  
目的: 「株式会社トリリオンバンク = AI検索をされる時代のパートナー」として、非指名検索からAI検索相談・HackⅡ商談へつなげる。

## 1. ブランドの置き方

公開サイト上では、以下の表現を中心に使う。

> 株式会社トリリオンバンクは、AIに検索・引用・比較される時代のパートナーです。

AI検索対策は「AIに出す裏技」ではなく、企業情報を人とAIの両方に正しく読まれる状態へ整える仕事として定義する。

- 会社: 株式会社トリリオンバンク = AI検索時代の情報流通を整える会社
- サービス: HackⅡ = AI回答内の候補入り・引用・競合SOVを測り、改善につなげるService-led SaaS
- 顧客価値: 見えない比較検討を、問い合わせ前のマーケティング指標に変える
- 注意: AI検索での表示、問い合わせ、売上の成果保証はしない

## 1.1. 公式情報を踏まえた実装前提

2026年8月時点では、AEO/GEOを「特殊なタグでAI検索だけを操作する施策」として扱わない。公式情報に合わせて、以下を前提にする。

- Google検索のAI機能では、従来のSEO基本施策が引き続き土台になる
- 重要コンテンツはテキストで読める状態にし、内部リンクで発見しやすくする
- 構造化データは、ページ上に見えている内容と一致させる
- `llms.txt` はGoogle検索で必須ではなく、ランキングや可視性を直接高める前提にしない。他のAIサービスや社内運用向けの軽量目次として扱う
- FAQPageはSchema.orgの語彙として使えるが、Google検索でFAQリッチリザルトを出す目的では使わない。読者とAIが理解しやすいFAQブロックを作ることを主目的にする
- ChatGPT検索に出典として拾われる可能性を高めるため、`OAI-SearchBot` をブロックしない
- `Google-Extended` はGemini関連の学習・グラウンディング制御用であり、Google検索の登録やランキングシグナルではない

参考:

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
- https://platform.openai.com/docs/bots

## 2. 100キーワードの正本

100キーワードの優先順位データは、以下を正本とする。

- `_data/ai_search_partner_keywords.yml`

このファイルでは、各キーワードに以下を持たせている。

- 優先順位: 1-100
- 優先グループ: P0 / P1 / P2 / P3
- クラスター: AI検索計測、支援会社、Gemini、Google AI、構造化データ、業種別、料金、販売代理店など
- 検索意図: 課題認知、情報収集、比較、導入検討、購買、実装
- slug: 記事化する際のURL候補
- content_type: pillar / comparison / guide / technical-guide / industry-guide / pricing-guide / partner-guide
- status: planned / published

## 3. 最優先20キーワード

まずは問い合わせに近いP0を優先する。

| 優先 | キーワード | 狙い | 作るべきページ |
|---:|---|---|---|
| 1 | AI検索 効果測定 | AI検索施策の必要性を認識した層 | 基幹記事 |
| 2 | AI検索対策 会社 | 支援会社を探す層 | 比較・選定記事 |
| 3 | GEOコンサルティング 会社 | GEO支援会社を探す層 | 比較・選定記事 |
| 4 | AEO支援会社 | AEOを外注したい層 | 比較・選定記事 |
| 5 | LLMO対策 会社 | LLMO支援会社を探す層 | 比較・選定記事 |
| 6 | AI検索 競合分析 | 競合に負ける理由を知りたい層 | 手順記事 |
| 7 | AI検索 SOV | マーケティング指標化したい層 | 指標解説記事 |
| 8 | 生成AI引用分析 | 引用URLを管理したい層 | 手順記事 |
| 9 | AIブランド可視性 ツール | ツール比較層 | ツール選定記事 |
| 10 | Google Search Console AI | GSCの新レポートを調べる層 | 解説記事 |
| 11 | 生成AI検索レポート | 社内報告の型を探す層 | レポート記事 |
| 12 | AI検索 問い合わせ | AI検索からCVへつなげたい層 | 導線改善記事 |
| 13 | AI検索マーケティング支援 | 支援サービスを検討する層 | サービス記事 |
| 14 | AI検索最適化ツール | ツール導入比較層 | 比較記事 |
| 15 | ChatGPTブランド分析 | ChatGPTでの見え方を知りたい層 | 分析記事 |
| 16 | Gemini 引用率 | Geminiでの引用を増やしたい層 | 測定記事 |
| 17 | Gemini 言及率 | Geminiでの言及を増やしたい層 | 測定記事 |
| 18 | Perplexity SEO対策 | 引用型AI対策を知りたい層 | 実装記事 |
| 19 | ChatGPT 引用される方法 | AI引用の基本を知りたい層 | 実装記事 |
| 20 | AI検索流入 計測 | GA4やフォームとつなげたい層 | 計測記事 |

## 4. 10記事の初期作成案

まず追加する記事は、非指名検索から商談に近い順に作る。

| 順 | 記事タイトル案 | 主キーワード | 役割 | CTA |
|---:|---|---|---|---|
| 1 | AI検索対策会社の選び方｜AEO/GEO/LLMO支援で見るべき7つの基準 | AI検索対策 会社 | 会社比較の入口 | HackⅡ相談 |
| 2 | GEOコンサルティングとは｜企業サイトをAIのデータソースにする実装手順 | GEOコンサルティング 会社 | GEOの定義と実装 | HackⅡ相談 |
| 3 | AEO支援会社に依頼できること｜FAQ・構造化データ・問い合わせ導線の整え方 | AEO支援会社 | 依頼範囲の明確化 | フォーム相談 |
| 4 | AI検索SOVとは｜Gemini・ChatGPT・Perplexityで競合比較を測る方法 | AI検索 SOV | 指標の所有 | 無料相談 |
| 5 | 生成AI引用分析とは｜AIが引用するURLを見つけて改善する方法 | 生成AI引用分析 | 引用URL分析の所有 | HackⅡ相談 |
| 6 | Google Search Consoleの生成AI検索レポートで分かること・分からないこと | Google Search Console AI | 公式ニュースへの対応 | HackⅡ相談 |
| 7 | Geminiで引用・言及される企業サイト設計｜AIに読まれる公式情報の作り方 | Gemini 引用率 | Gemini対策 | フォーム相談 |
| 8 | AI検索から問い合わせを増やすには｜記事・FAQ・フォーム導線の設計 | AI検索 問い合わせ | CV導線 | フォーム相談 |
| 9 | AI検索の誤情報対策｜古い会社情報・料金・実績を正しく直す手順 | AI検索 誤情報 対策 | ブランド保護 | HackⅡ相談 |
| 10 | AI検索支援を販売代理店メニューにする方法｜SEO会社・制作会社向け設計 | AI検索対策 代理店 | パートナー獲得 | 販売代理店相談 |

各記事に必ず入れる要素:

- 冒頭に太字の定義文を1文入れる
- H2で「とは」「なぜ必要か」「実装手順」「測定方法」「よくある質問」を入れる
- 目に見えるFAQを4-6問入れる。FAQPage JSON-LDを入れる場合は、表示内容と完全に一致させる
- Article JSON-LDの `image` を設定する
- 公式情報、Google公式情報、Formrun/GA4等の一次情報にリンクする
- CTAは `/trillionbank/contact/#form` と `/trillionbank/meeting/` の2つに集約する
- 成果保証表現は禁止する

## 5. プレスリリース・自社お知らせ案

事実として公開できるものだけを「お知らせ」にする。未確定の提携、導入社数、特許、世界初/日本初/業界唯一は承認なしで使わない。

| 優先 | 種別 | タイトル案 | 公開条件 |
|---:|---|---|---|
| 1 | お知らせ | AI検索時代の企業サイト設計に向け、100キーワード戦略を策定 | 今回の設計書を公開する場合 |
| 2 | お知らせ | HackⅡ、AEO/GEO/SEO実装支援を含むService-led SaaS提供範囲を整理 | サービス範囲の正本が確定した場合 |
| 3 | お知らせ | AI検索の現状診断・導入相談の受付導線を強化 | Formrun通知・対応フローが設定済みになった場合 |
| 4 | お知らせ | Google Search Console生成AI検索レポートに対応したAI検索可視性レポート設計を公開 | レポート項目が確定した場合 |
| 5 | 研究発信 | HackⅡ Research: AI検索での候補入り・引用・SOVの公開測定を開始 | 公開可能な測定条件と免責が整った場合 |

## 6. 問い合わせにつなげる仕組み

非指名検索から来たユーザーは、まだ会社名を知らない。したがって記事のCTAは「お問い合わせ」ではなく、悩みの言葉で出す。

推奨CTA:

- AI検索で自社がどう見られているか相談する
- Gemini・ChatGPTでの引用状況を確認する
- 競合に推薦されている理由を確認する
- HackⅡの詳細説明を予約する
- 販売代理店として共同提案を相談する

フォームで取得したい項目:

- 会社名
- 氏名
- メールアドレス
- 会社URL
- 相談種別: AI検索診断 / HackⅡ導入 / 販売代理店 / Pay per Crawl / 取材 / その他
- 気になっているAI: Gemini / ChatGPT / Perplexity / Claude / Google AI Overviews / 未定
- 競合名
- 現在の課題
- 希望時期
- 予算感
- 参照元記事または流入キーワード

運用ステータス:

- 新規
- 返信待ち
- ヒアリング済み
- 商談予約済み
- 提案中
- 受注
- 見送り

記事ごとの計測:

- `ai_referral_visit`: AI参照元や `utm_source=chatgpt/gemini/perplexity` 付き来訪
- `ai_assisted_cta_click`: AI起点セッションでのフォーム・商談予約クリック
- form.run送信数
- 商談予約数
- 記事別問い合わせ数
- キーワード別Search Console流入

## 7. Formrunのメール通知設定

サイト側ではフォーム埋め込み済み。回答時にメール通知を飛ばす設定は、Formrun管理画面で行う。

対象フォーム:

- Formrun ID: `@ka-inoue-rI22cTKYN9W7iffH1qpz`
- サイト側URL: `https://trillion-bank.jp/trillionbank/contact/`
- 直接URL: `https://form.run/@ka-inoue-rI22cTKYN9W7iffH1qpz`

設定手順:

1. Formrun管理画面で対象フォームを開く
2. フォーム設定画面を開く
3. 「メール通知設定」または「受信通知」を開く
4. 「フォームが回答されたとき」または「メール通知ON」にチェックを入れる
5. 通知先メールアドレスに `ka.inoue@trillion-bank.com` を設定する
6. 複数通知が使えるプランの場合は `ri.hirakawa@trillion-bank.com` も追加する
7. 「受信通知に回答内容を表示する」をONにする
8. 更新して、テスト送信する

注意:

- Formrun公式FAQでは、Formrunアカウントを持っていないメールアドレスにも通知可能と案内されている
- STARTER / PROFESSIONALでは複数通知先を最大40件まで登録可能と案内されている
- FREE / BEGINNERへ変更した場合、複数通知先が制限される可能性がある
- 通知が遅れる場合は、受信メールサーバーの制限やチャット通知も確認する

参考:

- https://faq.form.run/faq/advanced-email-settings
- https://faq.form.run/faq/frequent-question-card-mail-notification
- https://faq.form.run/faq/notification-mail

## 8. AEO/GEO/SEO実装の基本セット

各記事・ページで最低限実施する。

| レイヤー | 対応内容 | 対象ファイル |
|---|---|---|
| コンテンツ | 定義文、FAQ、比較表、手順、注意書き、CTA | `_tbnews/*.md` |
| 構造化データ | Article、FAQPage、BreadcrumbList、Service、Organization | `_tbnews/*.md`, `_layouts/tb-article.html` |
| AI向けテキスト | llms.txt、llms-full.txt、llms-gemini.txt、llms-chatgpt.txt、llms-aio.txt。Google検索向けの必須施策ではなく、他AIや社内運用向けの要約目次として扱う | `llms*.txt` |
| ナレッジ | entity、product、service、Article、FAQの整合 | `knowledge.json`, `ai-patch.json` |
| サイト構造 | 重要ページ、記事、問い合わせ導線の正規URL整理 | `site-structure.json` |
| 計測 | AI流入、CTAクリック、フォーム送信、商談予約 | GA4, Formrun, `/trillionbank/contact/` |

## 9. 進め方

1. P0キーワード20件を優先して、記事10本を作る
2. 既存記事と重なるものはリライトではなく内部リンクで束ねる
3. 各記事から必ず問い合わせフォームと商談予約へ導線を置く
4. Formrun通知をONにし、問い合わせ対応ステータスを統一する
5. 公開後はSearch Console、AI回答監査、Formrun送信数を月次で見る

## 10. 禁止表現

以下は承認なしで使わない。

- 必ず上位表示
- 必ず引用される
- 必ず問い合わせが増える
- AI検索を完全測定
- すべてのAIに対応
- 世界初 / 日本初 / 業界唯一
- 導入企業多数
- 提携済み / 共同開発済み

使う表現:

- 支援する
- 測定する
- 可視化する
- 整備する
- 再計測する
- 改善優先度を提示する
- 対応範囲は契約時点で確定する
