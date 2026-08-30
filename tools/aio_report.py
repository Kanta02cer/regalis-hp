#!/usr/bin/env python3
"""
Trillion Bank AIO Intelligence Report Generator v1.0
販売代理店・クライアント向けAIOスコア統合レポートを自動生成する。

4軸診断:
  1. llms.txt 品質（既存 aio_analyzer.py 活用）
  2. 構造化データ・メタタグ
  3. コンテンツAIO最適化
  4. 技術SEO・パフォーマンス

Usage:
  python tools/aio_report.py                # フルレポート生成（ターミナル + JSON + Markdown）
  python tools/aio_report.py --json         # JSONのみ出力
  python tools/aio_report.py --md           # Markdownレポートのみ
  python tools/aio_report.py --quick        # クイックサマリー（ターミナルのみ）
"""

import os
import re
import sys
import json
import glob
import yaml
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import Counter

# ── Paths ─────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
NEWS_DIR = ROOT / "_news"
LAYOUTS_DIR = ROOT / "_layouts"
INCLUDES_DIR = ROOT / "_includes"
DATA_DIR = ROOT / "_data"
CONFIG_PATH = ROOT / "_config.yml"
REPORT_OUT_JSON = ROOT / "tools" / "aio_report.json"
REPORT_OUT_MD = ROOT / "tools" / "aio_report.md"

JST = timezone(timedelta(hours=9))

# ── ANSI Colors ───────────────────────────────────────────────────────────
class C:
    RESET  = "\033[0m"
    BOLD   = "\033[1m"
    RED    = "\033[91m"
    YELLOW = "\033[93m"
    GREEN  = "\033[92m"
    CYAN   = "\033[96m"
    BLUE   = "\033[94m"
    GRAY   = "\033[90m"
    WHITE  = "\033[97m"
    PURPLE = "\033[95m"


# ══════════════════════════════════════════════════════════════════════════
# 1. llms.txt 品質診断
# ══════════════════════════════════════════════════════════════════════════

def audit_llms_txt() -> dict:
    """全llms.txtバリエーションをスキャン・スコアリング"""
    variants = {}
    llms_files = list(ROOT.glob("llms*.txt"))

    for f in sorted(llms_files):
        text = f.read_text(encoding="utf-8", errors="replace")
        char_count = len(text)

        # 基本構造チェック
        has_title = bool(re.search(r'^#\s+', text, re.MULTILINE))
        h2_count = len(re.findall(r'^##\s+', text, re.MULTILINE))
        has_url = bool(re.search(r'https?://', text))
        has_price = bool(re.search(r'[¥￥][\d,]+|[\d,]+(?:万円|円/月)', text))
        has_contact = bool(re.search(r'(?:問い合わせ|相談|contact|お問い合わせ)', text, re.IGNORECASE))
        has_ceo = bool(re.search(r'井上幹太|かんちゃん|代表', text))
        has_service = bool(re.search(r'HackⅡ|Hack2|メディア運営|AIO|LLMO', text))
        fact_bullets = len(re.findall(r'^[-*]\s+\*\*.+?\*\*', text, re.MULTILINE))
        definition_count = len(re.findall(r'とは[、。]|について', text))

        # スコアリング（100点満点）
        score = 0
        score += min(15, int(char_count / 200))  # 文字数（最大15pt）
        score += 10 if has_title else 0
        score += min(15, h2_count * 3)  # セクション構造（最大15pt）
        score += 10 if has_url else 0
        score += 10 if has_price else 0
        score += 5 if has_contact else 0
        score += 10 if has_ceo else 0
        score += 10 if has_service else 0
        score += min(10, fact_bullets * 2)  # ファクト密度（最大10pt）
        score += min(5, definition_count)  # 定義文（最大5pt）
        score = min(100, score)

        variants[f.name] = {
            "file": f.name,
            "chars": char_count,
            "score": score,
            "has_title": has_title,
            "h2_sections": h2_count,
            "has_price": has_price,
            "has_ceo": has_ceo,
            "has_service": has_service,
            "fact_bullets": fact_bullets,
        }

    # 総合スコア = 全バリエーションの加重平均（メインllms.txt重視）
    if not variants:
        return {"score": 0, "variants": {}, "count": 0, "issues": ["llms.txt が見つかりません"]}

    main_score = variants.get("llms.txt", {}).get("score", 0)
    avg_score = sum(v["score"] for v in variants.values()) / len(variants)
    # メイン70% + 平均30%
    overall = int(main_score * 0.7 + avg_score * 0.3)

    # バリエーション数ボーナス（5種以上で+5、10種以上で+10）
    variant_bonus = min(10, max(0, (len(variants) - 3) * 2))
    overall = min(100, overall + variant_bonus)

    issues = []
    if not variants.get("llms.txt", {}).get("has_price"):
        issues.append("メインllms.txtに料金情報なし")
    if not variants.get("llms.txt", {}).get("has_ceo"):
        issues.append("メインllms.txtに代表情報なし")
    if len(variants) < 3:
        issues.append("llms.txtバリエーションが3種未満（推奨: 5種以上）")

    return {
        "score": overall,
        "variant_count": len(variants),
        "variants": variants,
        "issues": issues,
    }


# ══════════════════════════════════════════════════════════════════════════
# 2. 構造化データ・メタタグ診断
# ══════════════════════════════════════════════════════════════════════════

def audit_structured_data() -> dict:
    """HTMLファイルからJSON-LDスキーマとメタタグを検出"""
    schema_types = Counter()
    pages_with_jsonld = 0
    pages_checked = 0
    faq_pages = 0
    meta_issues = []

    # レイアウトファイルのJSON-LD確認
    layout_schemas = []
    corp_layout = LAYOUTS_DIR / "corp.html"
    if corp_layout.exists():
        layout_text = corp_layout.read_text(encoding="utf-8", errors="replace")
        layout_schemas = re.findall(r'"@type"\s*:\s*"([^"]+)"', layout_text)
        for st in layout_schemas:
            schema_types[st] += 1

    # 主要ページのJSON-LDスキャン
    html_patterns = [
        ROOT / "index.html",
        ROOT / "contact" / "index.html",
        ROOT / "company" / "index.html",
    ]
    for bp in (ROOT / "business").glob("*/index.html"):
        html_patterns.append(bp)
    for hp in (ROOT / "hackii").glob("*/index.html"):
        html_patterns.append(hp)
    html_patterns.append(ROOT / "hackii" / "index.html")

    for html_path in html_patterns:
        if not html_path.exists():
            continue
        pages_checked += 1
        text = html_path.read_text(encoding="utf-8", errors="replace")

        # JSON-LD検出
        jsonld_blocks = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', text, re.DOTALL)
        if jsonld_blocks:
            pages_with_jsonld += 1
        for block in jsonld_blocks:
            types = re.findall(r'"@type"\s*:\s*"([^"]+)"', block)
            for t in types:
                schema_types[t] += 1
            if "FAQPage" in block:
                faq_pages += 1

    # _news/のFAQPage検出（フロントマター）
    news_faq_count = 0
    news_total = 0
    for nf in NEWS_DIR.glob("*.md"):
        if nf.name.startswith("_"):
            continue
        news_total += 1
        text = nf.read_text(encoding="utf-8", errors="replace")
        if "FAQPage" in text:
            news_faq_count += 1

    # スコアリング（100点満点）
    score = 0
    # レイアウトに基本スキーマ（最大25pt）
    essential_types = {"Organization", "WebSite", "WebPage", "LocalBusiness", "BreadcrumbList"}
    for et in essential_types:
        if schema_types.get(et, 0) > 0:
            score += 5

    # サービスページのスキーマ（最大15pt）
    service_types = {"Service", "Product", "FAQPage", "HowTo", "Person", "Corporation"}
    for st in service_types:
        if schema_types.get(st, 0) > 0:
            score += 2.5
    score = int(score)

    # FAQPage普及率（最大15pt）
    if news_total > 0:
        faq_ratio = news_faq_count / news_total
        score += int(faq_ratio * 15)

    # ページカバレッジ（最大10pt）
    if pages_checked > 0:
        coverage = pages_with_jsonld / pages_checked
        score += int(coverage * 10)

    # Speakable対応（+5pt）
    if schema_types.get("SpeakableSpecification", 0) > 0 or "Speakable" in str(schema_types):
        score += 5

    # スキーマ種類の多様性（+10pt）
    score += min(10, len(schema_types) * 1)

    # 記事FAQスキーマ率ボーナス（+5pt if >80%）
    if news_total > 0 and news_faq_count / news_total > 0.8:
        score += 5

    score = min(100, score)

    issues = []
    if schema_types.get("FAQPage", 0) == 0 and faq_pages == 0 and news_faq_count == 0:
        issues.append("FAQPageスキーマ未実装")
    if schema_types.get("Service", 0) == 0:
        issues.append("Serviceスキーマ未実装（事業ページ推奨）")
    if schema_types.get("Person", 0) == 0:
        issues.append("Personスキーマ未実装（代表ページ推奨）")

    return {
        "score": score,
        "schema_types": dict(schema_types),
        "schema_type_count": len(schema_types),
        "pages_checked": pages_checked,
        "pages_with_jsonld": pages_with_jsonld,
        "news_total": news_total,
        "news_faq_count": news_faq_count,
        "faq_ratio": round(news_faq_count / max(1, news_total) * 100, 1),
        "layout_schemas": list(set(layout_schemas)),
        "issues": issues,
    }


# ══════════════════════════════════════════════════════════════════════════
# 3. コンテンツAIO最適化診断
# ══════════════════════════════════════════════════════════════════════════

def audit_content() -> dict:
    """_news/記事と主要ページのAIOコンテンツ品質を診断"""
    articles = []
    total_articles = 0
    with_ai_summary = 0
    with_keywords = 0
    with_definition = 0  # 「〇〇とは」型見出し
    with_bold_def = 0    # 太字定義文
    with_faq_html = 0    # HTML本文中FAQ
    categories = Counter()
    monthly_counts = Counter()

    template_file = NEWS_DIR / "_TEMPLATE.md"

    for nf in sorted(NEWS_DIR.glob("*.md")):
        if nf.name.startswith("_"):
            continue
        total_articles += 1

        text = nf.read_text(encoding="utf-8", errors="replace")
        # フロントマター解析
        fm_match = re.match(r'^---\s*\n(.*?)\n---', text, re.DOTALL)
        fm = {}
        body = text
        if fm_match:
            try:
                fm = yaml.safe_load(fm_match.group(1)) or {}
            except yaml.YAMLError:
                pass
            body = text[fm_match.end():]

        if fm.get("ai_summary"):
            with_ai_summary += 1
        if fm.get("keywords"):
            with_keywords += 1
        if fm.get("category"):
            categories[fm["category"]] += 1

        # 日付から月別カウント
        date_match = re.match(r'(\d{4}-\d{2})', nf.name)
        if date_match:
            monthly_counts[date_match.group(1)] += 1

        # 定義型見出し
        if re.search(r'^#{1,3}\s+.{2,30}とは', body, re.MULTILINE):
            with_definition += 1

        # 太字定義文
        if re.search(r'\*\*.{2,40}とは[、,]', body):
            with_bold_def += 1

        # FAQ HTML セクション
        if re.search(r'(?:FAQ|よくある質問|Q\.|質問)', body, re.IGNORECASE):
            with_faq_html += 1

    # ブランドシグナル（トップページ確認）
    brand_signals = {"regalis_count": 0, "ceo_count": 0, "price_count": 0}
    index_path = ROOT / "index.html"
    if index_path.exists():
        idx_text = index_path.read_text(encoding="utf-8", errors="replace")
        brand_signals["regalis_count"] = len(re.findall(r'Regalis|レガリス', idx_text, re.IGNORECASE))
        brand_signals["ceo_count"] = len(re.findall(r'井上幹太|かんちゃん', idx_text))
        brand_signals["price_count"] = len(re.findall(r'[¥￥][\d,]+|98,000', idx_text))

    # 最新記事の鮮度
    now = datetime.now(JST)
    current_month = now.strftime("%Y-%m")
    last_month = (now.replace(day=1) - timedelta(days=1)).strftime("%Y-%m")
    recent_articles = monthly_counts.get(current_month, 0) + monthly_counts.get(last_month, 0)

    # スコアリング（100点満点）
    score = 0

    # 記事数（最大15pt: 100本以上で満点）
    score += min(15, int(total_articles / 100 * 15))

    # ai_summary実装率（最大10pt）
    if total_articles > 0:
        score += int((with_ai_summary / total_articles) * 10)

    # keywords実装率（最大5pt）
    if total_articles > 0:
        score += int((with_keywords / total_articles) * 5)

    # 定義型見出し率（最大15pt）
    if total_articles > 0:
        score += int((with_definition / total_articles) * 15)

    # 太字定義文率（最大10pt）
    if total_articles > 0:
        score += int((with_bold_def / total_articles) * 10)

    # FAQ HTML率（最大10pt）
    if total_articles > 0:
        score += int((with_faq_html / total_articles) * 10)

    # 投稿鮮度（最大10pt: 直近2ヶ月で8本以上）
    score += min(10, int(recent_articles / 8 * 10))

    # ブランドシグナル（最大10pt）
    score += min(4, brand_signals["regalis_count"] // 3)
    score += 3 if brand_signals["ceo_count"] > 0 else 0
    score += 3 if brand_signals["price_count"] > 0 else 0

    # カテゴリ多様性（最大5pt）
    score += min(5, len(categories))

    score = min(100, score)

    issues = []
    if recent_articles < 4:
        issues.append(f"直近2ヶ月の記事数が{recent_articles}本（推奨: 月4本以上）")
    if total_articles > 0 and with_definition / total_articles < 0.5:
        issues.append("「〇〇とは」定義型見出しが50%未満のページあり")
    if total_articles > 0 and with_faq_html / total_articles < 0.3:
        issues.append("HTML本文内FAQセクションが不足（30%未満）")

    # 月別投稿データ（直近6ヶ月）
    monthly_data = {}
    for i in range(6):
        d = now.replace(day=1) - timedelta(days=i * 30)
        m = d.strftime("%Y-%m")
        monthly_data[m] = monthly_counts.get(m, 0)

    return {
        "score": score,
        "total_articles": total_articles,
        "with_ai_summary": with_ai_summary,
        "with_keywords": with_keywords,
        "with_definition": with_definition,
        "with_bold_def": with_bold_def,
        "with_faq_html": with_faq_html,
        "ai_summary_rate": round(with_ai_summary / max(1, total_articles) * 100, 1),
        "definition_rate": round(with_definition / max(1, total_articles) * 100, 1),
        "categories": dict(categories),
        "monthly_counts": monthly_data,
        "recent_articles": recent_articles,
        "brand_signals": brand_signals,
        "issues": issues,
    }


# ══════════════════════════════════════════════════════════════════════════
# 4. 技術SEO・パフォーマンス診断
# ══════════════════════════════════════════════════════════════════════════

def audit_technical() -> dict:
    """_config.yml, robots.txt, sitemap, レイアウトの技術品質を診断"""
    checks = {}

    # _config.yml
    config = {}
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, encoding="utf-8") as f:
            config = yaml.safe_load(f) or {}
    checks["has_url"] = bool(config.get("url"))
    checks["has_title"] = bool(config.get("title"))
    checks["has_description"] = bool(config.get("description"))
    checks["has_timezone"] = bool(config.get("timezone"))

    # robots.txt
    robots_path = ROOT / "robots.txt"
    checks["has_robots"] = robots_path.exists()
    ai_crawlers_allowed = 0
    if robots_path.exists():
        robots_text = robots_path.read_text(encoding="utf-8", errors="replace")
        ai_crawlers_allowed = len(re.findall(
            r'(?:ChatGPT|GPTBot|Google-Extended|Anthropic|Claude|PerplexityBot|Bingbot)',
            robots_text, re.IGNORECASE
        ))
    checks["ai_crawlers_allowed"] = ai_crawlers_allowed

    # sitemap
    sitemap_files = list(ROOT.glob("sitemap*.xml"))
    checks["sitemap_count"] = len(sitemap_files)

    # レイアウトファイルの品質チェック
    corp_layout = LAYOUTS_DIR / "corp.html"
    layout_checks = {
        "has_canonical": False,
        "has_hreflang": False,
        "has_ogp": False,
        "has_twitter_card": False,
        "has_preconnect": False,
        "has_lang_ja": False,
        "has_aria": False,
        "has_lazy_loading": False,
        "has_ai_meta": False,
        "has_indexnow": False,
    }
    if corp_layout.exists():
        lt = corp_layout.read_text(encoding="utf-8", errors="replace")
        layout_checks["has_canonical"] = "canonical" in lt
        layout_checks["has_hreflang"] = "hreflang" in lt
        layout_checks["has_ogp"] = "og:title" in lt or "og:description" in lt
        layout_checks["has_twitter_card"] = "twitter:card" in lt
        layout_checks["has_preconnect"] = "preconnect" in lt
        layout_checks["has_lang_ja"] = 'lang="ja"' in lt
        layout_checks["has_aria"] = "aria-" in lt
        layout_checks["has_lazy_loading"] = 'loading="lazy"' in lt
        layout_checks["has_ai_meta"] = "ai-summary" in lt or "ai-entity" in lt
        layout_checks["has_indexnow"] = "indexnow" in lt.lower() or (ROOT / "b8f3e2d1c4a57690.txt").exists()

    # AIディスカバリーファイル
    ai_discovery = {
        "llms_txt": (ROOT / "llms.txt").exists(),
        "ai_patch_json": (ROOT / "ai-patch.json").exists(),
        "knowledge_json": (ROOT / "knowledge.json").exists(),
        "aio_scores_json": (ROOT / "aio-scores.json").exists(),
    }
    ai_discovery_count = sum(1 for v in ai_discovery.values() if v)

    # 画像最適化チェック
    webp_count = len(list(ROOT.glob("**/*.webp")))
    img_tags_with_lazy = 0
    img_tags_total = 0
    for html_file in ROOT.glob("**/*.html"):
        if ".git" in str(html_file) or "_site" in str(html_file) or "vendor" in str(html_file):
            continue
        try:
            ht = html_file.read_text(encoding="utf-8", errors="replace")
            imgs = re.findall(r'<img[^>]*>', ht)
            img_tags_total += len(imgs)
            img_tags_with_lazy += sum(1 for img in imgs if 'loading="lazy"' in img)
        except Exception:
            pass

    # スコアリング（100点満点）
    score = 0

    # 基本SEO設定（最大15pt）
    for k in ["has_url", "has_title", "has_description", "has_timezone", "has_robots"]:
        if checks.get(k):
            score += 3

    # レイアウト品質（最大30pt）
    layout_points = {
        "has_canonical": 4, "has_hreflang": 3, "has_ogp": 4,
        "has_twitter_card": 2, "has_preconnect": 2, "has_lang_ja": 3,
        "has_aria": 3, "has_ai_meta": 5, "has_indexnow": 4,
    }
    for k, pts in layout_points.items():
        if layout_checks.get(k):
            score += pts

    # AIクローラビリティ（最大25pt）
    score += min(10, ai_crawlers_allowed * 2)
    score += ai_discovery_count * 3  # 各ファイル3pt（最大12pt）
    score += min(3, checks.get("sitemap_count", 0))

    # 画像最適化（最大10pt）
    if img_tags_total > 0:
        lazy_ratio = img_tags_with_lazy / img_tags_total
        score += int(lazy_ratio * 5)
    score += min(5, webp_count)

    score = min(100, score)

    issues = []
    if not layout_checks["has_ai_meta"]:
        issues.append("ai-summary / ai-entityメタタグ未実装")
    if ai_crawlers_allowed < 3:
        issues.append("robots.txtでAIクローラー許可が不足")
    if webp_count == 0:
        issues.append("WebP画像が0件（画像最適化推奨）")
    if img_tags_total > 0 and img_tags_with_lazy / img_tags_total < 0.5:
        issues.append(f"lazy loading適用率が低い（{img_tags_with_lazy}/{img_tags_total}）")

    return {
        "score": score,
        "config_checks": checks,
        "layout_checks": layout_checks,
        "ai_discovery": ai_discovery,
        "ai_discovery_count": ai_discovery_count,
        "ai_crawlers_allowed": ai_crawlers_allowed,
        "sitemap_count": checks.get("sitemap_count", 0),
        "webp_count": webp_count,
        "img_tags_total": img_tags_total,
        "img_tags_with_lazy": img_tags_with_lazy,
        "issues": issues,
    }


# ══════════════════════════════════════════════════════════════════════════
# 統合レポート
# ══════════════════════════════════════════════════════════════════════════

def get_grade(score: int) -> str:
    if score >= 90: return "S  (Elite)"
    if score >= 80: return "A  (Strong)"
    if score >= 70: return "B+ (Good)"
    if score >= 60: return "B  (Average)"
    if score >= 50: return "C  (Needs Work)"
    return "D  (Critical)"


def generate_report() -> dict:
    """全4軸を実行し統合レポートを生成"""
    print(f"\n{C.CYAN}{'━'*60}{C.RESET}")
    print(f"{C.BOLD}{C.WHITE}  Trillion Bank AIO Intelligence Report v1.0{C.RESET}")
    print(f"{C.GRAY}  実行日: {datetime.now(JST).strftime('%Y-%m-%d %H:%M JST')}{C.RESET}")
    print(f"{C.CYAN}{'━'*60}{C.RESET}")

    print(f"\n{C.GRAY}[1/4] llms.txt 品質診断...{C.RESET}")
    llms = audit_llms_txt()

    print(f"{C.GRAY}[2/4] 構造化データ・メタタグ診断...{C.RESET}")
    structured = audit_structured_data()

    print(f"{C.GRAY}[3/4] コンテンツAIO最適化診断...{C.RESET}")
    content = audit_content()

    print(f"{C.GRAY}[4/4] 技術SEO・パフォーマンス診断...{C.RESET}")
    technical = audit_technical()

    # 総合スコア（加重平均）
    weights = {"llms": 0.25, "structured": 0.25, "content": 0.30, "technical": 0.20}
    total_score = int(
        llms["score"] * weights["llms"]
        + structured["score"] * weights["structured"]
        + content["score"] * weights["content"]
        + technical["score"] * weights["technical"]
    )

    # 全改善項目を統合・優先順位付け
    all_issues = []
    for issue in llms.get("issues", []):
        all_issues.append({"area": "llms.txt", "issue": issue})
    for issue in structured.get("issues", []):
        all_issues.append({"area": "構造化データ", "issue": issue})
    for issue in content.get("issues", []):
        all_issues.append({"area": "コンテンツ", "issue": issue})
    for issue in technical.get("issues", []):
        all_issues.append({"area": "技術SEO", "issue": issue})

    report = {
        "report_version": "1.0.0",
        "generated_at": datetime.now(JST).isoformat(),
        "site": "https://trillion-bank.jp",
        "brand": "株式会社トリリオンバンク",
        "total_score": total_score,
        "grade": get_grade(total_score),
        "axes": {
            "llms_txt": {"score": llms["score"], "weight": "25%", "detail": llms},
            "structured_data": {"score": structured["score"], "weight": "25%", "detail": structured},
            "content_aio": {"score": content["score"], "weight": "30%", "detail": content},
            "technical_seo": {"score": technical["score"], "weight": "20%", "detail": technical},
        },
        "issues": all_issues,
        "issue_count": len(all_issues),
    }

    return report


def bar_ascii(score: int, width: int = 20) -> str:
    filled = int((score / 100) * width)
    return "█" * filled + "░" * (width - filled)


def print_terminal_report(report: dict):
    """ターミナルにカラフルなレポートを表示"""
    total = report["total_score"]
    grade = report["grade"]

    def score_color(s):
        if s >= 80: return C.GREEN
        if s >= 60: return C.YELLOW
        return C.RED

    tc = score_color(total)

    print(f"\n{C.WHITE}{'═'*60}{C.RESET}")
    print(f"{C.BOLD}  総合AIOスコア: {tc}{total}{C.RESET}{C.BOLD} / 100  [{grade}]{C.RESET}")
    print(f"  {tc}{bar_ascii(total, 30)}{C.RESET}  {total}%")
    print(f"{C.WHITE}{'═'*60}{C.RESET}")

    print(f"\n{C.BOLD}📊 4軸スコア:{C.RESET}")
    axes_display = [
        ("llms_txt",        "llms.txt 品質        "),
        ("structured_data", "構造化データ・メタタグ"),
        ("content_aio",     "コンテンツAIO最適化   "),
        ("technical_seo",   "技術SEO・パフォーマンス"),
    ]
    for key, label in axes_display:
        s = report["axes"][key]["score"]
        w = report["axes"][key]["weight"]
        sc = score_color(s)
        print(f"  {label}  {sc}{bar_ascii(s, 16)}{C.RESET}  {sc}{s:>3}/100{C.RESET}  ({w})")

    # 主要データサマリー
    content_detail = report["axes"]["content_aio"]["detail"]
    llms_detail = report["axes"]["llms_txt"]["detail"]
    struct_detail = report["axes"]["structured_data"]["detail"]
    tech_detail = report["axes"]["technical_seo"]["detail"]

    print(f"\n{C.BOLD}📋 主要指標:{C.RESET}")
    metrics = [
        ("記事総数",             f"{content_detail['total_articles']}本"),
        ("llms.txtバリエーション", f"{llms_detail['variant_count']}種"),
        ("JSON-LDスキーマ種類",    f"{struct_detail['schema_type_count']}種"),
        ("記事FAQスキーマ率",      f"{struct_detail['faq_ratio']}%"),
        ("ai_summary実装率",      f"{content_detail['ai_summary_rate']}%"),
        ("定義型見出し率",         f"{content_detail['definition_rate']}%"),
        ("AIクローラー許可数",     f"{tech_detail['ai_crawlers_allowed']}種"),
        ("AIディスカバリーファイル",f"{tech_detail['ai_discovery_count']}/4"),
        ("直近2ヶ月記事数",        f"{content_detail['recent_articles']}本"),
    ]
    for i in range(0, len(metrics), 2):
        left = metrics[i]
        right = metrics[i+1] if i+1 < len(metrics) else ("", "")
        print(f"  {C.GRAY}{left[0]:<20}{C.CYAN}{left[1]:<10}{C.RESET}  {C.GRAY}{right[0]:<20}{C.CYAN}{right[1]}{C.RESET}")

    # 月別投稿トレンド
    monthly = content_detail.get("monthly_counts", {})
    if monthly:
        print(f"\n{C.BOLD}📈 月別記事投稿トレンド:{C.RESET}")
        for month, count in sorted(monthly.items(), reverse=True):
            bar_len = min(40, count)
            color = C.GREEN if count >= 4 else C.YELLOW if count >= 2 else C.RED
            print(f"  {month}  {color}{'█' * bar_len}{C.RESET} {count}本")

    # 改善アドバイス
    if report["issues"]:
        print(f"\n{C.BOLD}⚠️  改善項目 ({report['issue_count']}件):{C.RESET}")
        for item in report["issues"]:
            print(f"  {C.YELLOW}• [{item['area']}] {item['issue']}{C.RESET}")

    print(f"\n{C.WHITE}{'═'*60}{C.RESET}")
    print(f"{C.GRAY}  Powered by Trillion Bank AIO Intelligence{C.RESET}")
    print(f"{C.WHITE}{'═'*60}{C.RESET}\n")


def generate_markdown_report(report: dict) -> str:
    """販売代理店向けMarkdownレポートを生成"""
    now = datetime.now(JST).strftime("%Y年%m月%d日 %H:%M")
    total = report["total_score"]
    grade = report["grade"]

    content_d = report["axes"]["content_aio"]["detail"]
    llms_d = report["axes"]["llms_txt"]["detail"]
    struct_d = report["axes"]["structured_data"]["detail"]
    tech_d = report["axes"]["technical_seo"]["detail"]

    md = f"""# AIO Intelligence Report
**株式会社トリリオンバンク**
**診断日:** {now} JST | **サイト:** trillion-bank.jp

---

## Executive Summary

| 指標 | 値 |
|------|-----|
| **総合AIOスコア** | **{total} / 100** ({grade}) |
| llms.txt品質 | {report["axes"]["llms_txt"]["score"]}/100 |
| 構造化データ | {report["axes"]["structured_data"]["score"]}/100 |
| コンテンツAIO | {report["axes"]["content_aio"]["score"]}/100 |
| 技術SEO | {report["axes"]["technical_seo"]["score"]}/100 |

---

## 1. llms.txt 品質: {report["axes"]["llms_txt"]["score"]}/100

AI検索エンジン（ChatGPT / Claude / Gemini / Perplexity）がサイトを理解するための最重要ファイル。

| 指標 | 値 |
|------|-----|
| バリエーション数 | {llms_d["variant_count"]}種 |
| メインllms.txtスコア | {llms_d["variants"].get("llms.txt", {}).get("score", "N/A")}/100 |

### バリエーション別スコア

| ファイル | スコア | 文字数 | 料金記載 | 代表情報 |
|----------|--------|--------|----------|----------|
"""
    for name, v in sorted(llms_d["variants"].items()):
        md += f"| {name} | {v['score']}/100 | {v['chars']:,} | {'✓' if v['has_price'] else '✗'} | {'✓' if v['has_ceo'] else '✗'} |\n"

    md += f"""
---

## 2. 構造化データ: {report["axes"]["structured_data"]["score"]}/100

検索エンジンとAIがページ内容を正確に理解するための構造化マークアップ。

| 指標 | 値 |
|------|-----|
| JSON-LDスキーマ種類 | {struct_d["schema_type_count"]}種 |
| レイアウト共通スキーマ | {", ".join(struct_d["layout_schemas"][:5])} |
| 記事FAQスキーマ実装率 | {struct_d["faq_ratio"]}%（{struct_d["news_faq_count"]}/{struct_d["news_total"]}本）|

### 検出スキーマタイプ

{", ".join(f"`{k}` ({v})" for k, v in sorted(struct_d["schema_types"].items()))}

---

## 3. コンテンツAIO最適化: {report["axes"]["content_aio"]["score"]}/100

AI検索で引用されるためのコンテンツ構造・品質。

| 指標 | 値 |
|------|-----|
| 記事総数 | {content_d["total_articles"]}本 |
| ai_summary実装率 | {content_d["ai_summary_rate"]}% |
| 「〇〇とは」定義型見出し | {content_d["with_definition"]}本（{content_d["definition_rate"]}%）|
| 太字定義文 | {content_d["with_bold_def"]}本 |
| FAQ HTML | {content_d["with_faq_html"]}本 |
| 直近2ヶ月記事数 | {content_d["recent_articles"]}本 |

### 月別投稿トレンド

| 月 | 記事数 |
|----|--------|
"""
    for month, count in sorted(content_d["monthly_counts"].items(), reverse=True):
        md += f"| {month} | {count}本 |\n"

    md += f"""
### カテゴリ分布

| カテゴリ | 記事数 |
|----------|--------|
"""
    for cat, count in sorted(content_d["categories"].items(), key=lambda x: -x[1]):
        md += f"| {cat} | {count}本 |\n"

    md += f"""
---

## 4. 技術SEO: {report["axes"]["technical_seo"]["score"]}/100

| 指標 | 状態 |
|------|------|
| canonical | {"✓" if tech_d["layout_checks"]["has_canonical"] else "✗"} |
| hreflang | {"✓" if tech_d["layout_checks"]["has_hreflang"] else "✗"} |
| OGP | {"✓" if tech_d["layout_checks"]["has_ogp"] else "✗"} |
| Twitter Card | {"✓" if tech_d["layout_checks"]["has_twitter_card"] else "✗"} |
| ai-summary メタ | {"✓" if tech_d["layout_checks"]["has_ai_meta"] else "✗"} |
| IndexNow | {"✓" if tech_d["layout_checks"]["has_indexnow"] else "✗"} |
| AIクローラー許可 | {tech_d["ai_crawlers_allowed"]}種 |
| AIディスカバリーファイル | {tech_d["ai_discovery_count"]}/4 |
| サイトマップ | {tech_d["sitemap_count"]}件 |
| lazy loading | {tech_d["img_tags_with_lazy"]}/{tech_d["img_tags_total"]}画像 |

---

## 改善アクション（{report["issue_count"]}件）

| # | 領域 | 内容 |
|---|------|------|
"""
    for i, item in enumerate(report["issues"], 1):
        md += f"| {i} | {item['area']} | {item['issue']} |\n"

    md += f"""
---

*Generated by Trillion Bank AIO Intelligence Report v1.0*
*{now}*
"""
    return md


# ══════════════════════════════════════════════════════════════════════════
# Entry Point
# ══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    json_only = "--json" in flags
    md_only = "--md" in flags
    quick_mode = "--quick" in flags

    report = generate_report()

    if json_only:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    elif md_only:
        md = generate_markdown_report(report)
        print(md)
    else:
        # フルモード: ターミナル表示 + JSON保存 + Markdown保存
        print_terminal_report(report)

        # JSON保存
        with open(REPORT_OUT_JSON, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"{C.GREEN}📄 JSON レポート保存: {REPORT_OUT_JSON}{C.RESET}")

        # Markdown保存
        md = generate_markdown_report(report)
        with open(REPORT_OUT_MD, "w", encoding="utf-8") as f:
            f.write(md)
        print(f"{C.GREEN}📄 Markdown レポート保存: {REPORT_OUT_MD}{C.RESET}")

        if quick_mode:
            pass  # ターミナル表示のみ
