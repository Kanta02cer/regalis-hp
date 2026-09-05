# Codex runbook: Trillion Bank website refactor

## Responsibilities

- **AGENTS.md**: permanent repository rules and public-fact boundaries.
- **Skills**: reusable task workflows.
- **MCP**: controlled access to GitHub, Figma, browser automation, and current documentation.
- **Prompt**: the current objective, scope, acceptance criteria, and stop conditions.
- **CI / hooks**: deterministic validation. Do not hide business decisions inside hooks.

## Recommended MCP set

| Integration | Purpose | Safety rule |
|---|---|---|
| GitHub integration | branch, diff, PR, review, checks | approval-gated writes; never refactor on `main` |
| Playwright MCP | responsive screenshots, console/network inspection, interaction checks | use test/local URLs; do not submit production data |
| Figma MCP | read approved frames/tokens/assets and compare implementation | read by default; canvas writes only when requested |
| OpenAI Docs MCP | current Codex/OpenAI documentation | read-only |
| Optional Sentry | investigate production errors | read-only unless separately approved |

Use OAuth or local environment variables. Never commit access tokens.

## Phase 0 - inventory and safety

1. Invoke `$public-facts-guard` and `$jekyll-refactor`.
2. Map routes, collections, layouts, includes, generators, workflows, forms, analytics, robots, sitemaps, JSON-LD, `llms*.txt`, and JSON feeds.
3. Search for old company names, old domains, old prices, unsupported capabilities, named customers/partners/investors, private numbers, mock tools, and duplicated entity facts.
4. Remove private agent memories, browser logs, snapshots, credentials, and confidential technical documents from the public repository. If they existed in Git history, complete a separate history-rewrite and credential-rotation procedure.
5. Produce a delete / redirect / rewrite / retain table. Do not rewrite all live pages in the same commit.

## Phase 1 - shared foundation

1. Approve `_data/public_facts.yml` and content guardrails.
2. Consolidate metadata and JSON-LD in shared includes.
3. Update header, footer, company entity, canonical, robots, and sitemap behavior.
4. Put legacy or unsupported pages behind redirects or `noindex`.
5. Run content guard, build, and route checks.

## Phase 2 - core conversion pages

1. Rewrite home around one company message and two clearly separated products.
2. Rewrite HackⅡ around customer decisions, measured evidence, process, limitations, target users, and CTA.
3. Keep prices off public pages unless explicitly approved.
4. Use approved product screenshots; label demonstrations and sample data.
5. Validate mobile and desktop.

## Phase 3 - authority content system

1. Build a topic hub with a terminology pillar and a measurement/governance pillar.
2. Audit existing articles before creating new pages.
3. Add source-backed, answer-first pages that solve distinct decisions.
4. Add author, reviewer, date, source, methodology, correction, and internal-link blocks.
5. Generate `llms.txt` from approved public facts and published content only.

## Phase 4 - measurement and release

Track at minimum:

- CTA clicks and completed forms;
- landing page, referrer, UTM, and permitted AI-referral indicators;
- branded and non-branded Search Console performance;
- generative-AI Search Console visibility when available;
- content updates and HackⅡ remeasurement as separate evidence.

Do not call correlation causation. Do not promise AI inclusion.

## Pull request checklist

- changed routes and redirect table;
- copy/source/approval matrix;
- content-guard and build output;
- structured-data validation notes;
- desktop/mobile screenshots;
- console/network results;
- analytics/form checks;
- rollback instructions;
- unresolved third-party approvals.
