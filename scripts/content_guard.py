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
    """Check exact paths and directory prefixes even when they are not public build roots."""
    findings: list[str] = []

    for raw in config.get("forbidden_paths", []):
        item = normalize_rule(raw)
        if not item:
            continue
        path = ROOT / item
        if path.exists():
            findings.append(f"{item}: forbidden repository path exists")

    for raw in config.get("forbidden_prefixes", []):
        item = normalize_rule(raw)
        if not item:
            continue
        path = ROOT / item
        if path.exists():
            findings.append(f"{item}/: forbidden repository prefix exists")

    return findings


def iter_public_files(config: dict) -> Iterable[Path]:
    extensions = {str(ext).lower() for ext in config.get("scan_extensions", [])}
    seen: set[Path] = set()

    for root_name in config.get("public_roots", []):
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


def scan_text(path: Path, config: dict) -> list[str]:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return []

    rel = path.relative_to(ROOT).as_posix()
    findings: list[str] = []

    for item in config.get("restricted_terms", []):
        term = str(item.get("term", "")).strip()
        if term and term in text:
            findings.append(f"{rel}: restricted term '{term}' - {item.get('reason', '')}")

    for item in config.get("private_patterns", []):
        pattern = item.get("regex")
        if not pattern:
            continue
        if re.search(pattern, text):
            findings.append(
                f"{rel}: private pattern '{item.get('name', pattern)}' - {item.get('reason', '')}"
            )

    return findings


def main() -> int:
    config = load_config()
    allowed = config.get("allowed_paths_for_restricted_terms", [])
    findings: list[str] = check_forbidden_paths(config)

    for path in iter_public_files(config):
        if is_allowed(path, allowed):
            continue
        findings.extend(scan_text(path, config))

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
