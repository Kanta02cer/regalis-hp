# Codex runbook: Trillion Bank website refactor

Last reviewed: 2026-09-05

## Separation of responsibilities

- `AGENTS.md`: permanent repository rules and public-fact boundaries.
- Skills: reusable procedures selected by task type.
- MCP: external capabilities such as browser automation or design access.
- Prompt: the current objective, scope, acceptance criteria, and stop conditions.
- CI: deterministic enforcement. Do not hide business decisions inside hooks.

## Recommended integrations

| Integration | Purpose | Permission posture |
|---|---|---|
| GitHub integration | branch, diff, PR, review, status | require approval for writes; never refactor on `main` |
| Playwright MCP | screenshots, responsive checks, console and network inspection | approval-gated browser actions |
| Figma MCP | read approved frames, tokens and assets | read by default; write only when requested |
| Search Console / analytics | evaluate discovery and conversion | read-only by default; separate from publishing |
| Error monitoring | investigate production faults | read-only by default |

Codex already has access to the checked-out workspace. A separate Filesystem MCP is unnecessary unless access must be delegated to another isolated path. Keep all tokens in OAuth or local environment variables.

## Phase 0 - inventory and safety

1. Invoke `$public-facts-guard` and `$jekyll-refactor`.
2. Map public routes, collections, layouts, includes, generators, forms, analytics, robots, sitemaps, and machine-readable files.
3. Search for old company names, old prices, unsupported capabilities, named customers/partners/investors, private contacts, mock tools presented as real, and duplicate query intent.
4. Produce a remove / redirect / rewrite / retain table. Do not edit public pages until reviewed.

## Phase 1 - source of truth and shared shell

1. Update approved public facts and guardrails.
2. Consolidate organization metadata and JSON-LD in shared includes.
3. Correct header, footer, canonical, robots, sitemap, and article provenance.
4. Remove internal files from the public repository and rotate any exposed credential.
5. Run guard, build, and route checks.

## Phase 2 - core conversion pages

1. Rewrite home around one company message and two clearly separated product stages.
2. Rewrite HackⅡ around customer decisions, measured evidence, process, limitations, target users, and CTA.
3. Present Adctor as research / PoC, not a completed settlement network.
4. Keep prices off public pages unless expressly approved.
5. Use approved product screenshots; mark demonstrations as `SAMPLE`.

## Phase 3 - authority content system

1. Maintain one terminology pillar and one measurement/governance pillar.
2. Audit existing articles before creating new pages.
3. Add answer-first pages that solve distinct decisions and cite primary sources.
4. Add author, reviewer, dates, references, correction policy, and internal links.
5. Generate `llms.txt` only from approved public content. Treat it as an experimental index, not a ranking factor.

## Phase 4 - measurement and release

Track CTA clicks, form completion, landing page, referrer/UTM, branded and non-branded search performance, and permitted AI-referral indicators. Keep content changes and HackⅡ remeasurement as separate evidence. Do not call correlation causation.

## Pull request evidence

- changed routes and redirect table;
- copy / source / approval matrix;
- content-guard output;
- Jekyll build output;
- structured-data notes;
- desktop/mobile screenshots;
- console/network results;
- analytics/form checks;
- rollout and rollback;
- unresolved third-party approvals.
