---
name: release-check
description: Use immediately before opening or merging a Trillion Bank website pull request. Verifies public-information governance, Jekyll build, routes, metadata, structured data, robots, sitemaps, analytics, forms, links, responsive screenshots, and the pull-request evidence package.
---

# Release check

- Run `python3 scripts/content_guard.py`.
- Run the repository's Jekyll build and any native tests.
- Validate changed YAML and JSON.
- Check canonical URLs, robots directives, sitemap inclusion, and noindex decisions.
- Confirm Organization facts match `_data/public_facts.yml`.
- Confirm HackⅡ and Adctor status labels are accurate and distinct.
- Confirm no public price, customer, investor, unapproved partner, cap table, bank balance, patent detail, personal contact, or unsupported superlative was introduced.
- Check visible copy against JSON-LD and machine-readable files.
- Run browser checks and capture desktop/mobile screenshots.
- Include scope, changed routes, sources and approvals, test output, screenshots, rollout, rollback, and unresolved approvals in the pull request.
