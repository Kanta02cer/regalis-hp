# Release notes - authority and publication-safety refactor

Branch: `feature/authority-refactor-20260905`

## Scope

This branch creates a safer public-information foundation and rebuilds the site's core narrative around the current stage of HackⅡ and Adctor.

## Main changes

- Added repository-wide public-fact and publication policies.
- Added reusable Codex skills for public-fact review, Jekyll refactoring, AI-search content, visual regression and release checks.
- Added project-scoped Codex/MCP guidance and phased prompt pack.
- Removed internal source packages, local browser traces, agent scratch files and other non-public artifacts from the current public tree.
- Rebuilt the home, company, HackⅡ, Adctor, media and insights experiences around current, stage-accurate language.
- Centralized Organization/Person/WebSite entity data.
- Replaced machine-readable files with public-safe company and product definitions.
- Replaced the previous llms generator so that it uses approved public facts and published articles rather than prices, investor information or internal claims.
- Added an editorial/corrections policy and article authorship, review date, sources, limitations and CTA structure.
- Added two source-backed pillar articles covering terminology and AI-search measurement.
- Updated the HackⅡ announcement to state limited validation rather than completed production release.
- Added a changed-file content-governance workflow and an optional manual full scan.

## Deliberately not included

- No public prices.
- No named customer or measurement result without approval.
- No investor, valuation, cap-table, cash, runway or financing target.
- No unpublished patent claim, technical novelty argument or internal architecture detail.
- No private partner discussion or unannounced collaboration.
- No claim of guaranteed AI inclusion, ranking, citation, traffic, leads or revenue.
- No automatic merge or production form submission.

## Verification required before merge

1. Run `python scripts/content_guard.py --base-ref origin/main`.
2. Run the repository-native Jekyll build.
3. Validate `_data/public_facts.yml`, `_data/content_guardrails.yml`, `knowledge.json` and `site-structure.json`.
4. Run `python tools/generate_llms.py --dry-run` and confirm no old price, customer, investor, patent or personal data appears.
5. Inspect home, HackⅡ, Adctor, insights, media, company, contact and both new articles at desktop and mobile widths.
6. Check console and network errors, keyboard navigation, visible focus, form routes, canonical URLs, robots, sitemap and structured data.
7. Confirm the legal company name, address, founding date and representative against current approved corporate records.
8. Confirm that the four external video links on the media page remain approved public references.

## Security follow-up

Removing a file from the current branch does not erase it from Git history. If any credential, personal data or confidential document was ever committed, rotate affected credentials first, then approve a separate history-rewrite process. This branch intentionally does not rewrite history.

## Rollback

Revert the commits on this branch or restore the previous templates and content from the main branch. The source-of-truth data and machine-readable files can be reverted independently if a company fact requires correction.
