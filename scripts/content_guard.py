#!/usr/bin/env python3
"""Fail CI when public sources or repository paths violate publication policy."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "_data" / "content_guardrails.yml"


def load_config() -> dict:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def normalize_rule(raw: object) -> str:
    return str(raw or "").strip().strip("/")


def is_allowed(path: Path, allowed: Iterable[str]) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    for raw in allowed:
        item = normalize_rule(raw)
        if item and (rel == item or rel.startswith(item + "/")):
            return True
    return False


def check_forbidden_paths(config: dict) -> list[str]:
    findings: list[str] = []
    for raw in config.get("forbidden_paths", []):
        item = normalize_rule(raw)
        if item and (ROOT / item).exists():
            findings.append(f"{item}: forbidden repository path exists")
    for raw in config.get("forbidden_prefixes", []):
        item = normalize_rule(raw)
        if item and (ROOT / item).exists():
            findings.append(f"{item}/: forbidden repository prefix exists")
    return findings


def iter_files(config: dict, roots_key: str) -> Iterable[Path]:
    extensions = {str(ext).lower() for ext in config.get("scan_extensions", [])}
    seen: set[Path] = set()
    for root_name in config.get(roots_key, []):
        root = ROOT / str(root_name)
        if root.is_file():
            candidates = [root]
        elif root.is_dir():
            candidates = root.rglob("*")
        else:
            continue
        for path in candidates:
            if not path.is_file() or path.suffix.lower() not in extensions:
                continue
            if any(part in {".git", "_site", "node_modules", "vendor"} for part in path.parts):
                continue
            if path not in seen:
                seen.add(path)
                yield path


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return ""


def scan_patterns(path: Path, patterns: Iterable[dict]) -> list[str]:
    text = read_text(path)
    rel = path.relative_to(ROOT).as_posix()
    findings: list[str] = []
    for item in patterns:
        pattern = item.get("regex")
        if pattern and re.search(pattern, text):
            findings.append(f"{rel}: private pattern '{item.get('name', pattern)}' - {item.get('reason', '')}")
    return findings


def scan_reviewed_text(path: Path, config: dict) -> list[str]:
    text = read_text(path)
    rel = path.relative_to(ROOT).as_posix()
    findings: list[str] = []
    for item in config.get("restricted_terms", []):
        term = str(item.get("term", "")).strip()
        if term and term in text:
            findings.append(f"{rel}: restricted term '{term}' - {item.get('reason', '')}")
    findings.extend(scan_patterns(path, config.get("private_patterns", [])))
    return findings


def parse_front_matter(path: Path) -> dict:
    text = read_text(path)
    if not text.startswith("---\n"):
        return {}
    try:
        front_matter, _ = text[4:].split("\n---\n", 1)
    except ValueError:
        return {}
    parsed = yaml.safe_load(front_matter)
    return parsed if isinstance(parsed, dict) else {}


def check_approved_insights(config: dict) -> list[str]:
    findings: list[str] = []
    approved = {normalize_rule(item) for item in config.get("approved_insight_files", []) if normalize_rule(item)}
    article_root = ROOT / "_tbnews"
    actual = {
        path.relative_to(ROOT).as_posix()
        for path in article_root.rglob("*.md")
        if path.is_file()
    } if article_root.is_dir() else set()

    for item in sorted(approved - actual):
        findings.append(f"{item}: approved Insight source is missing")
    for item in sorted(actual - approved):
        findings.append(f"{item}: unapproved Insight source exists in the public collection")

    for item in sorted(approved & actual):
        path = ROOT / item
        meta = parse_front_matter(path)
        if not meta:
            findings.append(f"{item}: valid YAML front matter is required")
            continue
        if meta.get("layout") != "tb-article-authority":
            findings.append(f"{item}: layout must be tb-article-authority")
        if meta.get("insight") is not True:
            findings.append(f"{item}: insight must be true")
        robots = str(meta.get("robots", "")).lower()
        if "index" not in robots or "noindex" in robots:
            findings.append(f"{item}: approved Insight must explicitly use an indexable robots directive")
        if not str(meta.get("last_modified", "")).strip():
            findings.append(f"{item}: last_modified is required")
        if not str(meta.get("author", "")).strip():
            findings.append(f"{item}: author is required")
        if not str(meta.get("reviewed_by", "")).strip():
            findings.append(f"{item}: reviewed_by is required")
        references = meta.get("references")
        if not isinstance(references, list) or not references:
            findings.append(f"{item}: at least one primary reference is required")
    return findings


def check_public_references(config: dict) -> list[str]:
    findings: list[str] = []
    fragments = [str(item) for item in config.get("forbidden_public_references", []) if str(item)]
    for raw in config.get("public_reference_files", []):
        item = normalize_rule(raw)
        path = ROOT / item
        if not path.is_file():
            continue
        text = read_text(path)
        for fragment in fragments:
            if fragment in text:
                findings.append(f"{item}: references retired public route '{fragment}'")
    return findings


def main() -> int:
    config = load_config()
    allowed = config.get("allowed_paths_for_restricted_terms", [])
    findings: list[str] = check_forbidden_paths(config)
    findings.extend(check_approved_insights(config))
    findings.extend(check_public_references(config))

    for path in iter_files(config, "global_scan_roots"):
        findings.extend(scan_patterns(path, config.get("global_private_patterns", [])))

    for path in iter_files(config, "public_roots"):
        if is_allowed(path, allowed):
            continue
        findings.extend(scan_reviewed_text(path, config))

    if findings:
        print("Content governance check failed:\n")
        for finding in sorted(set(findings)):
            print(f"- {finding}")
        print("\nRemove the content or document an approved exception outside public sources.")
        return 1

    print("Content governance check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
