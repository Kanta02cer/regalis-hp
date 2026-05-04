"""
Trend Analyzer — トレンドURL抽出モジュール
前日比で急上昇しているURLを特定する（Regalis独自アルゴリズム）
"""

import logging
from dataclasses import dataclass, field
from typing import Optional
from .traffic_agent import TrafficSummary

logger = logging.getLogger(__name__)

@dataclass
class TrendResult:
    url: str
    current_count: int       # 直近Nhの合計
    baseline_count: float    # 前期間の平均
    growth_pct: float        # 増加率 (%)
    rank: int                # ランキング（1=1位）

class TrendAnalyzer:
    """
    TrafficSummaryからトレンドURLを抽出する。

    アルゴリズム:
      1. 直近 window_recent_hours のアクセス数を集計
      2. baseline_hours 前の同時間帯のアクセス数（または全体平均）を計算
      3. growth_pct = (recent - baseline) / max(baseline, 1) * 100
      4. growth_pct >= threshold_pct のURLを「トレンド」として選出
      5. growth_pct 降順で上位 top_n を返す
    """
    def __init__(self, config: dict):
        cfg = config.get("trend", {})
        self.threshold_pct     = cfg.get("threshold_pct", 200)
        self.top_n             = cfg.get("top_n", 3)
        self.window_recent_hours = 3   # 直近3時間
        self.baseline_hours      = 24  # 比較対象: 24時間前の同3時間

    def analyze(self, summary: TrafficSummary) -> list[TrendResult]:
        """
        TrafficSummaryを受け取り、トレンドURL一覧を返す。
        """
        from datetime import datetime, timedelta
        now = datetime.now().astimezone()
        recent_cutoff = now - timedelta(hours=self.window_recent_hours)
        baseline_start = now - timedelta(hours=self.baseline_hours + self.window_recent_hours)
        baseline_end   = now - timedelta(hours=self.baseline_hours)

        results = []

        for path, hourly in summary.hourly_counts.items():
            recent_count   = 0
            baseline_count = 0

            for hour_str, count in hourly.items():
                try:
                    hour_dt = datetime.strptime(hour_str, "%Y-%m-%d %H:00").astimezone()
                except ValueError:
                    continue

                if hour_dt >= recent_cutoff:
                    recent_count += count
                elif baseline_start <= hour_dt < baseline_end:
                    baseline_count += count

            baseline_avg = max(baseline_count, 1)
            growth_pct = (recent_count - baseline_avg) / baseline_avg * 100

            if recent_count > 0 and growth_pct >= self.threshold_pct:
                results.append(TrendResult(
                    url=path, current_count=recent_count,
                    baseline_count=baseline_avg,
                    growth_pct=round(growth_pct, 1), rank=0,
                ))

        results.sort(key=lambda x: x.growth_pct, reverse=True)
        for i, r in enumerate(results[:self.top_n], 1):
            r.rank = i

        logger.info(f"トレンド検出: {len(results[:self.top_n])}件 (閾値: {self.threshold_pct}%増)")
        return results[:self.top_n]

    def analyze_simple(self, url_counts: dict[str, int], top_n: Optional[int] = None) -> list[TrendResult]:
        """
        Phase 1 手動モード: 単純なアクセス数ランキング（前日比なし）
        url_counts: {url: count} の辞書
        """
        n = top_n or self.top_n
        sorted_items = sorted(url_counts.items(), key=lambda x: x[1], reverse=True)
        results = []
        for i, (url, count) in enumerate(sorted_items[:n], 1):
            results.append(TrendResult(
                url=url, current_count=count,
                baseline_count=0, growth_pct=0.0, rank=i,
            ))
        return results
