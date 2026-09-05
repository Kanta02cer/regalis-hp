# Codex website operating guide

## Responsibility split

- `AGENTS.md`: permanent repository rules and public-fact boundaries.
- Skills: repeatable task workflows.
- MCP: access to external systems such as GitHub, Figma, browser automation and documentation.
- Prompts: the current business objective, scope, acceptance criteria and stop conditions.
- CI: deterministic enforcement. Do not hide editorial judgement inside CI.

## Safe operating order

1. Read `AGENTS.md`, public facts, guardrails and publication policy.
2. Invoke the publication and impact-analysis skills.
3. Create a feature branch; never perform a large refactor directly on `main`.
4. Audit routes, facts, structured data, legacy artifacts, forms, analytics and deployment.
5. Implement one coherent phase at a time.
6. Run content guard, Jekyll build, link/schema/browser/accessibility checks.
7. Open a pull request with sources, approvals, screenshots, tests, rollout and rollback.
8. Merge only after human review.

## Recommended phase order

- Phase 0: public-information and confidential-data audit.
- Phase 1: source of truth, global metadata, entity schema, robots/sitemap/llms cleanup.
- Phase 2: home, HackⅡ, company, contact and Insights hub.
- Phase 3: pillar and supporting content with primary sources.
- Phase 4: analytics, conversion, visual regression and measured iteration.

Give Codex one phase, clear files, acceptance criteria, test commands and stop conditions. Do not combine a full information-architecture rewrite, dozens of articles, visual redesign, analytics migration and deployment in one unreviewed prompt.
