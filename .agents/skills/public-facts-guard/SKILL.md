---
name: public-facts-guard
description: Use before editing or publishing Trillion Bank website copy, metadata, JSON-LD, machine-readable files, news, company facts, product status, prices, customers, partners, media, fundraising, patents, metrics, or case studies. Prevent confidential, stale, unsupported, or unapproved claims from reaching the public repository or website.
---

# Public facts guard

1. Read `_data/public_facts.yml`, `_data/content_guardrails.yml`, and `PUBLICATION_POLICY.md`.
2. Classify each proposed fact as `PUBLIC`, `PUBLIC_WITH_SOURCE`, `APPROVAL_REQUIRED`, or `CONFIDENTIAL`.
3. Remove `CONFIDENTIAL` material. Omit `APPROVAL_REQUIRED` facts unless written approval is recorded.
4. Do not infer a customer, partnership, investment close, patent status, product capability, or media right from a draft, proposal, meeting, or private note.
5. Compare visible copy, metadata, JSON-LD, `llms*.txt`, and JSON feeds. Product status and company facts must agree.
6. Keep HackⅡ and Adctor separate and state their current stages.
7. Run `python3 scripts/content_guard.py`.
8. Report every blocked claim and the approval or evidence required to publish it.
