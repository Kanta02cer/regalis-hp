# Release notes - authority refactor draft

Date: 2026-09-05
Branch: `feature/authority-refactor-20260905`

## Included

- approved public-fact source and publication guardrails;
- Codex repository instructions, project config, reusable skills, MCP/runbook documentation and prompt pack;
- removal of public internal development, browser-log and data-room artifacts in an earlier commit on this branch;
- safer global metadata and entity schema;
- rewritten home, company, HackⅡ and Adctor pages;
- new reviewed Insights hub and three source-backed pillar articles;
- canonical robots, knowledge, site-structure and llms files;
- old automated llms generator/workflow removed because it reintroduced prices, unsupported scores and unapproved claims.

## Deliberately not included

- public pricing;
- customer, investor, partner, financing, patent or unpublished media disclosures;
- a redesign of every legacy page;
- automatic publishing;
- a history rewrite to purge previously committed sensitive files;
- production form or analytics destination changes.

## Required before merge

1. Jekyll build and GitHub Pages preview.
2. Desktop/mobile screenshots for home, HackⅡ, Adctor, company, Insights and each new article.
3. Link, console, accessibility and structured-data checks.
4. Legal/management confirmation of public company facts and product-stage wording.
5. Review of the large deletion set in the branch's earlier cleanup commit.

## Rollback

Revert the commits from this branch in reverse order. The refactor preserves existing canonical routes for HackⅡ and Pay per Crawl/Adctor, so rollback does not require DNS changes.
