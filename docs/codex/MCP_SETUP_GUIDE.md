# MCP setup guide for the Trillion Bank website

## Recommended integrations

| MCP / integration | Purpose | Default permission |
|---|---|---|
| GitHub | repository search, branch, diff, PR, review and checks | read; prompt before write |
| Playwright MCP | local/staging screenshots, responsive checks, console/network inspection | prompt before browser actions |
| Figma MCP | approved frames, design tokens, assets and implementation comparison | read; prompt before canvas write |
| OpenAI Docs MCP | current Codex and OpenAI documentation | read-only |
| Optional Sentry | production error investigation | read-only |
| Optional analytics/Search Console connector | performance review | read-only and privacy reviewed |

## Configuration principles

- Project configuration lives in `.codex/config.toml`.
- Store tokens in environment variables or OAuth, never in the repository.
- Restrict Filesystem access to this repository only.
- Keep GitHub writes approval-gated and use pull requests.
- Do not give an analytics connector access to customer-submitted form values.
- MCP supplies capabilities; skills supply procedures; prompts supply the current task; CI enforces deterministic checks.

## Local checks

```bash
codex mcp list
python3 scripts/content_guard.py
bundle exec jekyll build
```

After build, serve `_site` and use Playwright for home, HackⅡ, Insights, company, contact and changed articles.
