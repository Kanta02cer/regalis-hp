#!/usr/bin/env python3
"""Fail a pull request when required public release contracts are broken."""

from __future__ import annotations

import re
import sys
from pathlib import Path

SITE = Path("_site")

REQUIRED_FILES = {
    "home": SITE / "index.html",
    "company": SITE / "trillionbank/company/index.html",
    "business": SITE / "trillionbank/business/index.html",
    "hack2": SITE / "trillionbank/business/hack2/index.html",
    "adctor": SITE / "trillionbank/business/pay-per-crawl/index.html",
    "insights": SITE / "trillionbank/insights/index.html",
    "contact": SITE / "trillionbank/contact/index.html",
    "meeting": SITE / "trillionbank/meeting/index.html",
    "privacy": SITE / "trillionbank/privacy/index.html",
    "terms": SITE / "trillionbank/terms/index.html",
    "security": SITE / "trillionbank/security/index.html",
    "llms": SITE / "llms.txt",
    "knowledge": SITE / "knowledge.json",
    "site_structure": SITE / "site-structure.json",
}

LEGAL_PAGES = ("company", "contact", "privacy", "terms", "security")
PERSONAL_EMAIL_PATTERN = re.compile(
    r"[A-Z0-9._%+-]+@(gmail|yahoo|icloud|me|outlook|hotmail)\.[A-Z]{2,}",
    re.IGNORECASE,
)


def read(name: str) -> str:
    path = REQUIRED_FILES[name]
    return path.read_text(encoding="utf-8", errors="replace")


def main() -> int:
    failures: list[str] = []

    for name, path in REQUIRED_FILES.items():
        if not path.is_file() or path.stat().st_size == 0:
            failures.append(f"missing or empty required output: {name} ({path})")

    if failures:
        print("Release assertions failed:\n- " + "\n- ".join(failures))
        return 1

    for name in LEGAL_PAGES:
        html = read(name)
        if "株式会社Trillion Bank" not in html:
            failures.append(f"{name}: registered legal name is missing")
        if "株式会社トリリオンバンク" in html:
            failures.append(f"{name}: non-registered Japanese company name remains")
        if "{{" in html or "{%" in html:
            failures.append(f"{name}: unrendered Liquid remains in built output")

    contact = read("contact")
    if "form.run" not in contact and "formrun-embed" not in contact:
        failures.append("contact: Formrun endpoint or embed is missing")
    if "?cc=" in contact:
        failures.append("contact: public mailto CC parameter remains")
    if PERSONAL_EMAIL_PATTERN.search(contact):
        failures.append("contact: personal email provider address is exposed")
    if "/trillionbank/meeting/" not in contact:
        failures.append("contact: meeting CTA is missing")

    meeting = read("meeting")
    if "calendar.app.google" not in meeting:
        failures.append("meeting: public calendar destination is missing")
    if "/trillionbank/privacy/" not in meeting:
        failures.append("meeting: privacy policy agreement link is missing")

    hack2 = read("hack2")
    if "HackⅡ" not in hack2:
        failures.append("hack2: product name is missing")
    if not any(text in hack2 for text in ("保証しません", "保証されません", "保証するものではありません")):
        failures.append("hack2: explicit non-guarantee disclosure is missing")

    adctor = read("adctor")
    if "Adctor" not in adctor:
        failures.append("adctor: project name is missing")
    if not any(text in adctor for text in ("研究開発", "PoC")):
        failures.append("adctor: R&D or PoC stage disclosure is missing")
    if "完成済みの決済" in adctor and "ではありません" not in adctor:
        failures.append("adctor: commercial completion could be misrepresented")

    insight_candidates = sorted((SITE / "trillionbank/news").glob("*/index.html"))
    article_checked = False
    for article in insight_candidates:
        html = article.read_text(encoding="utf-8", errors="replace")
        if "SEO・AEO・GEO" in html or "AI検索の効果測定" in html:
            article_checked = True
            if '<meta property="og:type" content="article">' not in html:
                failures.append(f"article Open Graph type is not article: {article}")
            break
    if not article_checked:
        failures.append("representative AI-search article could not be located")

    for name in ("home", "company", "hack2", "adctor", "contact"):
        html = read(name)
        if re.search(r"<title>\s*</title>", html, re.IGNORECASE):
            failures.append(f"{name}: document title is empty")
        if "<h1" not in html.lower():
            failures.append(f"{name}: h1 is missing")

    if failures:
        print("Release assertions failed:\n- " + "\n- ".join(failures))
        return 1

    print(f"Release assertions passed: {len(REQUIRED_FILES)} required outputs checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
