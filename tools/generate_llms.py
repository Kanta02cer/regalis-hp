#!/usr/bin/env python3
"""
Regalis 動的 llms.txt ジェネレーター v1.0
サイトデータ（_data/, _news/, _config.yml）から llms.txt を自動生成する。

Usage:
  python tools/generate_llms.py           # llms.txt を再生成して上書き
  python tools/generate_llms.py --dry-run # 生成内容を表示するだけ（ファイル書き込みなし）
  python tools/generate_llms.py --analyze # 生成後に aio_analyzer.py で採点も実行

このスクリプトは GitHub Actions (update-llms.yml) からも呼ばれる。
"""

import os
import sys
import re
import yaml
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT      = Path(__file__).parent.parent
DATA_DIR  = ROOT / "_data"
NEWS_DIR  = ROOT / "_news"
CONFIG    = ROOT / "_config.yml"
LLMS_OUT  = ROOT / "llms.txt"

JST = timezone(timedelta(hours=9))


# ── Helpers ────────────────────────────────────────────────────────────────
def load_yaml(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_frontmatter(path: Path) -> tuple[dict, str]:
    """Markdownファイルのフロントマターと本文を返す"""
    text = path.read_text(encoding="utf-8")
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', text, re.DOTALL)
    if not m:
        return {}, text
    fm = yaml.safe_load(m.group(1)) or {}
    body = text[m.end():]
    return fm, body


def get_recent_news(n: int = 20) -> list[dict]:
    """_news/ から最新N件の記事を返す（日付降順）"""
    articles = []
    if not NEWS_DIR.exists():
        return articles
    for f in NEWS_DIR.glob("*.md"):
        fm, _ = load_frontmatter(f)
        if not fm.get("title"):
            continue
        # slug = ファイル名の日付以降の部分
        slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', f.stem)
        articles.append({
            "title":    fm.get("title", ""),
            "date":     str(fm.get("date", "")),
            "category": fm.get("category", ""),
            "excerpt":  fm.get("excerpt_text", ""),
            "slug":     slug,
            "url":      f"https://regalis-order-suits.com/news/{slug}/",
        })
    articles.sort(key=lambda x: x["date"], reverse=True)
    return articles[:n]


# ── Generator ──────────────────────────────────────────────────────────────
def generate(config: dict, businesses: list[dict], news: list[dict]) -> str:
    now = datetime.now(JST).strftime("%Y-%m-%d")
    site_url = config.get("url", "https://regalis-order-suits.com")

    # ── Active businesses, sorted by role ──────────────────────────────────
    core_ids  = ["media-operation", "dx-consulting", "web-development"]
    extra_ids = ["sales-promotion", "order-suits", "student-ambassador", "talent", "leather-products"]

    biz_map = {b["id"]: b for b in businesses if isinstance(b, dict) and b.get("id")}
    core  = [biz_map[i] for i in core_ids  if i in biz_map]
    extra = [biz_map[i] for i in extra_ids if i in biz_map]

    def biz_line(b: dict) -> str:
        name = b.get("name", "")
        slug = b.get("id", "").replace("-", "/")
        url  = f"{site_url}/business/{b['id']}/"
        tag  = b.get("tagline", "")
        price= b.get("price_note", "")
        desc = tag + (f"。{price}" if price else "")
        return f"- [{name}]({url}): {desc}"

    # ── Recent news lines ──────────────────────────────────────────────────
    news_lines = "\n".join(
        f"- [{a['title']}]({a['url']})" + (f": {a['excerpt']}" if a.get("excerpt") else "")
        for a in news
    )

    # ── Core service details ───────────────────────────────────────────────
    media_op = biz_map.get("media-operation", {})
    price_note = media_op.get("price_note", "月額¥98,000〜（税別）")

    lines = f"""# Regalis Japan Group株式会社

> AI時代に生き残るメディアへ。レガリスジャパングループは、AIを一次情報に触れられるインフラとなることをVisionに掲げ、AIに選ばれるメディアをつくる持株会社です。自社オウンドメディアの設計・構築・運営代行（AIO最適化）を主力に、AI・DX・Web開発・オーダースーツ事業を展開。東京都千代田区麹町拠点。

## 会社概要

- **社名**：Regalis Japan Group株式会社
- **代表者**：井上幹太（Kanta Inoue）
- **所在地**：〒102-0083 東京都千代田区麹町6丁目2-1 麹町サイトビル6階
- **設立**：2025年12月23日
- **コーポレートサイト**：{site_url}
- **llms.txt（詳細版）**：{site_url}/llms-full.txt
- **最終更新**：{now}

## ミッション・ビジョン・バリュー

- **Mission**：AI時代に生き残るメディアへ
- **Vision**：AIを一次情報に触れられるインフラへ
- **Value**：AIに選ばれるメディアをつくる

## 代表プロフィール

**井上幹太（Kanta Inoue）**

- 不登校からの起業家（12年間の不登校経験を経て起業）
- N高グループ（通信制高校）在学
- ZEN大学1期特別奨学生
- ソフトバンクアカデミア17期（孫正義氏主宰の次世代リーダー育成プログラム）修了
- J-StarX（経済産業省 グローバル起業家育成プログラム）第1期
- 令和の虎 Tiger Funding 累計1,600万円・2連続完全ALL獲得
- 経営哲学：「設計から始める」——業務設計→AI実装→効果検証の一貫サポート

## Core DX 3事業（主力サービス）

{chr(10).join(biz_line(b) for b in core)}

### SEO・AIOメディア運営代行 — 料金・契約条件

- **月額料金**：{price_note}
- **初期Webサイト開発費**：無料（6ヶ月運用契約前提）
- **初期契約期間**：6ヶ月
- **中途解約条件**：中途解約の場合、残期間分の運用料金が発生
- **6ヶ月後の解約**：1ヶ月前の書面通知で解約可能
- **AIO対応内容**：llms.txt実装・JSON-LD構造化データ・AIクローラー設定・コンテンツ設計

## 展開事業

{chr(10).join(biz_line(b) for b in extra)}

## 主要ページ

- [トップページ]({site_url}/): 会社概要・サービス・代表プロフィール・実績
- [SEO/AIOメディア運営代行]({site_url}/business/media-operation/): 主力サービス詳細・料金・FAQ
- [AI・DXコンサルティング]({site_url}/business/dx-consulting/): AI活用・DX戦略支援・FAQ
- [Web・システム開発]({site_url}/business/web-development/): 開発サービス詳細
- [理念・ビジョン]({site_url}/about/philosophy.html): Mission・Vision・Value
- [会社概要]({site_url}/about/company.html): 会社情報・代表プロフィール
- [制作実績]({site_url}/works/): ポートフォリオ・Case Study
- [お知らせ・Journal]({site_url}/news/): AI・SEO・DXインサイト記事
- [お問い合わせ・無料相談]({site_url}/contact/): 8種対応の統合フォーム
- [AIO構造スコアチェッカー]({site_url}/tools/aio-check/): llms.txt無料解析ツール
- [プライバシーポリシー]({site_url}/privacy.html)
- [特定商取引法に基づく表記]({site_url}/tokushoho.html)

## 最新のお知らせ・コンテンツ

{news_lines}

## お問い合わせ

- **フォーム**：{site_url}/contact/
- **対象**：DX無料相談・SEO/AIOメディア無料診断（30分）・Web開発見積もり・取材・講演・採用依頼
"""

    return lines.strip() + "\n"


# ── Entry Point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run_analyze = "--analyze" in sys.argv

    # Load data
    config = load_yaml(CONFIG) if CONFIG.exists() else {}

    businesses_path = DATA_DIR / "businesses.yml"
    businesses_raw  = load_yaml(businesses_path) if businesses_path.exists() else []
    # businesses.yml may be a dict keyed by id, or a list
    if isinstance(businesses_raw, dict):
        businesses = [{"id": k, **v} for k, v in businesses_raw.items()]
    elif isinstance(businesses_raw, list):
        businesses = businesses_raw
    else:
        businesses = []

    news = get_recent_news(15)

    content = generate(config, businesses, news)

    if dry_run:
        print("=" * 60)
        print("DRY RUN — 生成される llms.txt:")
        print("=" * 60)
        print(content)
    else:
        LLMS_OUT.write_text(content, encoding="utf-8")
        print(f"✅ llms.txt を更新しました ({len(content)} 文字) — {LLMS_OUT}")
        print(f"   最新記事 {len(news)} 件を反映")

    if run_analyze:
        print("\n📊 AIOスコアを採点します...\n")
        analyzer_path = Path(__file__).parent / "aio_analyzer.py"
        os.execlp(sys.executable, sys.executable, str(analyzer_path), str(LLMS_OUT))
