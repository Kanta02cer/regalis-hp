#!/usr/bin/env python3
"""
Regalis Dynamic AIO — メインオーケストレーター v1.1
特許候補3: トラフィック連動型 llms.txt 動的生成システム

処理フロー:
  [Cron 1h] → Traffic Agent → Trend Analyzer → Content Extractor → Dynamic Generator
                                                                          ↓
                                                          llms.txt 上書き保存

SEO競合調査フロー:
  python main.py --seo-report
  → build_keyword_catalog → scrape_competitors → analyze_gaps
  → score_traffic_loss → generate_report (JSON + Markdown)

Usage:
  python main.py                        # 通常実行（llms.txt動的更新）
  python main.py --dry-run              # ファイル書き換えなし（確認用）
  python main.py --manual               # 手動でURLと件数を入力
  python main.py --log /path/to/access.log  # ログファイルを直接指定
  python main.py --seo-report           # SEO競合調査レポート生成
  python main.py --seo-report --dry-run # SEOレポートをファイル保存せず出力
"""

import sys, json, logging, argparse
from pathlib import Path
from datetime import datetime, timezone, timedelta

import yaml

# モジュールを相対インポート
sys.path.insert(0, str(Path(__file__).parent))
from modules.traffic_agent     import TrafficAgent
from modules.trend_analyzer    import TrendAnalyzer
from modules.content_extractor import ContentExtractor
from modules.dynamic_generator import DynamicGenerator
from modules.seo_competitor    import SEOCompetitorEngine

JST = timezone(timedelta(hours=9))

def setup_logging(log_file: str = "data/dynamic_aio.log"):
    Path(log_file).parent.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(log_file, encoding="utf-8"),
        ]
    )

def load_config(config_path: str = "config.yml") -> dict:
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)

def save_report(config: dict, result, trends):
    report_path = Path(config["scheduler"]["report_file"])
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "generated_at": datetime.now(JST).isoformat(),
        "success": result.success,
        "trends_count": result.trends_count,
        "char_count_before": result.char_count_before,
        "char_count_after":  result.char_count_after,
        "llms_path": result.llms_path,
        "trends": [
            {"url": t.url, "count": t.current_count, "growth_pct": t.growth_pct, "rank": t.rank}
            for t in trends
        ],
        "error": result.error,
    }
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    logging.getLogger("main").info(f"レポート保存: {report_path}")

def run_auto(config: dict, log_path: str, dry_run: bool):
    """自動モード: ログファイルを解析してllms.txtを更新する"""
    logger = logging.getLogger("main")

    # Step 1: Traffic Agent
    logger.info("=== Step 1: Traffic Agent ===")
    agent = TrafficAgent(config)
    window = config["log"]["window_hours"]
    summary = agent.parse(log_path, window_hours=window)
    logger.info(f"  解析URL数: {len(summary.total_counts)}")

    if not summary.total_counts:
        logger.warning("アクセスデータが取得できませんでした。処理を終了します。")
        return

    # Step 2: Trend Analyzer
    logger.info("=== Step 2: Trend Analyzer ===")
    analyzer = TrendAnalyzer(config)
    trends = analyzer.analyze(summary)
    if not trends:
        logger.info("トレンドURLが検出されませんでした（閾値未達）。")
        # トレンドなしでもジェネレータを呼んでHot Topicsを除去
    for t in trends:
        logger.info(f"  Rank {t.rank}: {t.url} (+{t.growth_pct:.0f}%, {t.current_count}件)")

    # Step 3: Content Extractor
    logger.info("=== Step 3: Content Extractor ===")
    extractor = ContentExtractor(config)
    contents = extractor.extract_all([t.url for t in trends])

    # Step 4: Dynamic Generator
    logger.info("=== Step 4: Dynamic Generator ===")
    if dry_run:
        from modules.dynamic_generator import DynamicGenerator
        gen = DynamicGenerator(config)
        hot = gen._build_hot_section(trends, contents) if trends else "(トレンドなし)"
        logger.info(f"[DRY RUN] 生成されるHot Topicsセクション:\n{hot}")
        return

    gen = DynamicGenerator(config)
    result = gen.generate(trends, contents)

    if result.success:
        logger.info(f"✅ llms.txt 更新完了: {result.char_count_before}文字 → {result.char_count_after}文字")
    else:
        logger.error(f"❌ 更新失敗: {result.error}")

    save_report(config, result, trends)
    return result

def run_manual(config: dict):
    """手動モード (Phase 1): URLと件数を手動入力してllms.txtを更新する"""
    logger = logging.getLogger("main")
    print("\n--- Phase 1 手動モード ---")
    print("トレンドURLと直近アクセス数を入力してください（空行で終了）")
    url_counts = {}
    while True:
        line = input("URL (例: /news/aio-guide/): ").strip()
        if not line: break
        try:
            count = int(input(f"  {line} のアクセス数: "))
            url_counts[line] = count
        except ValueError:
            print("  数値を入力してください")

    if not url_counts:
        print("入力なし。終了します。")
        return

    analyzer = TrendAnalyzer(config)
    trends = analyzer.analyze_simple(url_counts)

    extractor = ContentExtractor(config)
    contents = extractor.extract_all([t.url for t in trends])

    gen = DynamicGenerator(config)
    result = gen.generate(trends, contents)
    if result.success:
        print(f"\n✅ llms.txt 更新完了: {result.char_count_after}文字")
        print(f"Hot Topicsセクション:\n{result.hot_section}")
    else:
        print(f"\n❌ 更新失敗: {result.error}")

def run_seo_report(config: dict, dry_run: bool):
    """SEO競合調査レポートを生成する"""
    logger = logging.getLogger("main")
    logger.info("=== SEO競合調査モード ===")
    engine = SEOCompetitorEngine(config)
    report = engine.run(dry_run=dry_run)
    tl = report.traffic_loss
    logger.info(
        f"完了: 総合スコア {tl.overall_score:.1f}/100 "
        f"| キーワードカバレッジ {tl.coverage_score:.1f}% "
        f"| 月間損失推定 -{tl.monthly_traffic_loss:,} UU"
    )
    return report


def main():
    parser = argparse.ArgumentParser(description="Regalis Dynamic AIO Orchestrator v1.1")
    parser.add_argument("--dry-run",    action="store_true", help="ファイルを書き換えずに内容を表示")
    parser.add_argument("--manual",     action="store_true", help="手動でURLを入力するPhase 1モード")
    parser.add_argument("--log",        default=None,        help="ログファイルのパスを直接指定")
    parser.add_argument("--config",     default="config.yml",help="設定ファイルのパス")
    parser.add_argument("--seo-report", action="store_true", help="SEO競合調査レポートを生成")
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config["scheduler"]["log_file"])
    logger = logging.getLogger("main")
    logger.info(f"Regalis Dynamic AIO v1.1 起動 ({'DRY RUN' if args.dry_run else '本番'})")

    if args.seo_report:
        run_seo_report(config, dry_run=args.dry_run)
    elif args.manual:
        run_manual(config)
    else:
        log_path = args.log or config["log"]["nginx_access_log"]
        run_auto(config, log_path, dry_run=args.dry_run)

if __name__ == "__main__":
    main()
