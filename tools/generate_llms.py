#!/usr/bin/env python3
"""Generate public-safe llms.txt files from approved facts and published articles."""
from __future__ import annotations

import re
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "_data" / "public_facts.yml"
CONFIG = ROOT / "_config.yml"
NEWS = ROOT / "_tbnews"
OUT = ROOT / "llms.txt"
FULL_OUT = ROOT / "llms-full.txt"
JST = timezone(timedelta(hours=9))


def load_yaml(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    return yaml.safe_load(match.group(1)) or {} if match else {}


def article_date(value: object) -> str:
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return str(value or "")[:10]


def recent_articles(site_url: str, limit: int = 12) -> list[dict]:
    items: list[dict] = []
    today = datetime.now(JST).date().isoformat()
    for path in NEWS.glob("*.md"):
        fm = frontmatter(path)
        published = fm.get("published", True)
        published_date = article_date(fm.get("date"))
        if not fm.get("title") or published is False or not published_date or published_date > today:
            continue
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
        items.append({
            "date": published_date,
            "title": str(fm.get("title", "")),
            "summary": str(fm.get("ai_summary") or fm.get("tbdesc") or ""),
            "url": f"{site_url}/trillionbank/news/{slug}/",
        })
    return sorted(items, key=lambda item: item["date"], reverse=True)[:limit]


def build_index(facts: dict, site_url: str, articles: list[dict]) -> str:
    company = facts["company"]
    hack2 = facts["products"]["hack2"]
    adctor = facts["products"]["adctor"]
    article_lines = "\n".join(f"- [{item['title']}]({item['url']})" for item in articles)
    if not article_lines:
        article_lines = "- [お知らせ・インサイト]({}/trillionbank/insights/)".format(site_url)
    return f"""# {company['legal_name']}

> {facts['positioning']['short']}

- Official site: {site_url}/
- Company: {site_url}/trillionbank/company/
- HackⅡ: {site_url}/trillionbank/business/hack2/
- Adctor: {site_url}/trillionbank/business/pay-per-crawl/
- Insights: {site_url}/trillionbank/insights/
- Editorial policy: {site_url}/trillionbank/insights/editorial-policy/
- Contact: {site_url}/trillionbank/contact/

## HackⅡ - {hack2['status']}

{hack2['public_definition']}

This service does not guarantee inclusion, ranking, traffic, leads, bookings, or revenue. Coverage is determined by the verified scope at the time of engagement.

## Adctor - {adctor['status']}

{adctor['public_definition']}

Adctor is not presented as a completed autonomous-payment or settlement network.

## Recent public articles

{article_lines}

Last generated: {datetime.now(JST).strftime('%Y-%m-%d')}
"""


def build_full(facts: dict, site_url: str, articles: list[dict]) -> str:
    company = facts["company"]
    hack2 = facts["products"]["hack2"]
    adctor = facts["products"]["adctor"]
    scope = "\n".join(f"- {item}" for item in hack2["verified_scope"])
    hack_limits = "\n".join(f"- {item}" for item in hack2["limitations"])
    adctor_limits = "\n".join(f"- {item}" for item in adctor["limitations"])
    article_lines = "\n".join(
        f"- [{item['title']}]({item['url']})" + (f": {item['summary']}" if item['summary'] else "")
        for item in articles
    )
    address = company["address"]
    return f"""# {company['legal_name']} - public reference

## Company

- Legal name: {company['legal_name']}
- Display name: {company['display_name']}
- Representative: {company['representative']}
- Founded: {company['founded']}
- Address: 〒{address['postal_code']} {address['region']}{address['locality']}{address['street']}
- Website: {site_url}/
- Note: {company['bank_disclaimer']}

## Positioning

{facts['positioning']['long']}

## HackⅡ

Status: {hack2['status']}

{hack2['public_definition']}

### Verified public scope

{scope}

### Limits

{hack_limits}

### Relevant routes

- Product: {site_url}/trillionbank/business/hack2/
- Consultation: {site_url}{facts['public_cta']['primary_url']}
- AI-search terminology guide: {site_url}/trillionbank/news/seo-aeo-geo-aio-llmo-differences/
- Measurement method: {site_url}/trillionbank/news/ai-search-measurement-method/

## Adctor

Status: {adctor['status']}

{adctor['public_definition']}

### Limits

{adctor_limits}

### Relevant route

- Research / PoC: {site_url}/trillionbank/business/pay-per-crawl/

## Editorial principles

- Visible content and machine-readable data must agree.
- Non-obvious claims are linked to primary sources and dated.
- Product status, measured observations, interpretation, estimates and roadmap are separated.
- Customer, investor, confidential technical and unpublished legal information is not published without approval.
- Corrections are reflected in visible pages and machine-readable files together.

Editorial policy: {site_url}/trillionbank/insights/editorial-policy/

## Recent public articles

{article_lines or '- No public articles were found.'}

Last generated: {datetime.now(JST).strftime('%Y-%m-%d')}
"""


def validate(text: str) -> None:
    prohibited = [
        "世界初", "日本初", "業界唯一", "完全自動", "売上保証", "問い合わせ保証",
        "Regalis AIO Intelligence", "AICS™", "主要株主", "現預金", "バリュエーション",
    ]
    hits = [term for term in prohibited if term in text]
    mobile = re.search(r"0[789]0[- ]?\d{4}[- ]?\d{4}", text)
    if hits or mobile:
        raise SystemExit(f"Public llms validation failed: {hits or ['personal phone number']}")


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    facts = load_yaml(DATA)
    config = load_yaml(CONFIG)
    site_url = str(config.get("url") or "https://trillion-bank.jp").rstrip("/")
    articles = recent_articles(site_url)
    index = build_index(facts, site_url, articles).strip() + "\n"
    full = build_full(facts, site_url, articles).strip() + "\n"
    validate(index + full)
    if dry_run:
        print(index)
        print("\n--- llms-full.txt ---\n")
        print(full)
    else:
        OUT.write_text(index, encoding="utf-8")
        FULL_OUT.write_text(full, encoding="utf-8")
        print(f"Updated {OUT.name} and {FULL_OUT.name} from approved public facts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
