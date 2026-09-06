#!/usr/bin/env python3
"""Validate indexable Insights, canonical URLs, and sitemap output."""

from __future__ import annotations

from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

import yaml

SITE_ORIGIN = "https://trillion-bank.jp"
COLLECTION_PREFIX = "/trillionbank/news/"
XML_NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fail(message: str) -> None:
    raise RuntimeError(message)


def parse_front_matter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        fail(f"Front matter is missing or malformed: {path}")
    front_matter, _ = text[4:].split("\n---\n", 1)
    return yaml.safe_load(front_matter) or {}


def parse_xml(path: Path) -> ET.Element:
    if not path.is_file():
        fail(f"Generated XML file is missing: {path}")
    try:
        return ET.fromstring(path.read_text(encoding="utf-8").lstrip())
    except ET.ParseError as exc:
        fail(f"XML parse failed for {path}: {exc}")


def read_meta_content(html: str, name: str) -> str:
    match = re.search(
        rf'<meta\s+[^>]*name=["\']{re.escape(name)}["\'][^>]*content=["\']([^"\']+)',
        html,
        flags=re.IGNORECASE,
    )
    return match.group(1).strip() if match else ""


def read_canonical(html: str) -> str:
    match = re.search(
        r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)',
        html,
        flags=re.IGNORECASE,
    )
    return match.group(1).strip() if match else ""


def main() -> int:
    guardrails_path = Path("_data/content_guardrails.yml")
    guardrails = yaml.safe_load(guardrails_path.read_text(encoding="utf-8")) or {}
    approved_sources = [
        str(item).strip("/")
        for item in guardrails.get("approved_insight_files", [])
    ]
    if not approved_sources:
        fail("approved_insight_files is empty")

    actual_sources = sorted(path.as_posix() for path in Path("_tbnews").glob("*.md"))
    expected_sources = sorted(approved_sources)
    print(f"Approved sources: {expected_sources}")
    print(f"Actual sources:   {actual_sources}")
    if expected_sources != actual_sources:
        unexpected = sorted(set(actual_sources) - set(expected_sources))
        missing = sorted(set(expected_sources) - set(actual_sources))
        findings = []
        if unexpected:
            findings.append("Unapproved _tbnews sources:\n- " + "\n- ".join(unexpected))
        if missing:
            findings.append("Approved _tbnews sources missing:\n- " + "\n- ".join(missing))
        fail("\n\n".join(findings))

    expected_urls: set[str] = set()
    for source in approved_sources:
        source_path = Path(source)
        meta = parse_front_matter(source_path)
        if meta.get("insight") is not True:
            fail(f"Approved Insight must declare insight: true: {source}")

        robots_source = str(meta.get("robots", "")).lower()
        if "index" not in robots_source or "noindex" in robots_source:
            fail(f"Approved Insight source is not explicitly indexable: {source}")

        permalink = str(meta.get("permalink", "")).strip()
        if not permalink:
            permalink = f"{COLLECTION_PREFIX}{source_path.stem}/"
        if not permalink.startswith("/") or not permalink.endswith("/"):
            fail(
                "Approved Insight route must be absolute and end with a slash: "
                f"{source} -> {permalink}"
            )

        output = Path("_site") / permalink.lstrip("/") / "index.html"
        if not output.is_file():
            fail(f"Missing generated Insight page: {output}")

        html = output.read_text(encoding="utf-8")
        robots = read_meta_content(html, "robots").lower()
        if not robots:
            fail(f"Missing robots meta on {permalink}")
        if "noindex" in robots or "index" not in robots:
            fail(f"Approved Insight is not indexable: {permalink} -> {robots}")

        expected_url = f"{SITE_ORIGIN}{permalink}"
        canonical = read_canonical(html)
        if canonical != expected_url:
            fail(
                f"Canonical mismatch: {permalink} -> {canonical or 'missing'}; "
                f"expected {expected_url}"
            )

        expected_urls.add(expected_url)
        print(f"Approved Insight OK: {source} -> {expected_url}")

    sitemap_root = parse_xml(Path("_site/sitemap.xml"))
    sitemap_urls = [
        node.text.strip()
        for node in sitemap_root.findall("sm:url/sm:loc", XML_NAMESPACE)
        if node.text and node.text.strip()
    ]
    print(f"Sitemap URLs ({len(sitemap_urls)}): {sitemap_urls}")
    if len(sitemap_urls) != len(set(sitemap_urls)):
        fail("Duplicate URLs exist in sitemap.xml")

    missing_urls = sorted(expected_urls - set(sitemap_urls))
    if missing_urls:
        fail(
            "Approved Insight URLs missing from sitemap.xml:\n- "
            + "\n- ".join(missing_urls)
        )
    if any(url.startswith(f"{SITE_ORIGIN}/news/") for url in sitemap_urls):
        fail("Legacy /news/ URL found in sitemap.xml")

    sitemap_index_root = parse_xml(Path("_site/sitemap-index.xml"))
    index_urls = [
        node.text.strip()
        for node in sitemap_index_root.findall("sm:sitemap/sm:loc", XML_NAMESPACE)
        if node.text and node.text.strip()
    ]
    print(f"Sitemap index URLs: {index_urls}")
    expected_index_urls = [f"{SITE_ORIGIN}/sitemap.xml"]
    if index_urls != expected_index_urls:
        fail(f"Unexpected sitemap index entries: {index_urls}")

    if Path("_site/sitemap-news.xml").exists():
        fail("Retired sitemap-news.xml must not be generated")

    robots_path = Path("_site/robots.txt")
    if not robots_path.is_file():
        fail("Generated robots.txt is missing")
    robots_text = robots_path.read_text(encoding="utf-8")
    if "sitemap-news.xml" in robots_text:
        fail("robots.txt references retired sitemap-news.xml")

    print(
        "SEO integrity passed: "
        f"{len(expected_urls)} approved Insights pages; "
        f"{len(sitemap_urls)} sitemap URLs"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001 - CI should report the exact invariant.
        print(f"SEO integrity failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
