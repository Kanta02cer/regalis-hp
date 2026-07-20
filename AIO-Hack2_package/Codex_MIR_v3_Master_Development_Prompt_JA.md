# Codex Master Development Prompt
## Marketing Intelligence Platform v3
### SEO / AIO / GEO / Competitive Intelligence / Business Impact / Execution Management

---

## 使い方

この文書を、対象リポジトリを開いた Codex にそのまま渡してください。

このタスクは大規模です。単発で全機能を雑に実装せず、既存リポジトリを調査したうえで、段階的に実装してください。  
Codex は、最初にリポジトリを監査し、`PLANS.md` と設計資料を作成した後、ブロッカーがない限り実装を継続してください。

---

# 0. あなたの役割

あなたは以下を兼務するプリンシパルエンジニアです。

- データプラットフォームアーキテクト
- SEO / AIO / GEO 計測設計者
- BtoB マーケティングアナリティクス責任者
- 競合インテリジェンス設計者
- SaaS プロダクトエンジニア
- セキュリティ・マルチテナント設計者
- レポーティング・可視化エンジニア
- 品質保証・テスト設計者

今回の目的は、現在の単発 SEO 競合調査レポートを、広告代理店が短期間に模倣できない水準の、証拠・時系列・AI検索・売上影響・施策実行を一体管理するプロダクション品質のマーケティング意思決定基盤へ改修することです。

製品の仮称は以下とします。

> Marketing Intelligence Platform v3  
> 略称: MIR v3

---

# 1. 最終成果

完成後のシステムは、単なる順位レポートではなく、次の問いへ証拠付きで回答できなければなりません。

1. 顧客が検索・AI検索で比較検討する際、自社はどこで候補に入り、どこで外れているか。
2. 競合は、どのキーワード・質問・ページ・外部媒体・引用元で優位か。
3. その差は、いつから、どの施策の前後で変化したか。
4. どのページ、FAQ、料金、事例、比較情報、構造化データを直すべきか。
5. 推奨施策の根拠となる SERP、AI回答、引用URL、ページ内容は何か。
6. 観測値・推定値・仮説を明確に分けられているか。
7. 流入、CV、商談、売上、粗利益へどの程度影響する可能性があるか。
8. 低位・標準・高位シナリオの前提は何か。
9. 実施した施策は、本当に指標改善と関連したか。
10. データ欠損、取得失敗、測定ブレ、AI回答の変動をどこまで信頼できるか。

---

# 2. 現在の参考ファイル

リポジトリ内または作業ディレクトリに以下が存在する場合、必ず読み込んでください。

```text
seo_report_20260720_115329.json
seo_report_20260720_115329.md
latest_seo_report.json
latest_seo_report.md
latest_mir_v2.json
latest_mir_v2.md
mir_v2_20260720_130937.json
mir_v2_20260720_130937.md
report_v2_data_dictionary.md
marketing_report_v2.schema.json
Claude_Code_SEO_AIO_Report_v2_Implementation_Prompt.md
```

ファイル名に `(1)`、`(2)` などが付く場合もあります。内容ハッシュで重複判定してください。

参考ファイルがリポジトリ外にある場合は、次へコピーして原本を変更しないでください。

```text
docs/reference-reports/
docs/mir-v3/
```

既存の v1 / v2 レポートは破棄せず、インポート互換と旧形式エクスポートを維持してください。

---

# 3. 現在のレポートで確認されている重大問題

以下は最優先で修正する既知不具合です。

## 3.1 値と説明文の矛盾

現在の v2 では、経営サマリー本文が「月間 9,801 件の機会」と記載している一方、構造化フィールドは `0` または未設定になっている箇所があります。

禁止事項:

- 本文だけに数字を埋め込む
- JSON と Markdown で値が異なる
- 欠損値を 0 として表示する

必須対応:

- すべての表示値は同一の metrics engine から取得する
- narrative は構造化値を参照して生成する
- JSON、HTML、Markdown、PDF、CSV の値を一致させる

## 3.2 未測定 AI 指標を 0 と表示

AI検索回答が未測定であるのに、AI可視性が 0 と表示されています。

必須対応:

```text
未測定 = null / not_measured
測定した結果ゼロ = 0
取得失敗 = unavailable / failed
対象外 = not_applicable
```

この4状態を分けてください。

## 3.3 データ信頼度が常に 0

個別データには confidence がある一方、全体 confidence が 0 になっています。

必須対応:

- データソース信頼度
- 測定率
- 鮮度
- サンプル数
- 取得成功率
- 複数ソース一致度
- モデル依存度

から全体 confidence を計算してください。固定値は禁止です。

## 3.4 レポート日付の欠落

Markdown に生成日時が空欄で表示されています。

必須対応:

- DB保存は UTC
- UI / レポート表示はプロジェクト timezone
- デフォルトは `Asia/Tokyo`
- report run の開始・終了・生成日時を分ける

## 3.5 施策が UUID のまま表示

経営サマリーの「今月行うべき3施策」に action UUID が表示されています。

必須対応:

- UI / レポートでは施策タイトルを表示
- UUID はリンク・内部識別子として保持
- クリック時に根拠、対象URL、担当、期限、期待効果を表示

## 3.6 ファネル情報のレンダリング不整合

JSON に `funnel_stage` があるのに、Markdown では「未設定」と表示されます。

必須対応:

- view model を一元化
- レンダラーごとの個別再計算を禁止
- export contract の自動テストを追加

## 3.7 優先度スコアが全件 0

`priority_score` が全キーワードで 0 になっています。

必須対応:

- スコア式を versioned methodology として実装
- スコア構成要素を表示
- スコア式を UI から変更可能にしない
- 管理者だけ methodology version を切替可能

推奨初期式:

```text
priority =
  normalized_business_value
  * intent_weight
  * opportunity_weight
  * confidence
  * strategic_fit
  / max(effort, minimum_effort)
```

## 3.8 競合企業名と記事タイトルの混同

「ブランディングとは？」などの記事タイトルが企業名として扱われています。

必須対応:

- company / brand / domain / page / publication を別エンティティ化
- canonical entity resolution
- alias 管理
- 手動修正履歴
- confidence 付き自動推定
- 推定値を確定企業名として外部表示しない

## 3.9 SERP と Google 順位の混同

現行データは DuckDuckGo 等の結果を利用する可能性がありますが、Google順位として見せてはいけません。

必須対応:

- engine を明記
- provider を明記
- country / language / device / location を保存
- organic / ad / map / featured snippet 等を分離
- Google順位を示す場合は Google対応SERP APIまたはGSCを使用
- 代替エンジンの結果は proxy と表示

## 3.10 現在順位 null を未ランクと決めつける

`our_rank=null` の場合に、未ランクとして全機会を損失計上してはいけません。

必須対応:

```text
rank null + 未測定 = opportunity calculation unavailable
rank null + 測定済みtopN外 = unranked_beyond_limit
rank integer = observed rank
```

## 3.11 推定値を実績のように表示

月間 9,801 UU、売上機会、年間損失はモデル値です。

必須対応:

- observed / derived / modeled / inferred をすべての値に付与
- low / base / high を表示
- 仮定値を顧客が確認可能
- 「実損失」「実アクセス」「実売上」と表現しない
- confidence と methodology version を付与

## 3.12 根拠のない施策提案

「llms.txtを置けばAIO向上」「PR配信でAI学習に組み込まれる」など、因果関係を確認できない提案を断定してはいけません。

必須対応:

- すべての提案に evidence_ids を付与
- 推奨理由を observed evidence と hypothesis に分離
- 媒体ごとの公式仕様を source registry で管理
- 不確実な提案は `experimental` と明記
- 法務・規制業界では review_required を付与

---

# 4. 絶対原則

1. 既存コードを調査せずに全面書き換えしない。
2. 既存の技術スタック、命名、ディレクトリ構成、テスト方針を尊重する。
3. 新フレームワーク導入は、既存構成で実現不能な場合のみ行う。
4. ユーザーの未コミット変更を消さない。
5. 破壊的コマンドを使わない。
6. データを捏造しない。
7. 欠損は `null`、実測ゼロだけ `0` とする。
8. 観測値・派生値・推定値・推論値を区別する。
9. 生データは不変に保存し、集計値は再計算可能にする。
10. すべての集計値に methodology version を持たせる。
11. すべての提案に evidence を紐付ける。
12. コア指標をLLMに計算させない。
13. LLMは要約・分類・説明補助に限定し、決定論的計算を優先する。
14. 同一入力に対して同一結果を返す。
15. 取得・保存・集計・表示を分離する。
16. 外部API失敗を成功扱いしない。
17. broad catch や silent fallback を禁止する。
18. レート制限、費用上限、再試行、重複排除を必須にする。
19. マルチテナントのデータ分離を必須にする。
20. 数値の表示根拠を顧客が確認できるようにする。

---

# 5. 最初に行うリポジトリ監査

コード変更前に以下を調査し、結果を `docs/mir-v3/REPO_AUDIT.md` に保存してください。

1. 言語・フレームワーク・バージョン
2. パッケージ管理
3. フロントエンド構成
4. バックエンド構成
5. DB・ORM・マイグレーション
6. 認証・認可
7. マルチテナント方式
8. ジョブ・キュー・スケジューラ
9. 外部API連携
10. レポート生成入口
11. JSON / Markdown / PDF / CSV 出力箇所
12. 現在のデータモデル
13. テスト構成
14. CI/CD
15. Docker / 開発環境
16. 既存 AGENTS.md
17. 環境変数・Secret管理
18. 現在の未コミット変更
19. v1 / v2 の互換性リスク
20. 実装を分割すべき境界

その後、`PLANS.md` を作成してください。

`PLANS.md` には次を含めます。

- フェーズ
- 変更ファイル
- DB migration
- feature flags
- test plan
- rollback plan
- acceptance criteria
- 未確定事項
- リスク
- 実装状況チェックボックス

ブロッカーがない限り、監査後に実装へ進んでください。

---

# 6. グリーンフィールドの場合の推奨構成

既存実装が利用不能または存在しない場合のみ、以下を初期候補としてください。

```text
Frontend:
  Next.js App Router
  TypeScript
  React
  server-side data fetching
  accessible chart library

Backend:
  FastAPI
  Python 3.12+
  Pydantic
  SQLAlchemy
  Alembic

Database:
  PostgreSQL 16+
  JSONB for raw/variable provider payloads
  pgvector optional, not mandatory

Queue:
  provider-neutral job interface
  local development queue
  production adapter for Cloud Tasks / Celery / managed queue

Storage:
  S3-compatible object storage for immutable evidence
  DB stores metadata and URI

Browser evidence:
  Playwright, only where legally and contractually allowed

Infrastructure:
  Docker Compose for local
  GitHub Actions
  secret manager in production
```

既存スタックがある場合は、この構成へ無理に変更しないでください。

---

# 7. システム全体アーキテクチャ

以下の6層に分離してください。

## Layer A: Configuration

- account
- tenant
- site
- project
- tracked market
- keyword cohort
- prompt cohort
- competitor set
- business assumptions
- provider config
- budget config

## Layer B: Acquisition

- GSC connector
- GA4 connector
- CRM connector
- keyword volume connector
- SERP connector
- page crawler
- PageSpeed / CrUX connector
- AI answer connector
- backlink / mention connector
- manual CSV import
- crawler / server log connector

## Layer C: Immutable Evidence

- raw API payload
- raw HTML
- rendered screenshot
- AI answer raw text
- citations
- headers
- request parameters
- response metadata
- source hash
- content hash
- capture timestamp
- cost
- provider usage

## Layer D: Normalized Facts

- keyword
- page
- entity
- competitor
- SERP result
- AI mention
- AI citation
- page feature
- technical audit result
- daily performance
- CRM outcome
- intervention
- experiment

## Layer E: Metrics

- SEO visibility
- AI visibility
- SOV
- coverage
- opportunity
- business impact
- volatility
- momentum
- confidence
- content decay
- action priority

## Layer F: Product & Reports

- executive dashboard
- analyst dashboard
- evidence drilldown
- action backlog
- experiments
- alerts
- white-label report
- JSON / HTML / Markdown / PDF / CSV exports

---

# 8. データ取得の必須範囲

すべてを一度に有効化する必要はありません。adapter、feature flag、mock/live mode を用意してください。

## 8.1 First-party search data

### Google Search Console

取得候補:

- date
- query
- page
- country
- device
- search appearance
- clicks
- impressions
- CTR
- average position

要件:

- incremental sync
- date partition
- row limit / pagination
- data freshness
- property permission errors
- branded / non-branded classification
- canonical URL normalization

### GA4

取得候補:

- session source / medium
- landing page
- organic sessions
- engaged sessions
- conversions / key events
- revenue
- user acquisition
- device / country

要件:

- PIIを保存しない
- GSCとページ・日付で紐付け
- attribution model を明記
- unavailable 時は null

### CRM

adapter方式で以下へ対応可能な構造にする。

- HubSpot
- Salesforce
- CSV
- webhook
- generic REST

取得候補:

- lead
- MQL
- SQL
- opportunity
- won
- revenue
- gross profit
- source
- landing page
- campaign
- created_at / closed_at

## 8.2 Keyword demand

adapter を用意し、以下のいずれかを接続可能にする。

- Google Ads Keyword Planner
- DataForSEO
- Semrush
- Ahrefs
- licensed provider
- manual CSV

保存項目:

- monthly volume
- volume range
- CPC
- competition
- trend
- locale
- language
- device
- provider
- observed_at
- confidence

検索ボリュームは単一点ではなく、可能なら12か月推移と範囲を保存してください。

## 8.3 SERP

保存項目:

- engine
- provider
- query
- country
- locale
- device
- location
- result type
- rank
- URL
- domain
- title
- snippet
- rich result
- featured snippet
- people also ask
- video
- image
- local pack
- shopping
- ads
- observed_at
- raw evidence

Google順位を標榜する場合、Google対応の適法なSERPデータ取得方法を使用してください。  
検索結果スクレイピングを前提にせず、provider adapterを使用してください。

## 8.4 Site crawl / technical SEO

対象:

- robots.txt
- sitemap
- status code
- redirect chain
- canonical
- hreflang
- meta robots
- title
- meta description
- H1-H6
- internal links
- external links
- structured data
- schema validation
- FAQ
- author
- publisher
- updated date
- price
- review
- case study
- content length
- content hash
- duplicate content
- rendering status
- JS dependency
- image alt
- Core Web Vitals
- Lighthouse
- PageSpeed
- CrUX

要件:

- robots.txt遵守
- rate limiting
- canonical URL
- content diff
- page snapshot history
- site-wide crawl と sample crawl を分ける
- error budget

## 8.5 AI search / generative answer measurement

各測定に以下を必ず保存してください。

- prompt_id
- prompt text
- prompt cluster
- intent
- funnel stage
- job to be done
- engine
- provider
- model
- model version if available
- surface
- API / consumer UI / search mode
- web grounding enabled
- locale
- country
- language
- session state
- personalization state
- run index
- temperature or equivalent if available
- raw answer
- answer hash
- citations
- source URLs
- source order
- brand mentions
- competitor mentions
- recommendation state
- answer position
- sentiment
- factual claims
- accuracy review state
- observed_at
- screenshot URI where allowed
- provider request ID
- token / request cost
- latency
- error

重要:

- API回答と一般消費者向けUI回答を混同しない
- `surface` を必須にする
- 検索・groundingなしの通常LLM回答と検索回答を分離
- 回答ブレを測るため、同一promptを複数回測定可能にする
- 1回の回答だけで成果判定しない
- 利用規約に反する自動操作を実装しない
- browser automation は許可・契約・規約を確認した環境のみ

## 8.6 Off-site authority / citations

adapter で次を取り込める構造にする。

- backlinks
- referring domains
- media mentions
- review sites
- directory listings
- press releases
- social mentions
- knowledge panels
- business profile data

取得できない場合も、manual evidence として登録できるようにする。

---

# 9. Provider Adapter Contract

すべての外部データ取得は共通インターフェースで実装してください。

擬似インターフェース:

```python
class ProviderAdapter(Protocol):
    provider_name: str
    source_type: str

    def validate_config(self, config) -> ValidationResult: ...
    def estimate_cost(self, request) -> CostEstimate: ...
    def health_check(self) -> HealthResult: ...
    async def fetch(self, request) -> RawProviderResponse: ...
    def normalize(self, raw) -> list[NormalizedFact]: ...
    def rate_limit_key(self, request) -> str: ...
```

必須機能:

- mock mode
- live mode
- cost estimate
- hard project budget
- provider budget
- retry with jitter
- circuit breaker
- 429 handling
- idempotency key
- request hash
- response hash
- provider usage log
- per-provider concurrency
- partial failure
- resume

---

# 10. Evidence Envelope

すべての生証拠は以下の共通エンベロープを持たせてください。

```json
{
  "evidence_id": "uuid",
  "account_id": "uuid",
  "project_id": "uuid",
  "report_run_id": "uuid",
  "source_type": "serp_api",
  "provider": "provider_name",
  "surface": "google_web",
  "request_hash": "sha256",
  "response_hash": "sha256",
  "observed_at": "ISO-8601",
  "fetched_at": "ISO-8601",
  "status": "success",
  "measurement_type": "observed",
  "confidence": 0.92,
  "raw_object_uri": "s3://...",
  "metadata": {},
  "cost": {
    "amount": 0.01,
    "currency": "USD"
  }
}
```

要件:

- raw evidence は原則更新不可
- 同一 request + same observation window の重複保存防止
- hashで再現性確保
- retention policy
- PII分類
- 削除要求に対応
- raw dataへのアクセス権限を制限

---

# 11. 推奨DBモデル

既存DB技術を使用してください。最低限以下を用意します。

## Identity

```text
accounts
users
memberships
sites
projects
provider_configs
project_budgets
```

## Tracking configuration

```text
tracking_cohorts
keywords
keyword_classifications
keyword_cohort_members
prompt_clusters
ai_prompts
prompt_cohort_members
competitor_sets
competitor_set_members
business_assumptions
```

## Run / provenance

```text
report_runs
ingestion_jobs
raw_evidence
provider_usage_events
data_quality_events
```

## SEO / SERP

```text
keyword_volume_snapshots
serp_snapshots
serp_results
serp_features
gsc_daily_metrics
ga4_daily_metrics
```

## Entity / competitor

```text
entities
entity_aliases
domains
entity_domains
competitor_observations
entity_resolution_reviews
```

## Pages / technical

```text
pages
page_snapshots
page_content_features
technical_audit_runs
technical_audit_findings
internal_links
structured_data_items
```

## AI visibility

```text
ai_answer_runs
ai_answer_snapshots
ai_mentions
ai_recommendations
ai_citations
ai_claims
ai_accuracy_reviews
```

## Business

```text
crm_outcomes
conversion_events
revenue_events
gross_profit_events
business_scenarios
```

## Metrics

```text
metric_definitions
metric_methodologies
metric_snapshots
metric_dimensions
```

## Execution

```text
actions
action_evidence
interventions
experiments
experiment_observations
action_measurements
alerts
comments
```

## Reports

```text
report_templates
report_exports
report_sections
white_label_configs
```

必須制約:

- tenant_id / account_id を全テナントデータに保持
- RLSまたは同等のテナント分離
- immutable evidenceへのcascade delete禁止
- unique normalized keyword
- unique AI run key
- unique SERP observation key
- idempotency unique key
- canonical URL unique within site
- soft delete and audit columns
- created_by / updated_by
- schema version

---

# 12. Metrics Engine

コア指標をUIやテンプレート内で直接計算しないでください。

推奨構成:

```text
metrics/
  coverage
  seo_visibility
  seo_share_of_voice
  ai_visibility
  ai_share_of_voice
  citation
  recommendation
  competitor_exclusive
  opportunity
  business_impact
  confidence
  momentum
  volatility
  content_decay
  action_priority
```

各 metric result は以下を返します。

```json
{
  "metric_key": "ai_citation_rate",
  "value": 0.25,
  "unit": "ratio",
  "measurement_type": "derived",
  "source_type": "ai_engine",
  "confidence": 0.78,
  "methodology_version": "ai_citation_rate@1.0.0",
  "observed_at": "ISO-8601",
  "low": null,
  "high": null,
  "evidence_ids": ["..."],
  "warnings": []
}
```

---

# 13. 指標定義

## 13.1 Keyword coverage

```text
covered keywords / valid measured keywords
```

未測定キーワードを分母へ入れない。  
別途 measurement coverage を表示する。

## 13.2 SEO visibility

```text
sum(volume_weight * rank_ctr_weight) / sum(volume_weight)
```

要件:

- rank observed only
- engine/device/countryごとに分離
- CTR curve versioning
- branded / non-branded 分離
- Top3 / Top10 / Top20

## 13.3 SEO Share of Voice

```text
own weighted visibility /
sum(own + selected competitors weighted visibility)
```

競合集合と母集団を保存する。

## 13.4 AI Brand Mention Rate

```text
valid AI answer runs with brand mention /
valid AI answer runs
```

## 13.5 Recommendation Rate

ブランドが単に言及された場合と、推奨・候補・比較選択肢に入った場合を分ける。

```text
runs with recommendation /
valid runs
```

## 13.6 Domain Citation Rate

```text
runs citing own domain /
valid runs with citation-capable surface
```

## 13.7 Citation Share

```text
own domain citation count /
all tracked domain citation count
```

## 13.8 AI Share of Voice

候補:

```text
weighted brand mention points /
weighted mention points of tracked set
```

ポイント例:

- primary recommendation: 3
- comparison candidate: 2
- neutral mention: 1
- citation only: 0.5

方法論は変更可能だが versioned とする。

## 13.9 Competitor Exclusive Rate

```text
runs where tracked competitor appears and own brand does not /
valid runs
```

## 13.10 Citation Persistence

同一promptを複数回計測した際の安定性。

```text
runs with own citation / repeated runs
```

## 13.11 Cross-engine agreement

各エンジンの推薦ブランド集合の Jaccard 類似度または順位相関。  
方法論を明記する。

## 13.12 Answer Accuracy

人手またはルールで確認済みclaimのみ分母にする。

```text
verified correct claims / reviewed claims
```

未レビューを誤情報扱いしない。

## 13.13 Traffic opportunity

```text
max(
  search_volume * target_ctr
  - observed_clicks_or_estimated_current_clicks,
  0
)
```

条件:

- GSC実績を優先
- rank不明なら算出不可
- target rank scenarioを表示
- low/base/high
- seasonality
- confidence

## 13.14 Business impact

```text
click opportunity
* CVR
* close rate
* gross profit per win
```

モード:

- actual
- mixed
- modeled

売上ではなく粗利益を標準表示とし、仮定を編集可能にする。

## 13.15 Action priority

推奨式:

```text
priority =
  impact
  * confidence
  * strategic_fit
  * urgency
  / effort
```

各要素を表示する。

## 13.16 Data confidence

以下の加重平均:

- source reliability
- measurement coverage
- freshness
- sample size
- repeated-run stability
- multi-source consistency
- missingness penalty
- modeled dependency penalty

confidence が低い場合、強い断定文を生成しない。

---

# 14. 時系列と母集団管理

必須比較:

- 7日
- 28日
- 90日
- 前年同月
- 導入前 baseline
- 任意期間

各指標:

- current
- previous comparable
- absolute delta
- percentage delta
- moving average
- slope
- volatility
- anomaly
- cohort_id
- denominator change warning

禁止:

- prior=0 の場合に無限%を表示
- keyword追加後に同じ母集団として比較
- AI engine変更後に同一系列として比較

`tracking_cohort_id` と `prompt_cohort_id` を使用してください。

---

# 15. 競合エンティティ正規化

自動処理:

1. URLからdomain抽出
2. canonical URL解決
3. Organization schema抽出
4. OpenGraph site_name抽出
5. title / footer / company page抽出
6. known alias match
7. confidence付き候補生成
8. low confidenceはhuman review queue

エンティティ種別:

- company
- brand
- publication
- marketplace
- directory
- article
- product
- unknown

外部レポートには、記事タイトルを会社名として表示しない。

---

# 16. ページ・コンテンツインテリジェンス

各ページに以下を保持:

- page type
- target keyword
- target prompt cluster
- title
- H1
- description
- content hash
- word count
- update date
- author
- reviewer
- price presence
- FAQ count
- case study presence
- comparison content
- citations
- structured data
- internal links
- GSC metrics
- AI citation count
- conversions
- revenue / gross profit
- content decay
- cannibalization
- technical findings

検出:

- content decay
- cannibalization
- orphan page
- outdated price
- missing FAQ
- missing case study
- weak comparison
- missing author evidence
- inconsistent brand facts
- schema mismatch
- AI misinformation risk

---

# 17. Citation Graph

広告代理店が簡単に模倣できない差別化機能として、引用ネットワークを実装してください。

ノード:

- prompt cluster
- AI engine
- answer
- cited page
- cited domain
- brand
- competitor
- topic

エッジ:

- answer cites page
- page belongs to domain
- prompt produces answer
- brand mentioned in answer
- competitor mentioned in answer
- page supports topic

可視化:

- citation hubs
- source concentration
- source diversity
- own-domain citation paths
- competitor source dominance
- newly emerging sources
- lost sources

---

# 18. Recommendation / Action Engine

推奨は文字列ではなく構造化データです。

```json
{
  "action_id": "uuid",
  "title": "料金比較ページを新設",
  "action_type": "content_create",
  "status": "proposed",
  "target_urls": [],
  "target_keywords": [],
  "target_prompt_clusters": [],
  "problem_statement": "",
  "recommendation": "",
  "expected_effect": {
    "metrics": ["ai_recommendation_rate", "organic_clicks"],
    "low": null,
    "base": null,
    "high": null
  },
  "impact": 0.8,
  "confidence": 0.65,
  "effort": 0.4,
  "strategic_fit": 0.9,
  "priority_score": 1.17,
  "evidence_ids": [],
  "hypothesis_ids": [],
  "owner_user_id": null,
  "due_at": null,
  "implemented_at": null,
  "measurement_plan": {
    "baseline_window_days": 28,
    "evaluation_window_days": 28,
    "control_group": null
  }
}
```

必須:

- 根拠
- 仮説
- 期待指標
- 担当
- 期限
- 工数
- 実施状態
- 効果測定
- before/after
- control where possible

---

# 19. 施策・実験の効果測定

因果を断定しないでください。

実装候補:

- intervention annotation
- pre/post comparison
- matched keyword control
- matched page control
- interrupted time series
- difference-in-differences where data permits
- seasonality warning
- concurrent change warning

出力文例:

```text
施策後28日でAI引用率が8pt上昇した。
同期間の対照prompt群は1pt上昇した。
本施策との関連が示唆されるが、因果関係は確定していない。
```

---

# 20. 経営レポート構成

最低限、以下の章を生成してください。

1. 表紙
2. 経営サマリー
3. データ品質と測定範囲
4. 7/28/90日時系列
5. 需要・顧客意図
6. キーワードポートフォリオ
7. SERP・検索競合
8. AI検索可視性
9. 引用ネットワーク
10. 競合インテリジェンス
11. ページ・コンテンツ診断
12. 技術SEO
13. ブランド誤情報・リスク
14. 売上・粗利益インパクト
15. 今月の優先施策
16. 実施済み施策と効果
17. アラート
18. 方法論・前提・制約
19. 証拠一覧
20. Appendix

経営サマリーは次を表示:

- SEO visibility
- AI visibility
- own citation rate
- recommendation rate
- competitive gap
- estimated opportunity low/base/high
- actual traffic / CV / gross profit where connected
- biggest risk
- top 3 actions as titles
- data confidence
- material warnings

---

# 21. UI要件

## Executive

- KPI cards
- 28日トレンド
- biggest risk
- top actions
- data quality badge
- actual vs modeled badge

## Analyst

- keyword filters
- engine filters
- funnel filters
- competitor filters
- time range
- evidence drilldown
- raw answer / SERP view
- screenshot
- formula breakdown

## Competitor

- SEO SOV
- AI SOV
- citation share
- winning topics
- new/lost keywords
- page changes
- pricing / FAQ / case studies

## Actions

- kanban
- owner
- due date
- impact
- confidence
- effort
- evidence
- measurement results

## Agency white-label

- client workspaces
- role-based access
- logo / color / footer
- report templates
- client-safe notes
- internal-only notes
- export permissions

---

# 22. Export要件

出力:

- JSON canonical
- HTML interactive
- Markdown
- PDF
- CSV
- evidence bundle ZIP

ルール:

- 全形式で値一致
- rendererが再計算しない
- currency / number locale
- PDF page breaks
- long URL handling
- chart alt text
- accessibility
- proprietary / confidential footer option
- white-label option
- export hash
- generated timestamp
- methodology version

---

# 23. Canonical JSON Contract

新規正式スキーマは `3.0.0` としてください。

最上位:

```json
{
  "schema_version": "3.0.0",
  "report_run": {},
  "site": {},
  "measurement_scope": {},
  "data_quality": {},
  "executive_summary": {},
  "time_series": [],
  "demand_intelligence": {},
  "keyword_portfolio": [],
  "serp_intelligence": {},
  "competitors": [],
  "ai_visibility": {},
  "citation_graph": {},
  "pages": [],
  "technical_seo": {},
  "brand_risk": {},
  "business_impact": {},
  "actions": [],
  "experiments": [],
  "alerts": [],
  "methodology": {},
  "evidence_index": []
}
```

次を作成:

```text
docs/mir-v3/marketing_report_v3.schema.json
docs/mir-v3/data_dictionary.md
docs/mir-v3/metric_catalog.md
docs/mir-v3/provider_adapter_spec.md
docs/mir-v3/methodology.md
```

---

# 24. v1 / v2 インポート

CLI または既存プロジェクト方式に合わせたコマンドを作成してください。

例:

```bash
mir import-v1 path/to/seo_report.json
mir import-v2 path/to/latest_mir_v2.json
mir run --project <id> --mode mock
mir export --run <id> --format json,html,md,pdf,csv
```

v1 import:

- original payloadをraw evidence保存
- site作成
- keywords import
- volume as modeled
- competitors normalize
- recommendations to draft actions
- traffic_loss to modeled metric
- original hashes
- idempotent

v2 import:

- report_run
- keyword_portfolio
- actions
- business scenarios
- known limitations
- missing AI data as null
- zero confidence bugを引き継がない
- action UUID表示問題を修正
- legacy payload preserved

同じファイルを2回入れても重複しないこと。

---

# 25. セキュリティ

必須:

- tenant isolation
- RLS or equivalent
- least privilege
- secret manager
- no API key in logs
- no API key in exports
- audit logs
- signed export URLs
- encryption at rest/in transit
- rate limiting
- webhook signatures
- CSRF/XSS/SQLi protection
- dependency scanning
- backup and restore
- data retention
- deletion workflow
- role-based access
- admin impersonation audit
- report access expiry

権限:

- platform_admin
- agency_admin
- client_admin
- analyst
- viewer

---

# 26. コスト・レート制御

テーブルまたは同等機能:

```text
provider_usage_events
project_budgets
engine_circuit_breakers
job_attempts
```

実行前:

1. estimate cost
2. project budget check
3. provider budget check
4. concurrency check
5. quota check
6. approval requirement

実行後:

- actual cost
- token / request usage
- cost variance
- error
- retry
- billing period

Google Cloud等の予算アラートだけをハードキャップとして扱わず、アプリ側でenqueue前に止める。

---

# 27. Observability

必須:

- structured logs
- correlation ID
- report_run_id
- ingestion_job_id
- provider request ID
- metrics
- traces
- error dashboard
- provider health
- queue lag
- cost dashboard
- data freshness
- failed evidence
- partial report status

レポートは `complete / partial / failed` を持つ。

partial reportでは欠損章と理由を表示する。

---

# 28. AIによる文章生成のガードレール

LLM使用は任意ですが、使用する場合は以下を守る。

- metricsはコード計算
- evidence retrievalを先に行う
- structured inputのみ
- structured output
- prompt version
- model version
- cost log
- no unsupported claims
- no invented competitor facts
- no causal claims without experiment
- all recommendations cite evidence
- human review option
- regulated industry review flag

narrativeは構造化値を参照し、数字を自由生成しない。

---

# 29. 実装フェーズ

## Phase 0: 基盤監査と既知不具合修正

- repo audit
- PLANS.md
- current report tests
- v2 bugs
- renderer consistency
- null vs zero
- action title resolution
- generated date
- funnel rendering
- priority score
- confidence
- competitor entity separation

## Phase 1: Provenance / raw evidence

- raw evidence
- run model
- source registry
- provider usage
- hashes
- importers
- JSON schema v3

## Phase 2: Metrics / time series

- metric catalog
- 7/28/90
- cohorts
- volatility
- momentum
- confidence
- business scenarios

## Phase 3: SEO connectors

- GSC
- keyword volume adapter
- SERP adapter
- page crawl
- technical audit

## Phase 4: AI visibility

- provider adapters
- prompt cohorts
- repeated measurements
- citations
- recommendations
- accuracy
- cross-engine

## Phase 5: Product / reports

- executive UI
- analyst UI
- evidence
- action backlog
- HTML / MD / PDF / CSV
- white label

## Phase 6: Business / experiments

- GA4
- CRM
- gross profit
- interventions
- experiments
- attribution-safe narrative

各Phaseをfeature flagで分離し、未完成機能が本番に露出しないようにする。

---

# 30. 必須テスト

## Unit

- null vs zero
- rank unavailable
- rank beyond topN
- volume missing
- duplicate URLs
- canonicalization
- entity resolution
- CTR curves
- low <= base <= high
- negative opportunity clamp
- no division by zero
- confidence
- priority
- cohort changes
- time deltas
- currency formatting
- action title resolution

## Integration

- provider mock
- 429
- timeout
- partial failure
- resume
- idempotency
- budget block
- tenant isolation
- import v1
- import v2
- export all formats

## E2E

- create account/project
- register site
- add keywords/prompts/competitors
- run mock measurement
- inspect evidence
- generate report
- approve action
- export
- access as client
- deny cross-tenant access

## Contract

- JSON schema
- API schemas
- adapter contracts
- export value consistency

## Golden fixtures

今回の参考レポートをfixture化する。

期待:

- keyword count = 42
- total monthly volume = 34,390
- modeled reachable opportunity = 9,801
- annual modeled value = 117,612
- これらをactualとして表示しない
- AI visibility = null until measured
- generated date exists
- top actions are titles
- funnel stage appears
- currency is `¥131,000` 等
- competitor article title is not company name
- all priority scores are not accidentally zero
- data confidence explains its value

---

# 31. 非機能要件

初期目標:

- 100 accounts
- 500 projects
- 500 tracked keywords/project
- 200 prompts/project
- 5 AI engines
- report history 24 months

性能:

- precomputed dashboard p95 < 2 sec
- report export after metrics ready < 60 sec
- ingestion async
- large exports streamed
- pagination
- indexes documented

可用性:

- retries
- resume
- partial report
- backup
- migration rollback
- health endpoint

---

# 32. 完了成果物

必ず納品:

1. 実装コード
2. DB migrations
3. v1 importer
4. v2 importer
5. v3 schema
6. data dictionary
7. metric catalog
8. methodology
9. provider adapter spec
10. threat model
11. architecture diagram
12. sequence diagrams
13. runbook
14. `.env.example`
15. mock fixtures
16. test suite
17. CI
18. sample report JSON
19. sample HTML
20. sample Markdown
21. sample PDF
22. sample CSV
23. evidence bundle
24. migration guide
25. rollback guide
26. README

---

# 33. 検収条件

以下をすべて満たすまで完了としない。

- v1を取り込める
- v2を取り込める
- 重複取込しない
- v3 JSONがschema validationに合格
- JSON/HTML/MD/PDF/CSVの値一致
- 未測定を0表示しない
- 実測と推定を区別
- 全推奨にevidence
- competitor identity修正
- 7/28/90比較
- cohort変更警告
- budget block
- mock mode no external call
- live mode explicit approval
- tenant isolation test
- API keys not exposed
- sample E2E success
- READMEで第三者が再現
- current known bugs resolved
- report includes methodology and limitations
- CI green

---

# 34. Codexの作業ルール

1. まず調査する。
2. `AGENTS.md` がなければ、短く実用的なものを作る。
3. `AGENTS.md` には、実行コマンド、テスト、アーキテクチャ境界、禁止事項を記載する。
4. `PLANS.md` を更新しながら作業する。
5. 既存コード規約へ従う。
6. 大きな変更は小さく分割する。
7. 生成コードを放置せず、テストする。
8. 失敗を隠さない。
9. 外部APIをテストで呼ばない。
10. destructive operationをしない。
11. 無関係な変更を戻さない。
12. 不明点が実装を止めるほど重大な場合だけ質問する。
13. 軽微な曖昧さは安全側の仮定を文書化して進める。
14. 最後に変更ファイル、テスト結果、未完了、リスクを報告する。

---

# 35. 最終報告フォーマット

実装完了時に次を報告してください。

```markdown
# 実装結果

## 完了したフェーズ

## 主要変更

## DB migration

## 新規API

## 新規画面

## 修正した既知不具合

## テスト
- command
- result

## サンプルレポート
- JSON
- HTML
- Markdown
- PDF
- CSV

## データ品質

## セキュリティ確認

## コスト確認

## 未完了

## 既知リスク

## 次の推奨作業
```

---

# 36. 今すぐ開始する作業

次を順番に実行してください。

1. リポジトリを監査する。
2. 参考レポートと既存schemaを読む。
3. `docs/mir-v3/REPO_AUDIT.md` を作成する。
4. `PLANS.md` を作成する。
5. 既知不具合を再現するテストを先に書く。
6. Phase 0を実装する。
7. テストを実行する。
8. Phase 1へ進む。
9. 各Phase終了時に `PLANS.md` を更新する。
10. ブロッカーがない限り、途中で止まらず進める。

最優先は、機能数ではなく、正確性・証拠性・再現性・時系列比較・説明可能性です。
