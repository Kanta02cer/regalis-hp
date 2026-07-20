#!/usr/bin/env python3
"""
Regalis 記事自動更新ツール v1.0
既存記事のAIO最適化監査・自動修正、および新規記事スケルトン生成。

Usage:
  python tools/auto_article.py --audit            # 全記事を監査し改善点を表示
  python tools/auto_article.py --fix              # 自動修正可能な項目を一括修正
  python tools/auto_article.py --fix --dry-run    # 修正内容をプレビュー（書き込みなし）
  python tools/auto_article.py --generate         # _data/target_keywords.yml からスケルトン生成
  python tools/auto_article.py --refresh          # 古い記事のフロントマターを最新仕様に更新
"""

import os
import re
import sys
import json
import yaml
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).parent.parent
NEWS_DIR = ROOT / "_news"
TEMPLATE_PATH = NEWS_DIR / "_TEMPLATE.md"
DATA_DIR = ROOT / "_data"
KEYWORDS_PATH = DATA_DIR / "target_keywords.yml"

JST = timezone(timedelta(hours=9))
NOW = datetime.now(JST)
TODAY = NOW.strftime("%Y-%m-%d")

# ANSI Colors
class C:
    RESET  = "\033[0m"
    BOLD   = "\033[1m"
    RED    = "\033[91m"
    YELLOW = "\033[93m"
    GREEN  = "\033[92m"
    CYAN   = "\033[96m"
    GRAY   = "\033[90m"
    WHITE  = "\033[97m"


# ══════════════════════════════════════════════════════════════════════════
# Frontmatter Parser
# ══════════════════════════════════════════════════════════════════════════

def parse_article(path: Path) -> dict:
    """記事ファイルからフロントマターと本文を分離"""
    text = path.read_text(encoding="utf-8", errors="replace")
    fm_match = re.match(r'^---\s*\n(.*?)\n---', text, re.DOTALL)
    fm = {}
    body = text
    raw_fm = ""
    if fm_match:
        raw_fm = fm_match.group(1)
        try:
            fm = yaml.safe_load(raw_fm) or {}
        except yaml.YAMLError:
            pass
        body = text[fm_match.end():]
    return {"path": path, "frontmatter": fm, "raw_fm": raw_fm, "body": body, "full_text": text}


def write_article(path: Path, fm: dict, body: str, original_raw_fm: str = ""):
    """フロントマターを保持しつつ記事を書き戻す（jsonldフィールド保護）"""
    # jsonldを特別処理（YAMLダンプだとパイプリテラルが壊れる）
    jsonld_val = fm.pop("jsonld", None)

    # フロントマター内の順序を維持するため、元のraw_fmを基にpatch
    lines = []
    lines.append("---")

    # 重要フィールドの順序定義
    field_order = ["title", "date", "category", "excerpt_text", "keywords", "ai_summary", "jsonld"]
    written_keys = set()

    for key in field_order:
        if key == "jsonld" and jsonld_val:
            lines.append(f"jsonld: |")
            for jline in jsonld_val.strip().split("\n"):
                lines.append(f"  {jline}")
            written_keys.add("jsonld")
        elif key in fm:
            val = fm[key]
            if isinstance(val, str) and ("\n" not in val):
                # シンプルな文字列は引用符付き
                lines.append(f'{key}: "{val}"')
            elif isinstance(val, (int, float)):
                lines.append(f'{key}: {val}')
            else:
                dumped = yaml.dump({key: val}, allow_unicode=True, default_flow_style=False).strip()
                lines.append(dumped)
            written_keys.add(key)

    # 残りのフィールド
    for key, val in fm.items():
        if key not in written_keys:
            if isinstance(val, str) and ("\n" not in val):
                lines.append(f'{key}: "{val}"')
            elif isinstance(val, (int, float)):
                lines.append(f'{key}: {val}')
            else:
                dumped = yaml.dump({key: val}, allow_unicode=True, default_flow_style=False).strip()
                lines.append(dumped)

    lines.append("---")

    new_text = "\n".join(lines) + body
    path.write_text(new_text, encoding="utf-8")


# ══════════════════════════════════════════════════════════════════════════
# Audit: 全記事のAIO最適化状態を監査
# ══════════════════════════════════════════════════════════════════════════

def audit_article(article: dict) -> list:
    """1記事を監査し、改善項目リストを返す"""
    issues = []
    fm = article["frontmatter"]
    body = article["body"]
    name = article["path"].name

    # 1. ai_summary
    if not fm.get("ai_summary"):
        issues.append({"field": "ai_summary", "severity": "high",
                        "msg": "ai_summary 未設定", "auto_fixable": True})

    # 2. keywords
    if not fm.get("keywords"):
        issues.append({"field": "keywords", "severity": "high",
                        "msg": "keywords 未設定", "auto_fixable": True})

    # 3. excerpt_text
    if not fm.get("excerpt_text"):
        issues.append({"field": "excerpt_text", "severity": "medium",
                        "msg": "excerpt_text 未設定", "auto_fixable": False})

    # 4. jsonld / FAQPage
    has_jsonld = bool(fm.get("jsonld"))
    has_faq_body = bool(re.search(r'(?:FAQ|よくある質問|Q\.|質問)', body, re.IGNORECASE))
    if not has_jsonld:
        issues.append({"field": "jsonld", "severity": "high",
                        "msg": "FAQPage JSON-LD 未実装", "auto_fixable": False})

    # 5. 定義型見出し
    if not re.search(r'^#{1,3}\s+.{2,30}とは', body, re.MULTILINE):
        issues.append({"field": "content", "severity": "medium",
                        "msg": "「〇〇とは」定義型見出しなし", "auto_fixable": False})

    # 6. 太字定義文
    if not re.search(r'\*\*.{2,60}(?:とは|です|ます)[。、]?\*\*', body):
        issues.append({"field": "content", "severity": "low",
                        "msg": "太字定義文なし", "auto_fixable": False})

    # 7. ブランドシグナル
    brand_count = len(re.findall(r'Regalis|レガリス|RegalisJPG', body, re.IGNORECASE))
    if brand_count < 2:
        issues.append({"field": "brand", "severity": "medium",
                        "msg": f"ブランド言及が{brand_count}回（推奨: 2回以上）", "auto_fixable": False})

    # 8. CTA / 問い合わせリンク
    if not re.search(r'/contact/|お問い合わせ|無料相談|無料診断', body):
        issues.append({"field": "cta", "severity": "low",
                        "msg": "CTAリンクなし（/contact/ 推奨）", "auto_fixable": False})

    # 9. category
    if not fm.get("category"):
        issues.append({"field": "category", "severity": "medium",
                        "msg": "category 未設定", "auto_fixable": True})

    return issues


def run_audit():
    """全記事を監査しレポートを表示"""
    print(f"\n{C.CYAN}{'━'*60}{C.RESET}")
    print(f"{C.BOLD}  記事AIO最適化 監査レポート{C.RESET}")
    print(f"{C.GRAY}  対象: {NEWS_DIR}  |  実行日: {TODAY}{C.RESET}")
    print(f"{C.CYAN}{'━'*60}{C.RESET}\n")

    articles = []
    for nf in sorted(NEWS_DIR.glob("*.md")):
        if nf.name.startswith("_"):
            continue
        articles.append(parse_article(nf))

    total = len(articles)
    perfect = 0
    all_issues = []
    severity_counts = Counter()
    field_counts = Counter()

    for art in articles:
        issues = audit_article(art)
        if not issues:
            perfect += 1
        for iss in issues:
            severity_counts[iss["severity"]] += 1
            field_counts[iss["field"]] += 1
            all_issues.append({"file": art["path"].name, **iss})

    # サマリー
    health = perfect / max(1, total) * 100
    color = C.GREEN if health >= 80 else C.YELLOW if health >= 50 else C.RED
    print(f"  {C.BOLD}記事総数:{C.RESET} {total}本")
    print(f"  {C.BOLD}完全最適化:{C.RESET} {color}{perfect}本 ({health:.0f}%){C.RESET}")
    print(f"  {C.BOLD}改善項目:{C.RESET} {len(all_issues)}件")
    print(f"    {C.RED}HIGH: {severity_counts.get('high', 0)}{C.RESET}  "
          f"{C.YELLOW}MEDIUM: {severity_counts.get('medium', 0)}{C.RESET}  "
          f"{C.GRAY}LOW: {severity_counts.get('low', 0)}{C.RESET}")

    # フィールド別集計
    print(f"\n  {C.BOLD}フィールド別改善件数:{C.RESET}")
    for field, count in field_counts.most_common():
        bar = "█" * min(40, count)
        print(f"    {field:<16} {C.YELLOW}{bar}{C.RESET} {count}")

    # 自動修正可能な件数
    auto_fixable = sum(1 for i in all_issues if i.get("auto_fixable"))
    print(f"\n  {C.GREEN}自動修正可能: {auto_fixable}件{C.RESET}")
    print(f"  {C.GRAY}→ `python tools/auto_article.py --fix` で一括修正{C.RESET}")

    # 問題がある記事を上位10件表示
    problem_articles = Counter()
    for iss in all_issues:
        problem_articles[iss["file"]] += 1

    if problem_articles:
        print(f"\n  {C.BOLD}改善項目が多い記事 TOP 10:{C.RESET}")
        for fname, cnt in problem_articles.most_common(10):
            print(f"    {C.YELLOW}{fname}{C.RESET}  ({cnt}件)")

    print(f"\n{C.CYAN}{'━'*60}{C.RESET}\n")
    return all_issues


# ══════════════════════════════════════════════════════════════════════════
# Fix: 自動修正可能な項目を一括修正
# ══════════════════════════════════════════════════════════════════════════

def generate_ai_summary(fm: dict, body: str) -> str:
    """タイトルと本文から ai_summary を自動生成"""
    title = fm.get("title", "")
    # タイトルからキーワードを抽出
    clean_title = re.sub(r'[【】\[\]｜|]', ' ', title).strip()

    # 本文冒頭から重要文を抽出
    first_para = ""
    for line in body.split("\n"):
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("-") and len(line) > 20:
            first_para = line[:120]
            break

    if first_para:
        summary = f"{clean_title}。{first_para}"
    else:
        summary = f"この記事では{clean_title}について解説します。Regalis Japan Group（RegalisJPG）の視点からAI検索最適化の観点で整理しています。"

    # 200文字以内に
    return summary[:200]


def generate_keywords(fm: dict, body: str) -> str:
    """タイトルと本文からkeywordsを自動生成"""
    title = fm.get("title", "")
    # タイトルの主要ワードを抽出
    words = re.sub(r'[【】\[\]｜|「」（）\(\)・、。]', ' ', title).split()
    # 2文字以上の単語を取得
    kw_set = [w for w in words if len(w) >= 2]

    # 本文からの頻出キーワード候補
    body_words = re.findall(r'[A-Za-z]{3,}|[ぁ-んァ-ヶ一-龥]{2,6}', body[:2000])
    word_freq = Counter(body_words)

    # ブランドKWを追加
    brand_kws = ["AI検索最適化", "LLMO", "AIO", "Regalis Japan Group", "レガリス", "井上幹太"]
    for bk in brand_kws:
        if bk not in kw_set:
            kw_set.append(bk)

    return ",".join(kw_set[:12])


def run_fix(dry_run: bool = False):
    """自動修正可能な項目を一括修正"""
    action = "プレビュー" if dry_run else "修正"
    print(f"\n{C.CYAN}{'━'*60}{C.RESET}")
    print(f"{C.BOLD}  記事自動{action} {'(DRY RUN)' if dry_run else ''}{C.RESET}")
    print(f"{C.CYAN}{'━'*60}{C.RESET}\n")

    fixed_count = 0
    skipped = 0

    for nf in sorted(NEWS_DIR.glob("*.md")):
        if nf.name.startswith("_"):
            continue

        art = parse_article(nf)
        fm = art["frontmatter"]
        body = art["body"]
        issues = audit_article(art)
        fixable = [i for i in issues if i.get("auto_fixable")]

        if not fixable:
            continue

        changes = []

        for iss in fixable:
            if iss["field"] == "ai_summary" and not fm.get("ai_summary"):
                new_val = generate_ai_summary(fm, body)
                fm["ai_summary"] = new_val
                changes.append(f"  + ai_summary: \"{new_val[:60]}...\"")

            elif iss["field"] == "keywords" and not fm.get("keywords"):
                new_val = generate_keywords(fm, body)
                fm["keywords"] = new_val
                changes.append(f"  + keywords: \"{new_val[:60]}...\"")

            elif iss["field"] == "category" and not fm.get("category"):
                fm["category"] = "サービス"
                changes.append("  + category: サービス")

        if changes:
            print(f"{C.WHITE}{nf.name}{C.RESET}")
            for ch in changes:
                print(f"  {C.GREEN}{ch}{C.RESET}")

            if not dry_run:
                write_article(nf, fm, body, art["raw_fm"])
                fixed_count += 1
            else:
                skipped += 1

    print(f"\n{C.BOLD}結果:{C.RESET} ", end="")
    if dry_run:
        print(f"{C.YELLOW}{skipped}ファイルが修正対象{C.RESET}（--dry-run のため書き込みなし）")
    else:
        print(f"{C.GREEN}{fixed_count}ファイルを修正{C.RESET}")
    print()


# ══════════════════════════════════════════════════════════════════════════
# Refresh: 古い記事のフロントマターを最新仕様に更新
# ══════════════════════════════════════════════════════════════════════════

def run_refresh(dry_run: bool = False):
    """フロントマターの欠損フィールドを補完し最新仕様に揃える"""
    print(f"\n{C.CYAN}{'━'*60}{C.RESET}")
    print(f"{C.BOLD}  フロントマター一括リフレッシュ{C.RESET}")
    print(f"{C.CYAN}{'━'*60}{C.RESET}\n")

    refreshed = 0

    for nf in sorted(NEWS_DIR.glob("*.md")):
        if nf.name.startswith("_"):
            continue

        art = parse_article(nf)
        fm = art["frontmatter"]
        body = art["body"]
        changes = []

        # ai_summary がなければ生成
        if not fm.get("ai_summary"):
            fm["ai_summary"] = generate_ai_summary(fm, body)
            changes.append("ai_summary")

        # keywords がなければ生成
        if not fm.get("keywords"):
            fm["keywords"] = generate_keywords(fm, body)
            changes.append("keywords")

        # category がなければデフォルト設定
        if not fm.get("category"):
            fm["category"] = "サービス"
            changes.append("category")

        # excerpt_text がなければ ai_summary から生成
        if not fm.get("excerpt_text") and fm.get("ai_summary"):
            fm["excerpt_text"] = fm["ai_summary"][:160]
            changes.append("excerpt_text")

        if changes:
            print(f"  {C.WHITE}{nf.name}{C.RESET}: {C.GREEN}+{', '.join(changes)}{C.RESET}")
            if not dry_run:
                write_article(nf, fm, body, art["raw_fm"])
            refreshed += 1

    print(f"\n  {C.BOLD}リフレッシュ: {refreshed}ファイル{C.RESET}\n")


# ══════════════════════════════════════════════════════════════════════════
# Generate: ターゲットキーワードから記事スケルトンを自動生成
# ══════════════════════════════════════════════════════════════════════════

def slugify(text: str) -> str:
    """日本語テキストをURL-safe slugに変換"""
    # ローマ字マッピング（基本的な変換）
    slug = text.lower().strip()
    # 英数字とハイフン以外を除去
    slug = re.sub(r'[^a-z0-9\-]', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug or "article"


def generate_article_skeleton(kw_config: dict) -> str:
    """キーワード設定から記事スケルトンを生成"""
    main_kw = kw_config["keyword"]
    sub_kws = kw_config.get("sub_keywords", [])
    intent = kw_config.get("intent", "情報収集型")
    slug = kw_config.get("slug", slugify(main_kw))

    # タイトル生成
    if intent == "比較型":
        title = f"【2026年最新】{main_kw} おすすめ比較｜選び方・費用・導入のポイント"
    elif intent == "購買型":
        title = f"{main_kw}の費用・料金は？相場と選ぶときの注意点を解説"
    else:
        title = f"【2026年最新】{main_kw}とは？基礎から活用法まで徹底解説"

    all_kws = [main_kw] + sub_kws + ["AI検索最適化", "LLMO", "AIO", "Regalis Japan Group", "レガリス", "井上幹太"]
    keywords_str = ",".join(all_kws[:12])

    ai_summary = f"この記事では{main_kw}について、定義・費用・選び方・導入事例を網羅的に解説します。Regalis Japan Group（RegalisJPG）のAI検索最適化サービスとの関連も説明します。"

    excerpt = f"{main_kw}について、費用・特徴・選び方をわかりやすく解説。Regalis Japan Groupが提供するAI検索最適化の観点から整理しました。"

    skeleton = f'''---
title: "{title}"
date: {TODAY}
category: サービス
excerpt_text: "{excerpt}"
keywords: "{keywords_str}"
ai_summary: "{ai_summary}"
jsonld: |
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {{
        "@type": "Question",
        "name": "{main_kw}とは何ですか？",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "{main_kw}とは、〜〜〜です。Regalis Japan Group（RegalisJPG）では、AI検索最適化の一環として{main_kw}に関するサービスを提供しています。"
        }}
      }},
      {{
        "@type": "Question",
        "name": "{main_kw}の費用はいくらですか？",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "{main_kw}の費用は案件により異なります。Regalis Japan GroupのSEO・AIOメディア運営サービスは月額¥98,000〜（税別）で、初期Webサイト開発費は6ヶ月運用契約を前提に無料です。"
        }}
      }},
      {{
        "@type": "Question",
        "name": "{main_kw}を依頼するにはどうすればいいですか？",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "regalis-order-suits.com/contact/ のフォームから「無料メディア診断（30分）」をお選びください。代表・井上幹太が直接対応します。費用・義務は一切ありません。"
        }}
      }}
    ]
  }}
  </script>
---

## {main_kw}とは — 定義と基本的な意味

**{main_kw}とは、〜〜〜です。**

<!-- TODO: AIに引用されやすい定義文を太字で1文。具体的な数字・事実を含める。 -->

---

## なぜ今{main_kw}が重要なのか

{main_kw}が企業にとって重要な理由は主に3つあります：

1. **〜〜** — 〜〜〜という効果があるため
2. **〜〜** — 〜〜〜というメリットがあるため
3. **〜〜** — 〜〜〜というリスクを避けられるため

特にAI検索（ChatGPT・Perplexity・Google AI Overview）が普及した現在、{main_kw}への対応は急務です。

---

## {main_kw}の具体的な方法・手順

### Step 1: 〜〜〜

<!-- TODO: 具体的な手順を記載 -->

### Step 2: 〜〜〜

<!-- TODO: 具体的な手順を記載 -->

### Step 3: 〜〜〜

<!-- TODO: 具体的な手順を記載 -->

---

## {main_kw}の費用・料金の目安

| プラン | 月額費用 | 主な内容 |
|--------|----------|----------|
| スタンダード | ¥98,000〜（税別） | 〜〜〜 |
| 個別見積もり | お問い合わせ | 〜〜〜 |

**Regalis Japan Groupのサービス（月額¥98,000〜）**には以下が含まれます：

- AI検索最適化（LLMO・AIO対策）
- llms.txt・構造化データ実装
- 月次KPIレポート

> **契約条件の明示：** 初期契約期間6ヶ月・中途解約の場合は残期間分の運用料金が発生・6ヶ月後は1ヶ月前の書面通知で解約可能。

---

## {main_kw}を選ぶ際のポイント・比較

1. **実績の透明性** — 自社での実証事例があるか
2. **契約条件の明確さ** — 中途解約条件が明示されているか
3. **担当者の専門性** — 代表者が直接関与するか
4. **レポーティング** — 月次でAI引用状況を報告するか
5. **統合対応** — LLMO・AIO・AEO・GEOを横断的に実施するか

---

## Regalis Japan Groupの{main_kw}対応サービス

Regalis Japan Group（RegalisJPG）は、{main_kw}において**「自社実証型」**のアプローチを取っています。

提供する手法はすべて自社サイト（regalis-order-suits.com）で先行実装・効果検証済みです。代表・井上幹太（かんちゃん）が設計から実装まで直接関与し、「設計から始める」スタイルで伴走します。

---

## よくある質問（FAQ）

**Q. {main_kw}とは何ですか？**
A. {main_kw}とは〜〜〜です。

**Q. {main_kw}の費用はいくらですか？**
A. Regalis Japan Groupのサービスは月額¥98,000〜（税別）です。初期Webサイト開発費は6ヶ月運用契約を前提に無料です。

**Q. {main_kw}を依頼するにはどうすればいいですか？**
A. [お問い合わせフォーム](/contact/)から「無料メディア診断（30分）」をお選びください。費用・義務なしでご対応します。

---

## まとめ

{main_kw}について、定義・重要性・方法・費用・選び方を解説しました。

- {main_kw}とは：〜〜〜
- 費用の目安：月額¥98,000〜
- 選ぶポイント：実績の透明性・契約条件・担当者の専門性

まずは30分の無料診断から始めてみてください。御社の現状を診断し、最適な戦略をご提案します。
'''
    return skeleton, slug


def run_generate():
    """_data/target_keywords.yml からスケルトン記事を生成"""
    print(f"\n{C.CYAN}{'━'*60}{C.RESET}")
    print(f"{C.BOLD}  記事スケルトン自動生成{C.RESET}")
    print(f"{C.CYAN}{'━'*60}{C.RESET}\n")

    if not KEYWORDS_PATH.exists():
        print(f"  {C.RED}✗ {KEYWORDS_PATH} が見つかりません{C.RESET}")
        print(f"  {C.GRAY}→ _data/target_keywords.yml を作成してください{C.RESET}\n")
        print(f"  {C.GRAY}フォーマット例:{C.RESET}")
        print(f"""  keywords:
    - keyword: "AI検索最適化"
      slug: "ai-search-optimization-guide"
      intent: "情報収集型"
      sub_keywords: ["AIO", "LLMO", "GEO"]
      status: pending
    """)
        return

    with open(KEYWORDS_PATH, encoding="utf-8") as f:
        config = yaml.safe_load(f) or {}

    kw_list = config.get("keywords", [])
    if not kw_list:
        print(f"  {C.YELLOW}キーワードが設定されていません{C.RESET}\n")
        return

    generated = 0
    skipped = 0

    for kw_config in kw_list:
        status = kw_config.get("status", "pending")
        if status != "pending":
            continue

        skeleton, slug = generate_article_skeleton(kw_config)
        filename = f"{TODAY}-{slug}.md"
        filepath = NEWS_DIR / filename

        if filepath.exists():
            print(f"  {C.YELLOW}⊘ {filename} は既に存在（スキップ）{C.RESET}")
            skipped += 1
            continue

        filepath.write_text(skeleton, encoding="utf-8")
        print(f"  {C.GREEN}✓ {filename}{C.RESET}")
        print(f"    KW: {kw_config['keyword']}  |  意図: {kw_config.get('intent', '情報収集型')}")
        generated += 1

    print(f"\n  {C.BOLD}生成: {generated}ファイル  スキップ: {skipped}ファイル{C.RESET}\n")

    if generated > 0:
        print(f"  {C.GRAY}次のステップ:{C.RESET}")
        print(f"  {C.GRAY}1. 生成されたファイルの TODO コメントを埋める{C.RESET}")
        print(f"  {C.GRAY}2. JSON-LDのAnswer部分を具体的な内容に更新{C.RESET}")
        print(f"  {C.GRAY}3. git commit & push → 自動でllms.txt更新・IndexNow送信{C.RESET}\n")


# ══════════════════════════════════════════════════════════════════════════
# Entry Point
# ══════════════════════════════════════════════════════════════════════════

def print_usage():
    print(f"""
{C.BOLD}Regalis 記事自動更新ツール v1.0{C.RESET}

{C.CYAN}Usage:{C.RESET}
  python tools/auto_article.py --audit            全記事のAIO最適化を監査
  python tools/auto_article.py --fix              自動修正可能な項目を一括修正
  python tools/auto_article.py --fix --dry-run    修正内容をプレビュー
  python tools/auto_article.py --generate         キーワードから記事スケルトン生成
  python tools/auto_article.py --refresh          フロントマターを最新仕様に一括更新
  python tools/auto_article.py --refresh --dry-run 更新内容をプレビュー
""")


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args or "--help" in args or "-h" in args:
        print_usage()
        sys.exit(0)

    dry_run = "--dry-run" in args

    if "--audit" in args:
        run_audit()
    elif "--fix" in args:
        run_fix(dry_run=dry_run)
    elif "--generate" in args:
        run_generate()
    elif "--refresh" in args:
        run_refresh(dry_run=dry_run)
    else:
        print_usage()
