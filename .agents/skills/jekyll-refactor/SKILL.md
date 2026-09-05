---
name: jekyll-refactor
description: Use for large Jekyll/GitHub Pages refactors in this repository: templates, includes, navigation, routes, CSS, Liquid, collections, redirects, metadata, or shared components. Requires impact analysis, phased implementation, build checks, and rollback-friendly commits.
---

# Jekyll refactor workflow

1. Map affected routes, `_config.yml`, layouts, includes, data files, assets, collections, generated files, and workflows before editing.
2. Identify duplicated metadata, inline CSS/JS, legacy routes, old prices, and unsupported product claims.
3. Preserve live URLs where possible. For route changes, update redirects, canonical URLs, navigation, sitemap, internal links, and machine-readable indexes together.
4. Move shared behavior into `_includes`, `_layouts`, `_data`, or shared assets instead of copying page-level code.
5. Keep the branch buildable after every phase and use small, reversible commits.
6. Run the content guard and Jekyll build. Treat Liquid warnings, missing includes, duplicate IDs, invalid front matter, and broken internal links as failures.
7. Inspect desktop/mobile pages and include before/after screenshots in the pull request.
