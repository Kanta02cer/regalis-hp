# Master prompt - Trillion Bank website authority refactor

Use `$public-facts-guard`, `$jekyll-refactor`, `$ai-search-content`, `$visual-regression` and `$release-check` when applicable.

## Objective

Refactor the Trillion Bank corporate site so that a business decision-maker quickly understands the company and HackⅡ, while the site becomes a reliable Japanese primary source for AI-search terminology, measurement, information integrity and AI-data usage governance.

## Non-negotiable boundaries

Read `AGENTS.md`, `_data/public_facts.yml`, `_data/content_guardrails.yml` and `PUBLICATION_POLICY.md` first. HackⅡ is limited commercial validation / implementation consultation. Adctor is research / PoC. Do not publish prices, customers, investors, funding terms, cap table, cash, private partner discussions, unpublished patent details, private contacts, credentials or third-party media assets without explicit approval. Do not claim full automation, complete AI coverage, perfect bot identification, rankings, traffic, leads or revenue.

## Step 1 - audit only

Inventory routes, templates, data, CSS/JS, workflows, forms, analytics, robots, sitemaps, JSON-LD, llms files and generated artifacts. Identify legacy Regalis material, old prices, unsupported capabilities, duplicated facts, confidential data and keyword cannibalization. Produce route, risk, retain/rewrite/redirect/remove and phased file-change tables. Stop for review.

## Step 2 - shared foundation

After approval, work on a feature branch. Consolidate facts, global metadata, entity schema, canonical, robots, sitemap and canonical llms generation. Remove unsupported schema claims and prevent old facts from being regenerated. Run content guard, build and route checks. Stop with a diff and test report.

## Step 3 - core pages

Rewrite home, HackⅡ, company and Insights. HackⅡ must explain the customer problem, measured data, Observe -> Diagnose -> Act -> Prove, human/system roles, suitable users, limitations and segmented CTA. Keep price off the page. Keep Adctor research separate.

## Step 4 - authority cluster

Audit existing content before writing. Build or consolidate pages for terminology comparison, measurement methodology, citation analysis, fact integrity, in-house vs managed implementation, Pay per Crawl vs Pay per Use and RAG/MCP data rights. Each page needs a direct answer, definitions, method, limitations, examples, checklist, author/reviewer/date, primary sources, internal links and CTA.

## Step 5 - verification and pull request

Run content, YAML/JSON, Jekyll, link, schema, desktop/mobile, console, accessibility, form, analytics, sitemap, robots and llms checks. Fix issues caused by the branch. Open a pull request with changed routes, source/approval matrix, screenshots, tests, rollout, rollback and unresolved approvals. Do not merge automatically.
