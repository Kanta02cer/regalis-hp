# Trillion Bank website repository audit

Audit date: 2026-09-05

The repository already contains a substantial Jekyll/GitHub Pages site, article collection, structured data, analytics and automation. The main risk is not lack of content; it is conflicting facts, obsolete Regalis-era language, old public prices and roadmap claims, duplicated machine-readable files, and internal artifacts in a public repository.

## Priorities

1. Use `_data/public_facts.yml` as the approved source.
2. Remove unsupported global schema and public prices.
3. Keep HackⅡ as limited commercial validation and Adctor as research/PoC.
4. Consolidate machine-readable content to canonical public files.
5. Add a reviewed Insights hub and source-backed articles.
6. Purge generated and confidential repository artifacts only through a separate security-reviewed change.
