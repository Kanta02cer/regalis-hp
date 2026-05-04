#!/usr/bin/env python3
"""
Regalis AIO Analyzer™ — llms.txt 静的構造解析エンジン v1.0
外部APIに一切依存しないRegalis独自アルゴリズム
Usage:
  python tools/aio_analyzer.py [URL or file path]
  python tools/aio_analyzer.py                      # 自サイト /llms.txt を解析
  python tools/aio_analyzer.py https://example.com  # 外部サイト解析
  python tools/aio_analyzer.py ./llms.txt           # ローカルファイル解析
  python tools/aio_analyzer.py --report             # JSONレポートも出力
"""

import re
import sys
import json
import os
from urllib.parse import urlparse
from datetime import datetime

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


# ── ANSI Colors ────────────────────────────────────────────────────────────
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


# ── Data Fetching ──────────────────────────────────────────────────────────
def fetch_from_url(url: str) -> str | None:
    if not HAS_REQUESTS:
        print(f"{C.RED}Error: 'requests' ライブラリが必要です。pip install requests{C.RESET}")
        return None
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    target = f"{base_url}/llms.txt"
    print(f"\n{C.CYAN}🔍 取得中: {target}{C.RESET}")
    try:
        res = requests.get(target, timeout=8, headers={"User-Agent": "Regalis-AIO-Analyzer/1.0"})
        if res.status_code == 200:
            print(f"{C.GREEN}  ✅ 取得成功（{len(res.text)} 文字）{C.RESET}")
            return res.text
        else:
            print(f"{C.RED}  ❌ llms.txt が見つかりません (HTTP {res.status_code}){C.RESET}")
            return None
    except Exception as e:
        print(f"{C.RED}  ⚠️  アクセスエラー: {e}{C.RESET}")
        return None


def fetch_from_file(path: str) -> str | None:
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
        print(f"{C.GREEN}✅ ファイル読み込み完了（{len(text)} 文字）: {path}{C.RESET}")
        return text
    except FileNotFoundError:
        print(f"{C.RED}❌ ファイルが見つかりません: {path}{C.RESET}")
        return None


# ── Core Analysis ──────────────────────────────────────────────────────────
def analyze(text: str) -> dict:
    """Regalis独自アルゴリズムによる構造解析"""

    # ── Raw metrics ────────────────────────────────────────────────────────
    char_count   = len(text)
    h1_count     = len(re.findall(r'^#\s+[^\n]+', text, re.MULTILINE))
    h2_count     = len(re.findall(r'^##\s+[^\n]+', text, re.MULTILINE))
    h3_count     = len(re.findall(r'^###\s+[^\n]+', text, re.MULTILINE))
    list_items   = len(re.findall(r'^[-*+]\s+', text, re.MULTILINE))
    table_rows   = len(re.findall(r'^\|.+\|$', text, re.MULTILINE))
    md_links     = len(re.findall(r'\[.+?\]\(.+?\)', text))
    bare_urls    = len(re.findall(r'https?://[^\s)]+', text))
    total_links  = md_links + int(bare_urls * 0.5)

    # Definition patterns
    def_patterns = len(re.findall(
        r'(とは|について|特徴は|料金は|概要|説明).{0,60}(です|ます|なります|となります)',
        text
    ))
    # Fact patterns: **key**: value
    fact_patterns = len(re.findall(r'\*\*.+\*\*[：:].+', text))

    # Bonus signals
    has_mvv     = bool(re.search(r'Mission|Vision|Value', text, re.I))
    has_price   = bool(re.search(r'¥[\d,]+|円\/月|月額|料金|price', text, re.I))
    has_contact = bool(re.search(r'contact|お問い合わせ|相談|フォーム', text, re.I))
    has_keyfact = bool(re.search(r'Key\s*Facts|重要|基本情報|会社情報', text, re.I))
    has_date    = bool(re.search(r'20\d\d[-\/年]\d{1,2}', text))
    has_address = bool(re.search(r'東京|千代田|〒\d{3}|都道府県', text))

    # ── Scoring ────────────────────────────────────────────────────────────
    # 1. 情報量・網羅性 (25pt)
    vol = 0
    if char_count >= 3000:  vol += 15
    elif char_count >= 1500: vol += 10
    elif char_count >= 500:  vol += 5
    if h2_count >= 5:  vol += 5
    elif h2_count >= 3: vol += 3
    if has_price:   vol += 2
    if has_address: vol += 1
    if has_date:    vol += 2
    vol = min(vol, 25)

    # 2. 構造化・見出し設計 (25pt)
    struct = 0
    if h1_count == 1:    struct += 12
    elif h1_count > 1:   struct += 4
    if h2_count >= 4:    struct += 10
    elif h2_count >= 2:  struct += 6
    elif h2_count >= 1:  struct += 3
    if h3_count >= 2:    struct += 2
    if has_mvv:          struct += 1
    struct = min(struct, 25)

    # 3. リスト化・可読性 (20pt)
    lst = 0
    if list_items >= 15:  lst += 14
    elif list_items >= 8: lst += 10
    elif list_items >= 4: lst += 6
    elif list_items >= 1: lst += 2
    if table_rows >= 5:   lst += 4
    elif table_rows >= 2: lst += 2
    if fact_patterns >= 5: lst += 2
    lst = min(lst, 20)

    # 4. 定義・断定型表現 (20pt)
    defn = 0
    if def_patterns >= 5:    defn += 14
    elif def_patterns >= 3:  defn += 10
    elif def_patterns >= 1:  defn += 5
    if fact_patterns >= 8:   defn += 4
    elif fact_patterns >= 4: defn += 2
    if has_keyfact:          defn += 2
    defn = min(defn, 20)

    # 5. リンク・参照性 (10pt)
    lnk = 0
    if md_links >= 15:  lnk += 8
    elif md_links >= 8: lnk += 6
    elif md_links >= 4: lnk += 4
    elif md_links >= 1: lnk += 2
    if has_contact:     lnk += 2
    lnk = min(lnk, 10)

    total = vol + struct + lst + defn + lnk

    # ── Feedback ───────────────────────────────────────────────────────────
    warnings = []
    positives = []

    if char_count < 500:
        warnings.append(f"文字数が不足 ({char_count}文字)。500文字以上を目標にしてください。")
    else:
        positives.append(f"情報量は十分です ({char_count:,}文字)。")

    if h1_count == 0:
        warnings.append("H1見出し（# タイトル）がありません。主題を最初に定義してください。")
    elif h1_count > 1:
        warnings.append(f"H1見出しが{h1_count}個あります（1つに絞ることを推奨）。")
    else:
        positives.append("H1見出しが正しく1つ設定されています。")

    if h2_count < 2:
        warnings.append(f"H2セクションが不足しています（現在{h2_count}個）。情報を区分してください。")

    if list_items < 4:
        warnings.append(f"箇条書きが少ないです（{list_items}個）。AIはリスト形式を最も正確に抽出します。")
    else:
        positives.append(f"箇条書きが十分にあります（{list_items}個）。")

    if def_patterns < 2:
        warnings.append("定義型表現「〜とは〜です」が少ないです。断定的な表現を増やしてください。")

    if md_links < 4:
        warnings.append(f"Markdownリンクが少ないです（{md_links}個）。主要ページへのリンクを追加しましょう。")
    else:
        positives.append(f"Markdownリンクが十分にあります（{md_links}個）。")

    if not has_price:
        warnings.append("料金情報が含まれていません。AIが価格を回答できるよう追加しましょう。")
    if not has_mvv:
        warnings.append("Mission/Vision/Valueが記載されていません。企業の存在意義をAIに伝えましょう。")
    if not has_contact:
        warnings.append("お問い合わせ先情報が含まれていません。Contactセクションを追加しましょう。")

    return {
        "score": total,
        "categories": {
            "volume":     {"name": "情報量・網羅性",    "score": vol,    "max": 25},
            "structure":  {"name": "構造化・見出し設計", "score": struct, "max": 25},
            "lists":      {"name": "リスト化・可読性",   "score": lst,    "max": 20},
            "definition": {"name": "定義・断定型表現",   "score": defn,   "max": 20},
            "links":      {"name": "リンク・参照性",     "score": lnk,    "max": 10},
        },
        "metrics": {
            "char_count": char_count,
            "h1_count": h1_count,
            "h2_count": h2_count,
            "h3_count": h3_count,
            "list_items": list_items,
            "table_rows": table_rows,
            "md_links": md_links,
            "def_patterns": def_patterns,
            "fact_patterns": fact_patterns,
        },
        "signals": {
            "mvv": has_mvv, "price": has_price, "contact": has_contact,
            "keyfacts": has_keyfact, "date": has_date, "address": has_address,
        },
        "warnings": warnings,
        "positives": positives,
    }


def get_grade(score: int) -> tuple[str, str]:
    if score >= 90: return "Excellent ★★★★★", C.CYAN
    if score >= 75: return "Good      ★★★★☆", C.BLUE
    if score >= 55: return "Fair      ★★★☆☆", C.YELLOW
    if score >= 35: return "Poor      ★★☆☆☆", C.RED
    return                  "Critical  ★☆☆☆☆", C.RED


def bar(score: int, max_score: int, width: int = 20) -> str:
    filled = int((score / max_score) * width)
    return "█" * filled + "░" * (width - filled)


# ── Report Rendering ──────────────────────────────────────────────────────
def print_report(result: dict, source_label: str = ""):
    score = result["score"]
    grade_label, grade_color = get_grade(score)

    print(f"\n{C.WHITE}{'='*60}{C.RESET}")
    print(f"{C.BOLD}{C.WHITE}  Regalis AIO Analyzer™ — 解析レポート{C.RESET}")
    if source_label:
        print(f"{C.GRAY}  解析対象: {source_label}{C.RESET}")
    print(f"{C.GRAY}  実行日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{C.RESET}")
    print(f"{C.WHITE}{'='*60}{C.RESET}")

    # Score
    score_color = grade_color
    print(f"\n{C.BOLD}📊 AIO構造スコア: {score_color}{score}{C.RESET}{C.BOLD} / 100点{C.RESET}")
    print(f"  グレード: {grade_color}{grade_label}{C.RESET}")
    print(f"  {score_color}{'█' * int(score/5)}{'░' * (20 - int(score/5))}{C.RESET}  {score}%\n")

    # Breakdown
    print(f"{C.BOLD}📋 カテゴリ別スコア:{C.RESET}")
    for cat in result["categories"].values():
        s, m = cat["score"], cat["max"]
        color = C.GREEN if s >= m * 0.8 else C.YELLOW if s >= m * 0.5 else C.RED
        b = bar(s, m, 16)
        print(f"  {cat['name']:<14} {color}{b}{C.RESET}  {color}{s:>2}/{m}{C.RESET}")

    # Raw metrics
    m = result["metrics"]
    print(f"\n{C.BOLD}🔬 構造メトリクス:{C.RESET}")
    print(f"  {C.GRAY}文字数       : {m['char_count']:,}文字{C.RESET}")
    print(f"  {C.GRAY}H1見出し     : {m['h1_count']}個{C.RESET}")
    print(f"  {C.GRAY}H2見出し     : {m['h2_count']}個{C.RESET}")
    print(f"  {C.GRAY}箇条書き     : {m['list_items']}個{C.RESET}")
    print(f"  {C.GRAY}テーブル行   : {m['table_rows']}行{C.RESET}")
    print(f"  {C.GRAY}Markdownリンク: {m['md_links']}個{C.RESET}")
    print(f"  {C.GRAY}定義型表現   : {m['def_patterns']}個{C.RESET}")

    # Warnings
    if result["warnings"]:
        print(f"\n{C.BOLD}⚠️  改善アドバイス ({len(result['warnings'])}件):{C.RESET}")
        for w in result["warnings"]:
            print(f"  {C.YELLOW}• {w}{C.RESET}")

    # Positives
    if result["positives"]:
        print(f"\n{C.BOLD}✅ 良好な点:{C.RESET}")
        for p in result["positives"]:
            print(f"  {C.GREEN}• {p}{C.RESET}")

    print(f"\n{C.WHITE}{'='*60}{C.RESET}\n")


# ── Entry Point ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = [a for a in sys.argv[1:] if a.startswith('--')]
    save_report = '--report' in flags

    if not args:
        # Default: analyze own site's llms.txt
        root = os.path.join(os.path.dirname(__file__), '..', 'llms.txt')
        text = fetch_from_file(root)
        label = root
    elif args[0].startswith('http'):
        text = fetch_from_url(args[0])
        label = args[0]
    else:
        text = fetch_from_file(args[0])
        label = args[0]

    if not text:
        sys.exit(1)

    result = analyze(text)
    print_report(result, label)

    if save_report:
        report_path = os.path.join(os.path.dirname(__file__), 'aio_report.json')
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump({
                "generated_at": datetime.now().isoformat(),
                "source": label,
                **result
            }, f, ensure_ascii=False, indent=2)
        print(f"{C.GREEN}📄 JSONレポートを保存しました: {report_path}{C.RESET}\n")
