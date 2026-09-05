---
name: jekyll-refactor
description: Use for large Jekyll and GitHub Pages refactors in the Trillion Bank repository, including templates, includes, navigation, routes, Liquid, CSS, collections, redirects, metadata, structured data, robots, sitemaps, and shared components. Requires impact analysis, phased edits, build checks, responsive review, and rollback-friendly commits.
---

# Jekyll refactor workflow

1. Map affected routes, `_config.yml`, layouts, includes, data files, assets, collections, generated files, forms, analytics, and workflows before editing.
2. Identify duplicated metadata, inline CSS/JS, legacy routes, dependencies, and any generated files whose source must be changed instead.
3. Preserve live URLs where practical. For route changes, update redirects, canonical URLs, navigation, sitemap, internal links, and machine-readable indexes together.
4. Refactor shared behavior into `_includes`, `_layouts`, `_data`, or shared assets instead of copying page-level code.
5. Keep the branch buildable after each phase and avoid unrelated formatting changes.
6. Run the public content guard, Jekyll build, HTML/link checks, and browser checks.
7. Treat Liquid warnings, missing includes, duplicate IDs, invalid front matter, broken internal links, console errors, and responsive overflow as failures.
8. Record changed routes, screenshots, test results, approvals, rollout, and rollback in the pull request.
