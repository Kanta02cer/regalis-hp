# Master prompt for Codex: Trillion Bank website authority refactor

Use `$public-facts-guard`, `$jekyll-refactor`, `$ai-search-content`, `$visual-regression`, and `$release-check` when applicable.

## Objective

Refactor the Trillion Bank corporate website so a business decision-maker can quickly understand the company and HackⅡ, while the site becomes a reliable Japanese primary source for AI-search terminology, measurement, governance, and implementation decisions.

## Required context

Read, in order:

1. `AGENTS.md`
2. `_data/public_facts.yml`
3. `_data/content_guardrails.yml`
4. `PUBLICATION_POLICY.md`
5. the target route, includes/layouts, related articles, generators, forms, and analytics

## Non-negotiable boundaries

- HackⅡ: limited commercial validation and implementation consultation.
- Adctor: research / PoC and separate from HackⅡ.
- No public pricing unless explicitly approved in public facts.
- No customer, investor, fundraising, cap-table, cash, private partner, unpublished patent, personal contact, or unreleased media information.
- No unsupported superlatives, ranking guarantees, sales guarantees, full-coverage claims, or full-automation claims.
- Structured data must match visible text.
- `llms.txt` is optional discovery support, never a ranking guarantee.

## Step 1 - audit only

Do not edit code yet.

1. Inventory routes, templates, includes, data, CSS/JS, workflows, forms, analytics, sitemaps, robots, JSON-LD, machine-readable files, and generated content.
2. Identify legacy Regalis/AICS content, outdated prices, unsupported capabilities, conflicting company facts, mock tools presented as products, and pages competing for the same query.
3. Produce a route map, risk register, remove/redirect/rewrite/retain table, target information architecture, phased file-change plan, and acceptance criteria.
4. Stop for review.

## Step 2 - shared foundation

After approval, work on a feature branch.

- Implement source-of-truth data and content guardrails.
- Refactor global metadata, entity schema, header, footer, canonical, robots, sitemap, and article provenance.
- Remove internal files and unsupported public claims.
- Keep commits small and reversible.
- Run checks after each shared-layer change.
- Stop and report the diff and checks.

## Step 3 - core pages

- Rewrite `/`, HackⅡ, Adctor, company, insights, and editorial policy pages.
- Home: one company message; HackⅡ current value; Adctor research status; proof principles; latest insights; CTA.
- HackⅡ: customer problem; measured data; operating process; human/system roles; suitable companies; limitations; CTA. No price.
- Adctor: high-level problem, contract-to-usage concept, evidence, PoC stage, limitations, partner CTA.
- Preserve legal and form destinations unless explicitly approved.
- Stop and report screenshots and tests.

## Step 4 - authority cluster

Audit existing articles before adding content. Improve or create distinct pages for:

1. AI検索 / AEO / GEO / AIO / LLMO / SEO comparison;
2. AI-search measurement: question set, conditions, answer/citation evidence, Win/Loss, missing data, and remeasurement;
3. AI-answer Fact Integrity and source consistency;
4. in-house versus managed implementation;
5. Pay per Crawl versus Pay per Use and RAG/MCP usage evidence.

Every page needs a direct answer, definitions, method, limitations, examples, checklist, author/reviewer/date, primary sources, internal links, and a relevant CTA. Do not manufacture proprietary data.

## Step 5 - verification and PR

- Run content guard, Jekyll build, link checks, YAML/JSON validation, structured-data review, and Playwright desktop/mobile checks.
- Verify forms and analytics without submitting production data.
- Open a pull request with changed routes, source matrix, screenshots, checks, rollout, rollback, and manual approvals.
- Do not merge automatically.
