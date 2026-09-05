#!/usr/bin/env python3
"""Validate public website sources for restricted claims and private-data patterns."""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path
from typing import Iterable

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "_data" / "content_guardrails.yml"


def load_config() -> dict:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def is_allowed(path: Path, allowed: Iterable[str]) -> bool:
    rel = relative(path)
    return any(rel == item.rstrip("/") or rel.startswith(item.rstrip("/") + "/") for item in allowed)


def all_public_files(config: dict) -> list[Path]:
    extensions = set(config.get("scan_extensions", []))
    files: set[Path] = set()
    for root_name in config.get("public_roots", []):
        root = ROOT / root_name
        candidates = [root] if root.is_file() else root.rglob("*") if root.is_dir() else []
        for path in candidates:
            if not path.is_file() or path.suffix.lower() not in extensions:
                continue
            if any(part in {".git", "_site", "node_modules", "vendor"} for part in path.parts):
                continue
            files.add(path)
    return sorted(files)


def changed_public_files(config: dict, base_ref: str | None) -> list[Path]:
    if not base_ref:
        return all_public_files(config)
    try:
        output = subprocess.check_output(
            ["git", "diff", "--name-only", f"{base_ref}...HEAD"],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return all_public_files(config)
    allowed_extensions = set(config.get("scan_extensions", []))
    roots = [item.rstrip("/") for item in config.get("public_roots", [])]
    result: list[Path] = []
    for raw in output.splitlines():
        rel = raw.strip()
        if not rel:
            continue
        path = ROOT / rel
        if not path.is_file() or path.suffix.lower() not in allowed_extensions:
            continue
        if any(rel == root or rel.startswith(root + "/") for root in roots):
            result.append(path)
    return sorted(set(result))


def scan(paths: list[Path], config: dict) -> list[str]:
    findings: list[str] = []
    allowed = config.get("allowed_paths", [])
    checks = [
        ("restricted claim", config.get("restricted_patterns", [])),
        ("private pattern", config.get("private_patterns", [])),
    ]
    for path in paths:
        if is_allowed(path, allowed):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        rel = relative(path)
        for category, items in checks:
            for item in items:
                pattern = item.get("regex")
                if pattern and re.search(pattern, text, re.IGNORECASE | re.DOTALL):
                    reason = item.get("reason", "")
                    suffix = f" - {reason}" if reason else ""
                    findings.append(f"{rel}: {category} '{item.get('name', pattern)}'{suffix}")
    return sorted(set(findings))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="scan all public source files")
    parser.add_argument("--base-ref", default=None, help="scan public files changed from this git ref")
    args = parser.parse_args()

    config = load_config()
    base_ref = None if args.all else args.base_ref
    paths = all_public_files(config) if args.all else changed_public_files(config, base_ref)
    findings = scan(paths, config)

    if findings:
        print("Public content governance check failed:\n")
        for finding in findings:
            print(f"- {finding}")
        return 1

    scope = "all public sources" if args.all or not base_ref else f"changes from {base_ref}"
    print(f"Public content governance check passed ({scope}; {len(paths)} files).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
