# Codex prompt pack

## 1. Audit prompt

Read `AGENTS.md`, `_data/public_facts.yml`, `_data/content_guardrails.yml` and `PUBLICATION_POLICY.md`. Invoke `$public-facts-guard` and `$jekyll-refactor`. Audit routes, templates, facts, structured data, machine-readable files, legacy Regalis content, old prices, unsupported product claims, confidential data, duplicate articles, forms, analytics and deployment. Produce retain/rewrite/redirect/remove, dependency, risk and phased implementation tables. Do not edit yet.

## 2. Shared-foundation prompt

Implement only the approved Phase 1 plan on a feature branch. Consolidate company and product facts, global metadata, Organization/WebSite schema, canonical, robots, sitemap and llms generation. Remove unsupported schema claims and prevent old facts from being regenerated. Run the content guard and Jekyll build. Stop with a diff and test report.

## 3. HackⅡ prompt

Rewrite the HackⅡ page using only `_data/public_facts.yml`. Explain the customer problem, measured data, Observe -> Diagnose -> Act -> Prove workflow, human/system responsibilities, suitable customers, limitations and segmented CTA. Keep price off the page. Do not claim full automation, all-AI coverage, causation, rankings, leads or revenue. Add visible FAQ and matching Service/Breadcrumb schema.

## 4. Authority-content prompt

Invoke `$ai-search-content`. Audit existing content before writing. Create or update one decision-focused article using current primary sources. Open with a direct answer, distinguish non-standard terminology, explain method and limitations, add author/reviewer/source dates and internal links, then run the publication and structured-data checks.

## 5. Release prompt

Invoke `$visual-regression` and `$release-check`. Run content, YAML/JSON, Jekyll, link, schema, desktop/mobile, console, accessibility, form, analytics, sitemap, robots and llms checks. Fix issues caused by the branch. Prepare a PR with changed routes, source/approval matrix, screenshots, tests, rollout, rollback and unresolved approvals. Do not merge automatically.
