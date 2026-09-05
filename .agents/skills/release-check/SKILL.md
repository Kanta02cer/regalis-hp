---
name: release-check
description: Use immediately before opening or merging a Trillion Bank website pull request. Verifies content governance, Jekyll build, public routes, metadata, structured data, robots, sitemap, analytics, links, and the PR evidence package.
---

# Release check

- Run `python3 scripts/content_guard.py --strict-claims`.
- Run the repository Jekyll build and validate changed JSON/YAML.
- Check canonical URLs, robots directives, sitemap inclusion, redirects, and noindex decisions.
- Confirm Organization facts match `_data/public_facts.yml`.
- Confirm HackⅡ and Adctor status labels are accurate and distinct.
- Confirm no public price, named customer, named investor, unapproved partner, cap table, cash balance, unpublished patent detail, or unsupported superlative was introduced.
- Check visible copy against JSON-LD and `llms*.txt`.
- Run browser checks and capture desktop/mobile screenshots.
- Include in the PR: scope, changed routes, source/approval notes, test output, screenshots, rollout/rollback, and remaining manual approvals.
