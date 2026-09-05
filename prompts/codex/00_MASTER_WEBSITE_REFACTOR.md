# Master prompt for Codex: Trillion Bank website refactor

Use `$public-facts-guard`, `$jekyll-refactor`, `$ai-search-content`, `$visual-regression`, and `$release-check` where applicable.

## Objective

Refactor the Trillion Bank corporate website so that a business decision-maker can quickly understand the company and HackⅡ, while the site becomes a reliable Japanese primary source for AI-search terminology, measurement, governance, and implementation decisions.

## Non-negotiable facts and boundaries

Read `AGENTS.md`, `_data/public_facts.yml`, `_data/content_guardrails.yml`, and `PUBLICATION_POLICY.md` first.

- HackⅡ: limited commercial validation / implementation consultation.
- Adctor: research / PoC; separate from HackⅡ.
- No public pricing unless explicitly approved in the public-facts file.
- No customer, investor, fundraising, cap-table, cash, private-partner, unpublished-patent, or private-media information.
- No unsupported superlatives, ranking guarantees, sales guarantees, or claims of full automation.
- Structured data must match visible text.
- `llms.txt` is optional discovery support, never a ranking guarantee.

## Step 1 - audit only

Do not edit live pages yet.

1. Inventory routes, templates, includes, data, CSS/JS, workflows, forms, analytics, sitemaps, robots, JSON-LD, `llms*.txt`, and generated content.
2. Identify legacy Regalis/AICS content, outdated prices, unsupported capabilities, duplicated/conflicting company facts, mock tools presented as production tools, and pages competing for the same query intent.
3. Produce a route map, risk register, delete/redirect/rewrite/retain table, target information architecture, phased file-change plan, and acceptance criteria.
4. Stop for review.

## Step 2 - shared foundation

After approval, work only on `feature/website-authority-refactor` or a child feature branch.

- Implement source-of-truth data and content guardrails.
- Refactor global metadata, entity schema, header, footer, canonical, robots, sitemap, and article schema.
- Remove or noindex unsupported claims, old prices, and legacy mock-product pages.
- Keep commits small and reversible.
- Run checks after every shared-layer change.
- Stop and report the diff and checks.

## Step 3 - core pages

- Rewrite `/`, `/trillionbank/business/hack2/`, `/trillionbank/company/`, and `/trillionbank/insights/`.
- Home: one company message; HackⅡ current value; Adctor research status; proof principles; latest insights; CTA.
- HackⅡ: customer problem; what data is measured; operating process; human/system roles; suitable companies; limitations; CTA. No price.
- Add responsive, accessible components without changing legal or form destinations.
- Stop and report screenshots and tests.

## Step 4 - authority cluster

Audit existing articles before adding content. Build or improve distinct pages for:

1. AI検索 / AEO / GEO / AIO / LLMO / SEO comparison;
2. AI-search measurement: question set, conditions, answer/citation evidence, Win/Loss, missing data, and remeasurement;
3. AI-search content governance: official facts, authorship, sources, dates, structured data, and corrections;
4. in-house versus managed implementation;
5. multi-location / high-LTV use cases.

Each page needs a direct answer, definitions, method, limitations, examples, checklist, author/reviewer/date, primary sources, and internal links. Do not manufacture unique data.

## Step 5 - verification and PR

- Run content guard, Jekyll build, link checks, JSON/YAML checks, structured-data checks, and Playwright desktop/mobile checks.
- Verify forms and analytics events without submitting production data.
- Update the pull request with changed routes, source matrix, screenshots, checks, rollout, rollback, and manual approvals.
- Do not merge automatically.
