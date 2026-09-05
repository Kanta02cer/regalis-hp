# Initial website audit

Audit date: 2026-09-05

## Executive finding

The repository has a strong amount of content and an existing Jekyll/GitHub Pages structure, but a safe authority refactor must start with governance and cleanup rather than adding more articles immediately.

## Priority 0 - repository exposure

The public repository contained files explicitly marked for confidential or contractor-only use, a private agent-memory file, and browser automation logs/snapshots. The current branch is intended to remove those working artifacts from the live tree and add ignore rules. Because Git history remains public, repository owners must separately review history-rewrite and credential/endpoint rotation needs before treating deletion as complete remediation.

## Priority 1 - conflicting public facts

- Company facts are duplicated across pages and machine-readable files.
- Legacy Regalis names/domains and old product concepts remain in the codebase.
- HackⅡ public structured data contains an outdated OfferCatalog and pricing.
- Some roadmap capabilities are presented close to current capabilities.
- HackⅡ and Adctor/PPC are not always separated clearly.

## Priority 2 - authority architecture

Adding more keyword pages without consolidation risks duplicate intent and weak authority. The target structure is:

1. Home: company definition, HackⅡ current value, Adctor research status, proof principles, insights, CTA.
2. HackⅡ: customer problem, observable data, process, human/system roles, limitations, suitable companies, CTA.
3. Insights hub: one canonical terminology pillar plus decision-oriented supporting articles.
4. Methodology: question design, measurement conditions, evidence, Win/Loss, fact gaps, and remeasurement limits.
5. Company/author pages: consistent entity facts, authorship, reviewer, sources, correction policy.

## Initial route decisions

### Retain and rewrite

- `/`
- `/trillionbank/business/hack2/`
- `/trillionbank/insights/`
- `/trillionbank/company/`
- `/trillionbank/contact/`
- `/trillionbank/meeting/`

### Audit for consolidation, redirect, or noindex

- legacy Regalis/AICS pages;
- duplicate AEO/GEO glossary pages;
- mock tools or diagnostics that can be mistaken for production functions;
- pricing pages and structured-data offers based on old plans;
- pages that mix HackⅡ with Adctor/PPC implementation claims.

## Content clusters to build after consolidation

- AI検索 / AEO / GEO / AIO / LLMO / SEO comparison;
- AI-search measurement methodology;
- citation/source analysis and fact integrity;
- in-house versus managed implementation;
- high-LTV and multi-location use cases;
- AI content access, licensing, and usage evidence as a separate Adctor research cluster.

## Release gate

Do not merge the full redesign until current legal/company facts, product status, public pricing policy, CTA destinations, and third-party media/partner approvals are confirmed.
