# Marketing Intelligence Report v2 — Data Dictionary / Implementation Specification

## 1. Product objective

Convert the current one-shot SEO competitor report into a decision-intelligence system that is difficult to imitate quickly because it combines:

1. immutable raw observations,
2. explainable derived metrics,
3. comparable time series,
4. SEO + AI visibility + conversion economics,
5. evidence-linked recommendations,
6. experiment and execution tracking,
7. data quality and confidence controls.

The system must never present modeled data as observed fact.

## 2. Current v1 mapping

| Current field | v2 destination | Notes |
|---|---|---|
| `generated_at` | `report_runs.started_at/completed_at` | Preserve timezone and source file hash. |
| `site_url` | `sites.canonical_url` | Normalize scheme, host, trailing slash. |
| `traffic_loss.*` | `metric_snapshots` | Store methodology version and low/base/high scenario. |
| `top_opportunity_keywords[]` | `keyword_opportunities` | Do not duplicate separately from gap table; use a ranked view. |
| `discovered_competitors[]` | `competitor_entities` + `competitor_observations` | Separate domain/entity/page title. |
| `competitor_comparisons[]` | `page_snapshots` + `competitor_page_metrics` | Store raw evidence for each score. |
| `keyword_gaps_top20[]` | `keyword_observations` + `keyword_opportunities` | Retain all tracked keywords, not only top 20. |
| `recommendations[]` | `actions` | Replace strings with structured, evidence-linked actions. |

## 3. Required source classification

Every metric and fact must contain:

- `source_type`: `serp_api`, `search_console`, `ga4`, `crm`, `page_crawl`, `ai_engine`, `crawler_log`, `manual`, `modeled`.
- `measurement_type`: `observed`, `derived`, `modeled`, `inferred`.
- `confidence`: 0.00–1.00.
- `methodology_version`.
- `observed_at`.
- `evidence_ids`.

If the source is unavailable, write `null`; do not write zero.

## 4. Recommended relational model

### 4.1 Identity and configuration

#### `accounts`
- `id uuid pk`
- `name text`
- `timezone text default 'Asia/Tokyo'`
- `created_at timestamptz`

#### `sites`
- `id uuid pk`
- `account_id uuid fk`
- `canonical_url text`
- `domain text`
- `brand_name text`
- `industry text null`
- `country_code char(2)`
- `language_code text`
- `currency_code char(3)`
- `created_at timestamptz`

#### `projects`
- `id uuid pk`
- `site_id uuid fk`
- `name text`
- `status text`
- `default_competitor_set_id uuid null`
- `created_at timestamptz`

#### `tracking_cohorts`
Used to make historical comparisons fair even when keywords are added or removed.
- `id uuid pk`
- `project_id uuid fk`
- `name text`
- `frozen_at timestamptz`
- `keyword_count int`
- `definition jsonb`

### 4.2 Run and provenance

#### `report_runs`
- `id uuid pk`
- `project_id uuid fk`
- `schema_version text`
- `run_type text` (`full`, `incremental`, `backfill`, `recompute`)
- `status text`
- `started_at timestamptz`
- `completed_at timestamptz null`
- `source_file_hash text null`
- `code_version text`
- `methodology_version text`
- `config_snapshot jsonb`
- `error_summary jsonb null`

#### `data_sources`
- `id uuid pk`
- `source_type text`
- `provider text`
- `account_ref text null`
- `freshness_sla_hours int null`
- `enabled boolean`

#### `raw_evidence`
Immutable evidence store.
- `id uuid pk`
- `report_run_id uuid fk`
- `source_id uuid fk`
- `entity_type text`
- `entity_id uuid null`
- `observed_at timestamptz`
- `request_metadata jsonb`
- `response_metadata jsonb`
- `payload jsonb`
- `payload_hash text`
- `retention_class text`

### 4.3 Keyword and intent model

#### `keywords`
- `id uuid pk`
- `project_id uuid fk`
- `normalized_keyword text`
- `display_keyword text`
- `language_code text`
- `country_code char(2)`
- `device text`
- `active boolean`
- `created_at timestamptz`

#### `keyword_classifications`
- `keyword_id uuid fk`
- `category text`
- `intent_stage text` (`awareness`, `consideration`, `comparison`, `purchase`, `retention`)
- `intent_type text` (`informational`, `commercial`, `transactional`, `navigational`, `local`)
- `job_to_be_done text null`
- `priority_weight numeric`
- `classification_source text`
- `confidence numeric`

#### `keyword_volume_snapshots`
- `keyword_id uuid fk`
- `observed_month date`
- `monthly_volume int null`
- `cpc numeric null`
- `competition numeric null`
- `seasonality_index numeric null`
- `source_id uuid fk`
- `confidence numeric`

### 4.4 SERP observations

#### `serp_snapshots`
- `id uuid pk`
- `report_run_id uuid fk`
- `keyword_id uuid fk`
- `observed_at timestamptz`
- `country_code char(2)`
- `device text`
- `search_engine text`
- `result_count int null`
- `serp_features jsonb`
- `raw_evidence_id uuid fk`

#### `serp_results`
- `id uuid pk`
- `serp_snapshot_id uuid fk`
- `position int`
- `result_type text` (`organic`, `paid`, `local`, `video`, `featured_snippet`, `ai_overview`, `people_also_ask`)
- `url text`
- `canonical_url text null`
- `domain text`
- `title text`
- `snippet text null`
- `entity_id uuid null`
- `is_own_domain boolean`
- `is_competitor boolean`

### 4.5 Competitor entity model

#### `competitor_entities`
- `id uuid pk`
- `project_id uuid fk`
- `canonical_name text`
- `canonical_domain text`
- `entity_type text` (`company`, `publisher`, `marketplace`, `article`, `directory`)
- `aliases jsonb`
- `active boolean`

#### `competitor_observations`
- `competitor_id uuid fk`
- `report_run_id uuid fk`
- `appearance_count int`
- `best_position int null`
- `avg_position numeric null`
- `weighted_visibility numeric`
- `share_of_voice numeric`
- `new_keywords_won int`
- `keywords_lost int`
- `evidence_ids uuid[]`

### 4.6 Page and content intelligence

#### `pages`
- `id uuid pk`
- `site_id uuid fk`
- `canonical_url text`
- `page_type text`
- `target_cluster_id uuid null`
- `status_code int null`
- `first_seen_at timestamptz`

#### `page_snapshots`
- `id uuid pk`
- `page_id uuid fk`
- `report_run_id uuid fk`
- `observed_at timestamptz`
- `title text null`
- `meta_description text null`
- `h1 text null`
- `word_count int null`
- `content_hash text null`
- `last_modified_at timestamptz null`
- `indexability text`
- `canonical_target text null`
- `schema_types jsonb`
- `internal_inlinks int null`
- `internal_outlinks int null`
- `external_links int null`
- `faq_count int null`
- `price_disclosed boolean null`
- `author_present boolean null`
- `organization_evidence boolean null`
- `technical_score numeric null`
- `content_score numeric null`
- `aio_readiness_score numeric null`
- `score_components jsonb`
- `raw_evidence_id uuid fk`

### 4.7 AI search / answer observations

#### `ai_prompts`
- `id uuid pk`
- `project_id uuid fk`
- `prompt_text text`
- `prompt_cluster text`
- `intent_stage text`
- `language_code text`
- `country_code char(2)`
- `active boolean`

#### `ai_answer_snapshots`
- `id uuid pk`
- `report_run_id uuid fk`
- `prompt_id uuid fk`
- `engine text`
- `model text null`
- `surface text` (`api`, `web_search`, `app`, `ai_overview`)
- `observed_at timestamptz`
- `answer_text text null`
- `answer_hash text`
- `response_latency_ms int null`
- `raw_evidence_id uuid fk`

#### `ai_brand_mentions`
- `answer_snapshot_id uuid fk`
- `entity_id uuid null`
- `brand_name text`
- `mention_type text` (`mentioned`, `recommended`, `compared`, `criticized`, `excluded`)
- `position_in_answer int null`
- `sentiment numeric null`
- `confidence numeric`
- `evidence_excerpt text null`

#### `ai_citations`
- `answer_snapshot_id uuid fk`
- `citation_index int`
- `url text`
- `domain text`
- `canonical_url text null`
- `is_own_domain boolean`
- `is_competitor boolean`
- `source_type text null`
- `freshness_days int null`

### 4.8 First-party performance and business outcomes

#### `gsc_daily_metrics`
- `site_id uuid fk`
- `metric_date date`
- `query text null`
- `page text null`
- `country text null`
- `device text null`
- `clicks numeric`
- `impressions numeric`
- `ctr numeric`
- `position numeric`

#### `ga4_daily_metrics`
- `site_id uuid fk`
- `metric_date date`
- `landing_page text null`
- `source_medium text null`
- `sessions numeric`
- `engaged_sessions numeric`
- `conversions numeric`
- `revenue numeric null`

#### `crm_outcomes`
- `site_id uuid fk`
- `occurred_at timestamptz`
- `lead_id text`
- `source text null`
- `landing_page text null`
- `keyword_cluster text null`
- `stage text`
- `deal_value numeric null`
- `gross_profit numeric null`

### 4.9 Metric snapshots and time series

#### `metric_definitions`
- `metric_key text pk`
- `display_name text`
- `description text`
- `formula text`
- `unit text`
- `measurement_type text`
- `methodology_version text`
- `higher_is_better boolean`

#### `metric_snapshots`
- `id uuid pk`
- `report_run_id uuid fk`
- `entity_type text`
- `entity_id uuid null`
- `metric_key text fk`
- `value numeric null`
- `value_low numeric null`
- `value_high numeric null`
- `confidence numeric`
- `source_type text`
- `observed_at timestamptz`
- `comparison_period text null`
- `delta_absolute numeric null`
- `delta_percent numeric null`
- `evidence_ids uuid[]`

### 4.10 Recommendations, actions, and experiments

#### `actions`
- `id uuid pk`
- `project_id uuid fk`
- `created_from_run_id uuid fk`
- `action_type text`
- `title text`
- `description text`
- `target_url text null`
- `target_keyword_ids uuid[]`
- `target_metric_keys text[]`
- `priority_score numeric`
- `impact_score numeric`
- `confidence_score numeric`
- `effort_score numeric`
- `expected_impact jsonb`
- `owner text null`
- `status text` (`proposed`, `approved`, `in_progress`, `blocked`, `done`, `rejected`)
- `due_at timestamptz null`
- `evidence_ids uuid[]`
- `created_at timestamptz`

#### `interventions`
Used to connect changes to later performance.
- `id uuid pk`
- `project_id uuid fk`
- `action_id uuid null`
- `intervention_type text`
- `occurred_at timestamptz`
- `target_url text null`
- `description text`
- `deployment_ref text null`
- `annotation jsonb`

#### `action_measurements`
- `action_id uuid fk`
- `measurement_date date`
- `baseline_value numeric null`
- `current_value numeric null`
- `target_value numeric null`
- `status text`
- `confidence numeric`

### 4.11 Alerts

#### `alerts`
- `id uuid pk`
- `project_id uuid fk`
- `report_run_id uuid fk`
- `severity text`
- `alert_type text`
- `title text`
- `description text`
- `entity_type text null`
- `entity_id uuid null`
- `detected_at timestamptz`
- `resolved_at timestamptz null`
- `evidence_ids uuid[]`

## 5. Metric definitions and formulas

### 5.1 Observed metrics

- `keyword_coverage_rate = covered_keywords / tracked_keywords`
- `top3_keyword_rate = keywords_with_best_position_1_to_3 / tracked_keywords`
- `top10_keyword_rate = keywords_with_best_position_1_to_10 / tracked_keywords`
- `domain_citation_rate = prompts_with_own_domain_citation / measured_prompts`
- `brand_mention_rate = prompts_with_brand_mention / measured_prompts`
- `recommendation_rate = prompts_where_brand_is_recommended / measured_prompts`
- `ai_source_share = own_domain_citations / all_citations_in_prompt_set`
- `competitor_exclusive_rate = prompts_or_keywords_with_competitor_but_not_own / measured_set`
- `answer_accuracy_rate = verified_correct_brand_facts / checked_brand_facts`

### 5.2 Weighted visibility

Use a versioned CTR/visibility curve rather than a hidden multiplier.

```text
weighted_visibility = sum(monthly_volume * rank_weight(position) * serp_feature_modifier)
```

Store the exact curve in configuration and report it in methodology.

### 5.3 Traffic opportunity

```text
current_clicks_model = sum(volume * current_rank_ctr * seasonality * serp_modifier)
target_clicks_model  = sum(volume * target_rank_ctr  * seasonality * serp_modifier)
traffic_opportunity  = max(0, target_clicks_model - current_clicks_model)
```

Output low/base/high scenarios. Do not label it actual traffic unless GSC confirms it.

### 5.4 Revenue opportunity

```text
revenue_opportunity = traffic_opportunity * expected_conversion_rate * expected_revenue_per_conversion
gross_profit_opportunity = traffic_opportunity * expected_conversion_rate * gross_profit_per_conversion
```

If first-party CVR is unavailable, use an explicitly user-entered assumption and lower confidence.

### 5.5 Share of voice

```text
sov(entity) = entity_weighted_visibility / sum(weighted_visibility_of_all_tracked_entities)
```

Keep SEO SOV and AI-answer SOV separate.

### 5.6 Momentum

For 7d, 28d, and 90d windows:

- absolute delta,
- percentage delta,
- moving average,
- slope,
- volatility,
- newly won,
- newly lost.

Use the same tracking cohort for historical comparisons.

### 5.7 Recommendation priority

```text
priority_score = (business_impact * confidence * urgency) / max(effort, 1)
```

Each factor is 1–5 and must be exposed in the UI.

## 6. Required report modules

1. Executive business summary.
2. Data quality and confidence banner.
3. KPI scorecards with 7d/28d/90d changes.
4. Demand and funnel map by category, intent, and job-to-be-done.
5. Keyword portfolio matrix: volume × business value × difficulty × gap.
6. SERP share-of-voice and competitor movement.
7. AI visibility: mentions, recommendations, citations, source share, model disagreement.
8. Page-level performance and content decay.
9. Conversion and revenue scenario model.
10. Structured action backlog with owner, effort, expected impact, status.
11. Experiment/intervention timeline.
12. Alerts and anomalies.
13. Methodology and evidence appendix.

## 7. Time-series requirements

- Immutable raw snapshot per run.
- Daily: GSC/GA4 and critical alerts.
- Weekly: SERP, competitor pages, technical crawl.
- Weekly or biweekly: AI prompts, depending on API cost.
- Monthly: search volume, revenue assumptions, executive report.
- Comparison windows: 7d, 28d, 90d, year-over-year when available.
- Minimum historical retention: 24 months for aggregated metrics, 13 months for raw answer text unless a stricter policy applies.
- Every intervention must appear as an annotation on charts.
- Never compare two periods with different keyword cohorts without explicitly marking the denominator change.

## 8. Data-quality rules

1. `0` means measured zero; `null` means unavailable.
2. A modeled number must include low/base/high and methodology version.
3. A recommendation must have at least one evidence ID.
4. A score must expose components; no black-box 0/70/100 values.
5. Entity names must be canonicalized; page titles are not company names.
6. Duplicate URLs must be canonicalized before aggregation.
7. The report run must be idempotent.
8. Raw evidence is immutable; derived metrics are recomputable.
9. API errors must be stored as observations, not silently dropped.
10. Every chart must include source, observed_at, and confidence/methodology tooltip.

## 9. Acceptance criteria

- Existing v1 JSON imports successfully.
- Re-running the same import does not duplicate facts.
- Two historical snapshots produce correct deltas.
- A changed keyword cohort is detected and flagged.
- Every recommendation links to evidence.
- Every modeled metric is distinguishable from observed metrics.
- Entity normalization prevents article titles from being treated as company names.
- PDF/HTML/JSON/CSV exports contain the same KPI values.
- Unit tests cover formulas and edge cases.
- Integration tests cover one complete report run.
