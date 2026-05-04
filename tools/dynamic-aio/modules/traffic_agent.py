"""
Traffic Agent — Nginxアクセスログ解析モジュール
Phase 1: ローカルファイル読み込み
Phase 2: リモートログ転送 / Datadog API 連携（拡張予定）
"""

import re, gzip, logging
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)

NGINX_PATTERN = re.compile(
    r'(?P<ip>\S+)\s+\S+\s+\S+'
    r'\s+\[(?P<time>[^\]]+)\]'
    r'\s+"(?P<method>\S+)\s+(?P<path>\S+)\s+\S+"'
    r'\s+(?P<status>\d+)\s+(?P<size>\d+|-)'
    r'\s+"(?P<referer>[^"]*)"\s+"(?P<ua>[^"]*)"'
)
TIME_FORMAT = "%d/%b/%Y:%H:%M:%S %z"

@dataclass
class AccessRecord:
    ip: str; timestamp: datetime; method: str; path: str
    status: int; size: int; referer: str; user_agent: str; is_human: bool = True

@dataclass
class TrafficSummary:
    hourly_counts: dict = field(default_factory=lambda: defaultdict(lambda: defaultdict(int)))
    total_counts:  dict = field(default_factory=lambda: defaultdict(int))
    window_start: Optional[datetime] = None
    window_end:   Optional[datetime] = None
    total_records: int = 0; human_records: int = 0

class TrafficAgent:
    """Nginxアクセスログを解析してアクセス傾向を集計する"""
    def __init__(self, config: dict):
        self.config = config
        self.bot_pats = [re.compile(p, re.I) for p in config.get("log",{}).get("bot_patterns",[])]
        self.excl_pats= [re.compile(p) for p in config.get("trend",{}).get("exclude_patterns",[])]

    def is_bot(self, ua: str) -> bool:
        return any(p.search(ua) for p in self.bot_pats)

    def is_excluded(self, path: str) -> bool:
        return any(p.search(path) for p in self.excl_pats)

    def parse_line(self, line: str) -> Optional[AccessRecord]:
        m = NGINX_PATTERN.match(line.strip())
        if not m: return None
        try: ts = datetime.strptime(m.group("time"), TIME_FORMAT)
        except ValueError: return None
        return AccessRecord(
            ip=m.group("ip"), timestamp=ts, method=m.group("method"),
            path=m.group("path").split("?")[0],
            status=int(m.group("status")),
            size=int(m.group("size")) if m.group("size")!="-" else 0,
            referer=m.group("referer"), user_agent=m.group("ua"),
            is_human=not self.is_bot(m.group("ua")),
        )

    def parse(self, log_path: str, window_hours: int = 24) -> TrafficSummary:
        """ログファイルを解析して TrafficSummary を返す"""
        path = Path(log_path); summary = TrafficSummary()
        now = datetime.now().astimezone(); cutoff = now - timedelta(hours=window_hours)
        summary.window_start = cutoff; summary.window_end = now
        if not path.exists():
            logger.warning(f"ログファイルが見つかりません: {log_path}"); return summary
        opener = gzip.open if path.suffix == ".gz" else open
        mode   = "rt"     if path.suffix == ".gz" else "r"
        try:
            with opener(path, mode, encoding="utf-8", errors="ignore") as f:
                for line in f:
                    r = self.parse_line(line)
                    if not r or r.timestamp < cutoff: continue
                    if r.status >= 400 or r.method not in ("GET","HEAD"): continue
                    if self.is_excluded(r.path): continue
                    summary.total_records += 1
                    if r.is_human:
                        summary.human_records += 1
                        hk = r.timestamp.strftime("%Y-%m-%d %H:00")
                        summary.hourly_counts[r.path][hk] += 1
                        summary.total_counts[r.path]      += 1
        except Exception as e: logger.error(f"ログ解析エラー: {e}")
        logger.info(f"解析完了: {summary.human_records}/{summary.total_records}件 ({len(summary.total_counts)} URL)")
        return summary

    def parse_sample(self, sample_data: str, window_hours: int = 24) -> TrafficSummary:
        """文字列からログを解析 (Phase 1 手動入力用)"""
        lines = sample_data.strip().splitlines()
        # Wrap as file-like parse
        summary = TrafficSummary()
        now = datetime.now().astimezone(); cutoff = now - timedelta(hours=window_hours)
        summary.window_start = cutoff; summary.window_end = now
        for line in lines:
            r = self.parse_line(line)
            if not r or r.status >= 400 or not r.is_human or self.is_excluded(r.path): continue
            summary.total_records += 1; summary.human_records += 1
            hk = r.timestamp.strftime("%Y-%m-%d %H:00")
            summary.hourly_counts[r.path][hk] += 1; summary.total_counts[r.path] += 1
        return summary
