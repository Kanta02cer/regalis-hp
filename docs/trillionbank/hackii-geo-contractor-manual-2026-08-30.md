# HackⅡ GEO対応サービス・社内運用チェックリスト

作成日: 2026-08-30  
対象: HackⅡのAEO/GEO/SEO実装を外部エンジニアへ業務委託する際の作業範囲定義

## 1. 目的

HackⅡを「AI検索での候補入り、競合との差、引用元、AI流入を測り、改善実装まで行うService-led SaaS」として提供するため、サイト上の正規情報、AI向けファイル、構造化データ、記事、レポート導線を一貫させる。

成果保証や未確定料金は記載しない。HackⅡは「開発中・導入相談受付」「対応AI・質問数・分析範囲・実装範囲は契約時点で確定」と明記する。

## 2. ルート直下の整理方針

上から順に確認したルート直下の主な扱い。

| 対象 | 扱い | 方針 |
|---|---|---|
| `.bundle` | 内部 | 公開対象外。触らない。 |
| `.claude` / `.codex` | 内部 | 作業設定。公開・編集しない。 |
| `.devcontainer` | 内部 | 開発環境用。公開対象外。 |
| `.github` | 運用基盤 | GitHub Pages、llms更新、IndexNowの設定。変更時は必ず差分確認。 |
| `.playwright-mcp` / `screenshots` | 検証結果 | 公開不要。ビルド対象外。 |
| `AGENTS.md` / `CLAUDE.md` | 内部手順 | 公開対象外。今回のサイト本文には転記しない。 |
| `AIO-Hack2_package` | 旧内部資料 | 公開導線から外す。物理削除は参照元確認後。 |
| `_config.yml` | 運用基盤 | コレクション、include/exclude、URL設定を管理。 |
| `_data` | 運用基盤 | 事業情報・キーワード管理。 |
| `_includes` / `_layouts` | 運用基盤 | 共通ヘッダー、フッター、記事テンプレート、構造化データ。 |
| `_news` | 旧記事 | 新規追加禁止。新正本は `_tbnews`。サイトマップ・フィード・AIファイルから外す。 |
| `_tbnews` | 新記事 | ブログ・お知らせ・HackⅡレポートの正本。 |
| `_regalis-backup` | 旧バックアップ | 公開不要。物理削除は参照元確認後。 |
| `about` / `business` / `company` / `contact` / `enterprise` / `talent` / `works` | 旧URL・補助ページ | 正規URLは `/trillionbank/` 配下へ寄せる。必要なページのみ統合・リダイレクト。 |
| `admin` / `verify` / `scan.html` / `scan-simulator.html` / `ai-coupon-system` / `adctor` | 内部・検証用 | 公開導線・クロール対象から外す。 |
| `assets` / `images` / `logo` | 公開アセット | 使っている画像・CSSのみ残す。未使用画像は後続で棚卸し。 |
| `docs` | 内部資料 | `docs/trillionbank` は公開対象外。契約・提案系の詳細はここに置く。 |
| `feed.xml` / `sitemap*.xml` / `robots.txt` | クロール制御 | `_tbnews` と正規ページを優先。旧記事は露出を抑える。 |
| `llms*.txt` / `knowledge.json` / `ai-patch.json` / `site-structure.json` | AI向け正規情報 | HackⅡの最新提供範囲と同期。古い価格・成果保証・旧ブランド表現は入れない。 |
| `node_modules` / `vendor` | 依存関係 | 公開不要。ビルド対象外。 |
| `trillionbank` | 公開の正本 | 会社・事業・ニュース・問い合わせはここを正規導線にする。 |

## 3. HackⅡパッケージに含めるサービス

| モジュール | 内容 | 主な成果物 |
|---|---|---|
| AI Search Audit | AI検索での現在地、競合との差、引用元、誤情報を確認 | 現状診断、質問別Win/Loss、引用チャネル分類 |
| Technical Foundation | サイト・AI向けファイル・構造化データを整備 | JSON-LD、llms.txt、llms-full.txt、knowledge.json、site-structure.json、robots.txt、sitemap |
| Content & FAQ | AIが回答しやすい本文構造を作る | FAQ、比較表、導入事例、料金条件、対象外条件、記事 |
| AI Referral Measurement | AI流入と問い合わせ前行動を測る | `ai_referral_visit`、`ai_assisted_cta_click`、UTM/ai_source設計 |
| Citation & PR Backlog | AIが参照する外部情報源を整備する | 比較メディア、業界メディア、ニュース、レビュー、販売代理店ページの優先順位 |
| Remeasure Report | 施策後に同条件で再計測する | 前後比較レポート、改善バックログ更新 |
| Partner Enablement | 販売代理店・運用パートナー向けに提供する | 共同提案資料、顧客説明文、月次レポート説明、役割分担表 |

## 4. 作成・更新するファイル

| 種類 | ファイル | 作業 |
|---|---|---|
| 事業ページ | `trillionbank/business/hack2/index.html` | HackⅡのサービス範囲、FAQ、CTA、JSON-LDを更新 |
| 事業ページ | `trillionbank/business/hack2/index.html` | 顧客向けに公開できるHackⅡのサービス概要だけを掲載 |
| 既存ガイド | `trillionbank/guide/agency-co-proposal/index.html` / `trillionbank/guide/inhouse-or-outsource/index.html` | 新マニュアルへの内部リンクを追加 |
| 記事 | `_tbnews/YYYY-MM-DD-slug.md` | 新規記事は必ず `_tbnews` に作成 |
| AI向け | `llms.txt` / `llms-full.txt` / `llms-chatgpt.txt` / `llms-gemini.txt` / `llms-claude.txt` | 最新ページとサービス範囲を追記 |
| JSON | `knowledge.json` / `ai-patch.json` / `site-structure.json` | 主要URL、Service、FAQ、実装範囲を同期 |
| クロール | `sitemap.xml` / `sitemap-news.xml` / `feed.xml` / `robots.txt` | 新正本を優先し、旧記事の露出を抑制 |
| 自動化 | `tools/generate_llms.py` / `scripts/submit-indexnow.js` | 自動更新が `_tbnews` と正規ページを向くよう修正 |

## 5. 新たに作るべき記事

1. AEO対策会社の選び方
2. GEO対策会社の選び方
3. AI検索対策会社の比較基準
4. llms.txtとJSON-LDの実装チェックリスト
5. ChatGPTに引用される公式情報の作り方
6. Perplexityで引用元になるページ構造
7. Gemini / Google AI Overviewで読まれるSEO基盤
8. AI流入計測とGA4イベント設計
9. 販売代理店向けAI検索支援の提案手順
10. 業界別GEOパック
11. AI回答Win/Lossレポートの読み方
12. 外部引用・PRがAI検索に効く条件

## 6. 納品基準

- JSON-LDは有効なJSONである。
- JSON-LDと本文の内容が一致している。
- `llms.txt`、`llms-full.txt`、`knowledge.json`、`ai-patch.json`、`site-structure.json` のURLが一致している。
- サイトマップ、ニュースサイトマップ、フィードに新正本が載っている。
- 顧客向けHackⅡ導線では、代理店表現を「販売代理店」に統一している。
- 「必ず表示される」「必ず引用される」「売上を保証する」といった断定表現がない。
- フォーム、商談予約、問い合わせ導線が画面上で見える。
- PCとスマートフォンで、見出し・表・ボタンがはみ出さない。
- ビルド、JSON検証、構造化データ抽出確認を行っている。
- 公開後に主要URLの表示確認、サイトマップ送信、IndexNow送信を行っている。

## 7. 参照基準

- Google 構造化データの一般ガイドライン: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google robots.txt の概要: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Google クローラー一覧: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Schema.org Service: https://schema.org/Service
- llms.txt 仕様: https://llmstxt.org/
