#!/usr/bin/env python3
"""Detect confidential repository content and unsupported public-site claims."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterable

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "_data" / "content_guardrails.yml"
EXCLUDED_DIRS = {".git", "_site", "node_modules", "vendor", ".bundle"}


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


def iter_files(root_names: Iterable[str], extensions: set[str]) -> Iterable[Path]:
    seen: set[Path] = set()
    for root_name in root_names:
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
            if any(part in EXCLUDED_DIRS for part in path.parts):
                continue
            if path not in seen:
                seen.add(path)
                yield path


def iter_repository_files(extensions: set[str]) -> Iterable[Path]:
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in extensions:
            continue
        if any(part in EXCLUDED_DIRS for part in path.parts):
            continue
        yield path


def read_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict-claims", action="store_true", help="treat unsupported public claims as errors")
    args = parser.parse_args()

    config = load_config()
    allowed = config.get("allowed_paths_for_restricted_terms", [])
    extensions = set(config.get("scan_extensions", []))
    errors: list[str] = []
    warnings: list[str] = []

    # Public repositories must not contain files labelled confidential, even outside built site roots.
    for path in iter_repository_files(extensions):
        if is_allowed(path, allowed):
            continue
        text = read_text(path)
        if text is None:
            continue
        rel = path.relative_to(ROOT).as_posix()
        for term in config.get("repository_restricted_terms", []):
            if term in text:
                errors.append(f"{rel}: repository-confidential marker '{term}'")

    # Public-site sources: unsupported claims are report-only during cleanup, strict at release.
    for path in iter_files(config.get("public_roots", []), extensions):
        if is_allowed(path, allowed):
            continue
        text = read_text(path)
        if text is None:
            continue
        rel = path.relative_to(ROOT).as_posix()

        for item in config.get("restricted_terms", []):
            term = str(item.get("term", "")).strip()
            if term and term in text:
                target = errors if args.strict_claims else warnings
                target.append(f"{rel}: restricted claim '{term}' - {item.get('reason', '')}")

        for item in config.get("private_patterns", []):
            pattern = item.get("regex")
            if pattern and re.search(pattern, text):
                errors.append(f"{rel}: private pattern '{item.get('name', pattern)}'")

    if warnings:
        print("Public-claim warnings:\n")
        for finding in sorted(set(warnings)):
            print(f"- {finding}")
        print()

    if errors:
        print("Content governance check failed:\n")
        for finding in sorted(set(errors)):
            print(f"- {finding}")
        return 1

    print("Content governance check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
