#!/usr/bin/env python3
"""Fail CI when public site sources contain restricted claims or private-data patterns."""
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


def is_allowed(path: Path, allowed: Iterable[str]) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    for item in allowed:
        item = item.rstrip("/")
        if rel == item or rel.startswith(item + "/"):
            return True
    return False


def iter_public_files(config: dict) -> Iterable[Path]:
    extensions = set(config.get("scan_extensions", []))
    seen: set[Path] = set()
    for root_name in config.get("public_roots", []):
        root = ROOT / root_name
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


def main() -> int:
    config = load_config()
    allowed = config.get("allowed_paths_for_restricted_terms", [])
    findings: list[str] = []

    for path in iter_public_files(config):
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        rel = path.relative_to(ROOT).as_posix()

        if is_allowed(path, allowed):
            continue

        for item in config.get("restricted_terms", []):
            term = str(item.get("term", "")).strip()
            if term and term in text:
                findings.append(f"{rel}: restricted term '{term}' - {item.get('reason', '')}")

        for item in config.get("private_patterns", []):
            pattern = item.get("regex")
            if not pattern:
                continue
            if re.search(pattern, text):
                findings.append(f"{rel}: private pattern '{item.get('name', pattern)}'")

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
