# Codex prompt pack - Trillion Bank website

Use the prompts in order. Do not combine audit, destructive cleanup, content creation and release into one unreviewed run.

## Prompt 1 - repository and publication audit

```text
Use $public-facts-guard and $jekyll-refactor.
Read AGENTS.md, _data/public_facts.yml, _data/content_guardrails.yml and PUBLICATION_POLICY.md.
Audit routes, layouts, includes, data, assets, collections, generators, forms, analytics, robots, sitemaps, JSON-LD and llms files.
Identify old company facts, old prices, unsupported product claims, private/internal files, duplicate search intent and machine-readable drift.
Produce retain/rewrite/redirect/remove, dependency, approval-risk and phased-implementation tables.
Do not edit public pages yet. Stop for review.
```

## Prompt 2 - shared foundation

```text
Use $public-facts-guard, $jekyll-refactor and $structured-data-validator.
Work on a feature branch.
Implement the approved public-facts source, shared Organization/Person/WebSite metadata, article provenance, content guard, and generated llms files.
Remove internal source materials from the current public tree and add ignore rules. Do not rewrite Git history or rotate credentials without explicit approval.
Preserve live URLs. Run changed-file governance, YAML/JSON checks and the Jekyll build. Report the diff and stop.
```

## Prompt 3 - HackⅡ conversion page

```text
Use $public-facts-guard and $jekyll-refactor.
Rewrite the HackⅡ page without public prices.
Explain: the customer problem; measured data; Observe-Diagnose-Act-Prove; operating flow; system/human/customer roles; suitable companies; limits; and two CTAs for business companies and agencies.
Only present verified scope as current. Label analysis layers and roadmap accurately. Do not promise ranking, citation, leads or revenue.
Use semantic HTML, existing design tokens and accessible controls. Build and capture desktop/mobile screenshots. Stop for review.
```

## Prompt 4 - authority article

```text
Use $ai-search-content and $structured-data-validator.
Before creating a page, search existing titles, keywords, intent and canonical routes.
Write one answer-first article for one decision. Use current primary sources, a comparison table or procedure where useful, limitations, practical checklist, author, reviewer, dates, references and internal links.
Structured data must describe visible content. Do not publish thin variants or keyword-stuffed FAQs.
Run governance and build checks and report the source matrix.
```

## Prompt 5 - visual and release QA

```text
Use $visual-regression and $release-check.
Build and serve the site. Test home, HackⅡ, Adctor, media, company, contact and changed articles at four viewports.
Check keyboard focus, menus, links, CTAs, forms without production submission, console/network errors, text wrapping, overflow, images, metadata, canonical, robots, sitemap, JSON-LD and generated llms files.
Fix regressions caused by the branch. Open a pull request with screenshots, tests, approvals, rollout, rollback and unresolved items. Do not merge automatically.
```

## Prompt 6 - monthly authority maintenance

```text
Use $public-facts-guard and $ai-search-content.
Review Search Console, analytics, permitted AI-referral data and HackⅡ observations for the last complete month.
List pages to update, consolidate, redirect or leave unchanged. Prioritize factual freshness, decision usefulness and conversion quality over article volume.
Create drafts only. Require human approval before public release.
```
