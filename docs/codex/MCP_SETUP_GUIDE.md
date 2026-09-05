# Codex MCP setup guide for the Trillion Bank website

Last reviewed: 2026-09-05

## Principle

Keep four layers separate:

- **MCP** provides access to an external system.
- **Skills** define repeatable procedures and review rules.
- **Prompts** define the current objective and acceptance criteria.
- **CI** performs deterministic blocking checks.

Do not put credentials, public-information decisions, or release approval logic into an MCP configuration.

## Recommended integrations

| Integration | Purpose | Default permission |
|---|---|---|
| GitHub integration | read repository, create branch, commit, open PR, inspect checks | reads allowed; writes require approval |
| Playwright MCP | local/staging screenshots, responsive checks, console/network inspection | approval-gated |
| Figma MCP | read approved frames, tokens and assets | read-only unless a canvas write is requested |
| Search Console / analytics | evaluate search, landing and conversion performance | read-only |
| Error monitoring | investigate production regressions | read-only |

The checked-out Codex workspace already provides repository file access. A Filesystem MCP is not normally required. If one is used, scope it only to the repository root.

## Project configuration

The repository includes `.codex/config.toml` with:

- `approval_policy = "on-request"`;
- `sandbox_mode = "workspace-write"`;
- live web search for current primary sources;
- optional Figma and Playwright MCP definitions.

Keep OAuth and tokens outside Git. Use local environment variables or the connector's sign-in flow.

## GitHub workflow

1. Read `AGENTS.md` and invoke the relevant project skills.
2. Audit before editing.
3. Create a feature branch.
4. Implement one phase at a time.
5. Run content governance, build and browser checks.
6. Open a pull request; do not merge automatically.
7. Include changed routes, source/approval notes, screenshots, test output, rollout and rollback.

## Playwright workflow

Check at least:

- 1440 x 900;
- 1024 x 768;
- 390 x 844;
- 360 x 800.

Cover home, HackⅡ, Adctor, media/insights, company, contact and one changed article. Record console errors, failed requests, keyboard focus, overflow, layout shift and CTA behavior.

## Figma workflow

- Read only approved frames and design tokens.
- Map Figma components to existing Jekyll includes and CSS tokens before adding new styles.
- Do not download or commit font files.
- Compare implementation screenshots against the approved frame.

## Search and analytics workflow

Use data to decide what to improve, not to manufacture authority claims. Separate:

- branded versus non-branded queries;
- landing-page impressions/clicks;
- conversion events;
- permitted AI-referral indicators;
- HackⅡ remeasurement observations.

Do not infer causation from timing alone.

## Security posture

- No write access to production services by default.
- No secrets in `.codex/config.toml`, prompts, screenshots or PR descriptions.
- No production form submission during automated QA.
- Stop for human approval when changing legal pages, form destinations, analytics IDs, public prices, named customers/partners or product commitments.
