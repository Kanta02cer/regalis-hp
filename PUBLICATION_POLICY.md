# Trillion Bank public information policy

Last reviewed: 2026-09-06

## Purpose

This policy separates public corporate information from internal operating, financing, legal, technical, and partner information. It applies to pages, metadata, structured data, machine-readable files, images, downloadable files, the public GitHub repository, GitHub Pages build output, and automated article generation.

## Publication classes

| Class | Meaning | Default action |
|---|---|---|
| PUBLIC | Approved company, service, methodology, or contact information | May publish if current |
| PUBLIC_WITH_SOURCE | External or quantitative claim with an authoritative source and date | Publish with source and scope |
| APPROVAL_REQUIRED | Named customer, partner, media, case study, result, product availability, or legal claim | Do not publish until approved |
| CONFIDENTIAL | Investor, cap table, valuation, cash, contract, unpublished patent, credentials, private discussions | Never publish |

## Approved public facts

The machine-readable source is `_data/public_facts.yml`. Pages may paraphrase those facts without changing their meaning. The exact legal name for formal use is `株式会社Trillion Bank`.

## Approved machine-readable outputs

The current public machine-readable outputs are limited to:

- `llms.txt`
- `llms-full.txt`
- `knowledge.json`
- `site-structure.json`
- `feed.xml`
- `robots.txt`
- `sitemap.xml`
- `sitemap-index.xml`

Do not create model-specific or keyword-specific `llms-*.txt` files. Do not publish generated scoring, patch, customer, price, or experiment data from the public repository.

## Product-status language

Use these status labels consistently:

- HackⅡ: `限定商用検証・導入相談受付`
- Adctor: `研究開発・PoC相談`
- Roadmap capabilities: `構想` or `検討中`

Do not use `提供中`, `正式リリース`, `導入実績`, or `対応済み` unless the underlying evidence and approval are recorded.

## Claims and evidence

A public claim must answer:

1. What exactly is being claimed?
2. For which product, date, population, model, query set, or geography?
3. Is it measured, supplied by a customer, estimated, or planned?
4. Where is the primary evidence?
5. Who approved external use?

A claim that cannot answer all relevant questions is omitted or marked as a hypothesis.

## Articles and archives

Only articles listed in `_data/content_guardrails.yml` under `approved_insight_files` may exist in the current public `_tbnews` collection. Superseded drafts and previous article collections must be moved to an approved private archive rather than retained in the current public tree.

## Media and third-party rights

Text may describe a confirmed appearance conservatively. Logos, thumbnails, video clips, stills, photographs, quotations, co-star names, customer names, adviser names, and partner names require the relevant evidence, rights, and approvals. Being visible in a program or attending a meeting does not establish a public partnership.

## Automation

Automated article workflows may create drafts outside the public collection, but they may not publish directly unless:

- sources are primary and current;
- the content guard passes;
- the page has a human reviewer and review date;
- visible content and structured data match;
- no restricted term or private data is introduced;
- the article is added to the approved Insight allowlist.

## Removal and correction

When an error or rights concern is reported, pause promotion immediately. Correct the source page, metadata, structured data, machine-readable files, feeds, and sitemaps together. Add a visible correction note when the change is material.

Removing a file from the current tree does not erase Git history. Any credential, contract, personal data, or confidential material found in history requires a separate approved history-rewrite and credential-rotation process.
