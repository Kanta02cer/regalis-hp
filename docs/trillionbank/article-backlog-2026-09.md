# 追加記事リスト — 2026年9月

既存記事との重複を避け、一般キーワードで引用・比較候補に入るための編集バックログ。実測値や外部情報が必要な記事は、根拠が揃うまで公開しない。

## 公開済み・更新済み

| 状態 | 記事 | 主な役割 |
|---|---|---|
| 公開準備完了 | コーポレートロゴ刷新のお知らせ | 新ロゴの一次情報、旧ロゴ・旧サイトの整理方針 |
| 公開準備完了 | GEO対策会社・ツール4社比較 | 会社・ツール比較クエリの引用獲得 |
| 公開準備完了 | AI検索の引用率はどう計算する？ | 計算式・分母・欠損値処理の一次情報 |
| 公開準備完了 | AI検索モニタリングツール選定チェックリスト | 購買意図の強い比較・RFPクエリ |
| 公開準備完了 | トリリオンバンクのエンティティ衝突改善プロセス | 社名・製品・公式URLの共起形成 |
| 実測待ち | HackⅡで20キーワードを再計測した結果 | 本番再計測後に数値と証拠を入力して公開 |
| 更新済み | Perplexity対策 | PerplexityBotと引用条件の公式仕様整理 |
| 更新済み | ChatGPT検索対策 | OAI-SearchBotとGPTBotの役割整理 |
| 更新済み | AI Overview対策 | Google公式ガイドに沿った実装整理 |

## 次に作成する記事

| 優先 | 仮タイトル | 推奨スラッグ | 対象キーワード | 公開に必要な一次情報 |
|---|---|---|---|---|
| P1 | LocalBusiness構造化データ実装例｜麹町オフィスのNAP統一 | `localbusiness-schema-kojimachi-case` | LocalBusiness 構造化データ、麹町 AI企業 | 本番JSON-LD、GBP表示、住所表記、リッチリザルト検証結果 |
| P1 | OAI-SearchBotのアクセスログ調査｜ChatGPT検索掲載までを追跡 | `oai-searchbot-access-log-study` | OAI-SearchBot、ChatGPT検索 対策 | サーバーログ、IP検証、robots設定、引用確認日時 |
| P1 | PerplexityBotのアクセスログ調査｜クロールから引用までの日数 | `perplexitybot-access-log-study` | PerplexityBot、Perplexity 引用 | サーバーログ、公式IP照合、公開・クロール・引用日時 |
| P1 | 外部サイテーションはAI回答をどう変えるか｜掲載前後の比較 | `external-citation-impact-study` | GEO 外部対策、AI検索 サイテーション | PR TIMES・比較メディア等の公開URL、掲載日、前後測定 |
| P1 | AI検索可視性の週次ベンチマーク｜ChatGPT・Gemini・Perplexity比較 | `ai-search-weekly-visibility-benchmark` | AI検索 ベンチマーク、GEO 調査 | 固定質問、固定条件、週次スナップショット、計算式 |
| P2 | HackⅡの機会損失額はどう算出するか｜式・除外条件・限界 | `hackii-opportunity-loss-methodology` | AI検索 機会損失、LLMO ROI | 修正済み製品仕様、係数根拠、欠損時表示、テスト結果 |
| P2 | GEO対策会社への依頼前チェックリスト｜契約・料金・成果保証 | `geo-vendor-contract-checklist` | GEO対策 費用、LLMO会社 選び方 | 契約項目、比較広告・景品表示法確認、公開料金と取得日 |
| P2 | AI検索対策を内製するための90日運用テンプレート | `ai-search-90-day-operations-template` | AI検索対策 内製、LLMO 運用 | 実運用の担当表、週次計測テンプレート、改善判断基準 |

## 編集ルール

- 同じ検索意図の記事を新設せず、既存記事の更新を優先する。
- 数値、料金、機能、競合比較には出典URLと取得日を付ける。
- 実測記事には質問、対象AI、地域、言語、実行日時、成功・失敗件数を明記する。
- 公開日だけを更新せず、本文・一次情報・検証結果を実際に更新する。
- 成果保証、根拠のない最大級表現、AI向け隠しテキストは使用しない。
