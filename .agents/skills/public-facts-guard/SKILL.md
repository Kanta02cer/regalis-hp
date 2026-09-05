---
name: public-facts-guard
description: Use before publishing or editing Trillion Bank website copy, metadata, JSON-LD, llms files, news, case studies, company facts, product status, prices, customers, partners, media, fundraising, patents, or metrics. Prevents confidential or unsupported claims from reaching the public site.
---

# Public facts guard

1. Read `_data/public_facts.yml`, `_data/content_guardrails.yml`, and `PUBLICATION_POLICY.md`.
2. Classify each proposed fact as PUBLIC, PUBLIC_WITH_SOURCE, APPROVAL_REQUIRED, or CONFIDENTIAL.
3. Remove CONFIDENTIAL information. Replace APPROVAL_REQUIRED facts with neutral generic wording unless written approval is recorded.
4. Compare visible copy, metadata, JSON-LD, `llms*.txt`, and JSON feeds. They must state the same company facts and product status.
5. Never infer a customer, partnership, financing close, patent status, or capability from a proposal, meeting, draft, or internal plan.
6. Run `python3 scripts/content_guard.py`; use `--strict-claims` before release.
7. Report blocked claims and the approval or source needed to publish them.
