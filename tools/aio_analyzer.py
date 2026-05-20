#!/usr/bin/env python3
"""
Regalis AICS™ (AI-to-Conversion Score) Analyzer v2.0
AI検索経由の成約確率を算出するRegalis独自アルゴリズム

【設計思想】
AI検索（ChatGPT / Perplexity / Google AI Overview）でサイトが引用され、
そのユーザーが問い合わせ・成約に至る確率を「4段階ファネル × 6次元」で評価する。

  Stage 1: AIが引用する（Citation）
  Stage 2: ユーザーが信頼する（Trust）
  Stage 3: ユーザーが迷わず動く（Conversion Path）
  Stage 4: エンティティとして正確に認識される（Entity Recognition）

最も弱いステージがボトルネックになるため、全ステージの底上げが重要。

Usage:
  python tools/aio_analyzer.py                      # 自サイト llms.txt を解析
  python tools/aio_analyzer.py https://example.com  # 外部サイトの llms.txt を解析
  python tools/aio_analyzer.py ./llms.txt           # ローカルファイル解析
  python tools/aio_analyzer.py --report             # JSON レポートも出力
  python tools/aio_analyzer.py --compare A.txt B.txt  # 2ファイル比較
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
    PURPLE = "\033[95m"


# ── Fetch helpers ──────────────────────────────────────────────────────────
def fetch_from_url(url: str) -> str | None:
    if not HAS_REQUESTS:
        print(f"{C.RED}Error: 'requests' が必要です。pip install requests{C.RESET}")
        return None
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    target = f"{base_url}/llms.txt"
    print(f"\n{C.CYAN}🔍 取得中: {target}{C.RESET}")
    try:
        res = requests.get(target, timeout=8, headers={"User-Agent": "Regalis-AICS-Analyzer/2.0"})
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


# ══════════════════════════════════════════════════════════════════════════
# REGALIS AICS™ ALGORITHM v2.0
# ══════════════════════════════════════════════════════════════════════════

def analyze(text: str) -> dict:
    """
    Regalis AICS™ — AI-to-Conversion Score 算出エンジン

    スコアリング軸：
      D1  AI引用確率       (25pt) — AIがこのコンテンツを引用する蓋然性
      D2  エンティティ強度  (20pt) — AIがエンティティを正確に識別できるか
      D3  成約導線         (25pt) — 引用後にユーザーが動ける設計か
      D4  信頼性・権威性    (15pt) — AIとユーザーが信頼できる根拠があるか
      D5  コンテンツ構造    (10pt) — AI・人間双方が解析しやすい構造か
      D6  鮮度・具体性      (5pt)  — 最新・具体的な情報が含まれるか

    Total: 100点
    """

    # ─────────────────────────────────────────────────────────────
    # RAW METRICS
    # ─────────────────────────────────────────────────────────────

    # 文字数
    char_count = len(text)

    # 見出し
    h1_list  = re.findall(r'^#\s+([^\n]+)', text, re.MULTILINE)
    h2_list  = re.findall(r'^##\s+([^\n]+)', text, re.MULTILINE)
    h3_list  = re.findall(r'^###\s+([^\n]+)', text, re.MULTILINE)
    h1_count = len(h1_list)
    h2_count = len(h2_list)
    h3_count = len(h3_list)

    # リスト
    list_items  = len(re.findall(r'^[-*+]\s+', text, re.MULTILINE))
    table_rows  = len(re.findall(r'^\|.+\|$', text, re.MULTILINE))
    md_links    = len(re.findall(r'\[.+?\]\(.+?\)', text))

    # ─── D1: AI引用確率パターン ──────────────────────────────────
    # 定義文「〜とは〜です/ます/なります」 — LLMが回答の根拠に最も使う
    def_sentences = len(re.findall(
        r'[^\n]{0,40}(とは|について)[^\n]{0,80}(です|ます|なります|となります|を指します|を意味します)',
        text
    ))
    # 定義見出し「〜とは」型H2/H3
    def_headings = len(re.findall(r'^#{1,3}\s+.{2,30}とは', text, re.MULTILINE))

    # Q&Aペア — AEO（音声AI・AI Overview直接回答）の核心
    qa_pairs = len(re.findall(
        r'(?:^|\n)\s*(?:\*\*)?Q[.．：:]\s*.+?\n+\s*(?:\*\*)?A[.．：:]\s*.+',
        text, re.DOTALL
    ))
    # FAQ形式の代替パターン「**Q. ...** ... **A. ...**」
    faq_bold = len(re.findall(r'\*\*Q[.．：: ].+?\*\*', text))
    total_qa = max(qa_pairs, faq_bold)

    # ファクト箇条書き「- **キー**: 値」or「- **キー**：値」
    fact_bullets = len(re.findall(r'^[-*+]\s+\*\*.+?\*\*[：:].+', text, re.MULTILINE))

    # 数値クレーム — AIが具体的回答に使う「¥98,000」「4.4倍」「1,600万円」
    numeric_claims = len(re.findall(
        r'(?:¥|￥)[\d,]+|[\d,]+(?:万円|億円|千円)|[\d.]+(?:倍|%|pt|点|名|社|件|回)',
        text
    ))

    # 断定型表現「〜です。〜ます。〜なります。」（文末断定）
    assertive = len(re.findall(r'[^\n。]{10,80}(?:です|ます|なります|となります)。', text))

    # 差別化・disambiguation シグナル
    disambiguation = len(re.findall(
        r'(?:無関係|別会社|異なります|とは異なる|混同|区別|ではありません|とは違)',
        text
    ))

    # ─── D2: エンティティ識別シグナル ───────────────────────────
    # 正式社名の出現
    legal_name_count = len(re.findall(r'(?:株式会社|Co\.,?\s*Ltd\.?|Inc\.?)', text))
    has_legal_name = bool(re.search(
        r'(?:Regalis Japan Group株式会社|レガリス(?:ジャパングループ)?株式会社)',
        text
    ))

    # 代表者フルネーム（氏名パターン）
    has_person_name = bool(re.search(
        r'(?:井上幹太|Kanta Inoue|代表(?:取締役|者)[：:\s]*\S+)',
        text
    ))

    # 住所・所在地
    has_address = bool(re.search(r'(?:〒\d{3}[-－]\d{4}|千代田|東京都|麹町)', text))

    # 設立日
    has_founding = bool(re.search(r'(?:設立|創業|founded)[：:\s]*20\d{2}', text, re.I))

    # 公式URL
    has_official_url = bool(re.search(
        r'https?://(?:www\.)?regalis-order-suits\.com',
        text
    ))

    # 業種・産業分類
    has_industry = bool(re.search(
        r'(?:IT|AI|DX|情報技術|テクノロジー|システム開発|Biz|SaaS)',
        text
    ))

    # 主力製品・サービス名
    product_names = len(re.findall(r'(?:HackⅡ|ハックツ|ハカル|ツクル|ツナグ|LLMO|AIO|AEO|GEO)', text))
    has_products = product_names >= 3

    # 別名・通称
    alt_names = len(re.findall(r'(?:RegalisJPG|レガリスジャパン|かんちゃん|通称)', text))

    # 差別化の対象が明示されているか（"〇〇とは無関係"）
    has_disambiguation = disambiguation >= 2

    # ─── D3: 成約導線シグナル ────────────────────────────────────
    # CTAの種類（多様性で評価）
    cta_free_consult = bool(re.search(r'(?:無料相談|free\s+consult)', text, re.I))
    cta_diagnosis    = bool(re.search(r'(?:無料診断|無料メディア診断|AI引用診断)', text))
    cta_contact      = bool(re.search(r'(?:お問い合わせ|contact|お申し込み)', text, re.I))
    cta_pricing      = bool(re.search(r'(?:料金|価格|見積|月額|¥[\d,]+)', text))
    cta_types = sum([cta_free_consult, cta_diagnosis, cta_contact, cta_pricing])

    # 心理的摩擦除去ワード — 問い合わせのハードルを下げる
    friction_words = re.findall(
        r'(?:無料|費用なし|費用・義務なし|義務なし|30分|ゼロ円|0円|無償|リスクなし'
        r'|まずは|気軽に|お気軽|簡単に|すぐに|今すぐ)',
        text
    )
    friction_count = len(friction_words)

    # 価格透明性 — 具体的な料金体系の明示（税込/税別まで）
    price_specific = len(re.findall(r'(?:¥|￥)[\d,]+(?:〜|~)?(?:税込|税別|税抜)?', text))
    has_price_detail = bool(re.search(r'(?:初期費用|初期契約|中途解約|契約期間)', text))

    # 社会的証明（数値つき）
    social_proof = len(re.findall(
        r'(?:[\d.]+倍|[\d,]+万円|[\d,]+社|[\d,]+件|[\d]+%|AIOスコア|成約率|実績)',
        text
    ))

    # コミットメントラダー（無料→有料の段階）
    has_ladder = bool(re.search(
        r'(?:まず.*(?:無料|相談|診断)|(?:無料|相談).*から|Starter|スターター)',
        text
    ))

    # URLつきCTA（クリックできる具体的な誘導）
    cta_links = len(re.findall(
        r'\[.*?(?:相談|診断|お申込|contact|問い合わせ|見積).*?\]\(https?://',
        text, re.I
    ))

    # ─── D4: 信頼性・権威性シグナル ─────────────────────────────
    # 受賞・実績の具体性（数値・名称つき）
    award_patterns = len(re.findall(
        r'(?:令和の虎|Tiger Funding|TOYP|ソフトバンクアカデミア'
        r'|J-StarX|経済産業省|ZEN大学|孫正義|特許出願)',
        text
    ))
    has_awards = award_patterns >= 2

    # 第三者機関・公的機関への言及
    authority_refs = len(re.findall(
        r'(?:経済産業省|J-StarX|JCI|ソフトバンク|SBI|住友商事|Vector Group'
        r'|リクルート|トグル|顧問|Advisory)',
        text
    ))

    # 特許・知財シグナル
    has_patent = bool(re.search(r'(?:特許出願|特許取得|知財|出願中)', text))

    # メディア掲載・登壇実績
    has_media = bool(re.search(r'(?:メディア掲載|登壇|取材|プレス|放送|出演)', text))

    # 連絡先の充実度
    contact_score = 0
    if re.search(r'https?://\S+/contact', text): contact_score += 2
    if re.search(r'(?:フォーム|form)', text, re.I): contact_score += 1
    if re.search(r'(?:代表が直接|direct)', text, re.I): contact_score += 2

    # ─── D5: コンテンツ構造 ──────────────────────────────────────
    # （構造は補助的評価。見出し・リスト・テーブルの適切な使用）

    # ─── D6: 鮮度・具体性 ───────────────────────────────────────
    current_years = len(re.findall(r'202[5-9]|203\d', text))
    specific_results = len(re.findall(
        r'[\d.]+(?:倍|%|万円|億円)(?:の実績|を達成|を獲得|以上|超)',
        text
    ))
    has_update_date = bool(re.search(r'(?:最終更新|更新日|last.updated)[：:\s]*20\d{2}', text, re.I))

    # ─────────────────────────────────────────────────────────────
    # SCORING
    # ─────────────────────────────────────────────────────────────

    # ── D1: AI引用確率 (25pt) ────────────────────────────────────
    d1 = 0
    # 定義文（最重要 — LLMへの直接データ供給）
    if def_sentences >= 8:   d1 += 8
    elif def_sentences >= 5: d1 += 6
    elif def_sentences >= 3: d1 += 4
    elif def_sentences >= 1: d1 += 2
    # 定義型見出し
    if def_headings >= 3:    d1 += 2
    elif def_headings >= 1:  d1 += 1
    # Q&Aペア（AEO対応）
    if total_qa >= 5:        d1 += 6
    elif total_qa >= 3:      d1 += 4
    elif total_qa >= 1:      d1 += 2
    # ファクト箇条書き
    if fact_bullets >= 10:   d1 += 4
    elif fact_bullets >= 5:  d1 += 3
    elif fact_bullets >= 2:  d1 += 1
    # 数値クレーム
    if numeric_claims >= 10: d1 += 3
    elif numeric_claims >= 5: d1 += 2
    elif numeric_claims >= 2: d1 += 1
    # 差別化シグナル（エンティティ精度向上）
    if disambiguation >= 5:  d1 += 2
    elif disambiguation >= 2: d1 += 1
    d1 = min(d1, 25)

    # ── D2: エンティティ強度 (20pt) ──────────────────────────────
    d2 = 0
    if has_legal_name:     d2 += 3   # 正式社名
    if has_person_name:    d2 += 3   # 代表者フルネーム
    if has_address:        d2 += 2   # 所在地
    if has_founding:       d2 += 2   # 設立日
    if has_official_url:   d2 += 2   # 公式URL
    if has_industry:       d2 += 1   # 業種
    if has_products:       d2 += 3   # 主力製品名（3個以上）
    if alt_names >= 2:     d2 += 2   # 別名・通称
    elif alt_names >= 1:   d2 += 1
    if has_disambiguation: d2 += 2   # 差別化明示（混同防止）
    d2 = min(d2, 20)

    # ── D3: 成約導線 (25pt) ──────────────────────────────────────
    d3 = 0
    # CTA多様性（種類が多いほど高得点）
    if cta_types >= 4:     d3 += 8
    elif cta_types == 3:   d3 += 6
    elif cta_types == 2:   d3 += 4
    elif cta_types == 1:   d3 += 2
    # 摩擦除去ワード
    if friction_count >= 5: d3 += 5
    elif friction_count >= 3: d3 += 3
    elif friction_count >= 1: d3 += 1
    # 価格透明性
    if price_specific >= 4 and has_price_detail: d3 += 5
    elif price_specific >= 2:                     d3 += 3
    elif price_specific >= 1:                     d3 += 1
    # 社会的証明（数値つき）
    if social_proof >= 5:   d3 += 4
    elif social_proof >= 3:  d3 += 3
    elif social_proof >= 1:  d3 += 1
    # コミットメントラダー
    if has_ladder:           d3 += 2
    # URLつきCTA
    if cta_links >= 3:       d3 += 1
    d3 = min(d3, 25)

    # ── D4: 信頼性・権威性 (15pt) ─────────────────────────────────
    d4 = 0
    if has_awards:           d4 += 4   # 受賞・実績（具体名あり）
    if authority_refs >= 3:  d4 += 3   # 第三者機関への言及
    elif authority_refs >= 1: d4 += 2
    if has_patent:           d4 += 2   # 特許・知財
    if has_media:            d4 += 1   # メディア掲載
    d4 += min(contact_score, 5)        # 連絡先充実度
    d4 = min(d4, 15)

    # ── D5: コンテンツ構造 (10pt) ─────────────────────────────────
    d5 = 0
    # H1は必ず1つ
    if h1_count == 1:        d5 += 4
    elif h1_count > 1:       d5 += 1
    # H2セクション
    if h2_count >= 6:        d5 += 3
    elif h2_count >= 4:      d5 += 2
    elif h2_count >= 2:      d5 += 1
    # リスト密度
    if list_items >= 20:     d5 += 2
    elif list_items >= 10:   d5 += 1
    # テーブル（比較表はAI引用効率が高い）
    if table_rows >= 4:      d5 += 1
    d5 = min(d5, 10)

    # ── D6: 鮮度・具体性 (5pt) ────────────────────────────────────
    d6 = 0
    if current_years >= 3:   d6 += 2
    elif current_years >= 1: d6 += 1
    if specific_results >= 3: d6 += 2
    elif specific_results >= 1: d6 += 1
    if has_update_date:      d6 += 1
    d6 = min(d6, 5)

    total = d1 + d2 + d3 + d4 + d5 + d6

    # ─────────────────────────────────────────────────────────────
    # FUNNEL STAGE SCORES (成約ファネル段階別スコア)
    # ─────────────────────────────────────────────────────────────
    # ファネルを4段階で評価（各100点換算）
    stage_citation   = round((d1 / 25) * 100)                      # AIが引用する確率
    stage_trust      = round(((d2 + d4) / 35) * 100)               # ユーザーが信頼する確率
    stage_conversion = round((d3 / 25) * 100)                      # 問い合わせに至る確率
    stage_structure  = round(((d5 + d6) / 15) * 100)               # AI・人間が理解できる確率

    # ボトルネック検出 — 最も低いステージが全体の上限になる（鎖の論理）
    bottleneck_score = min(stage_citation, stage_trust, stage_conversion, stage_structure)

    # ─────────────────────────────────────────────────────────────
    # FEEDBACK GENERATION
    # ─────────────────────────────────────────────────────────────
    warnings   = []
    positives  = []
    quick_wins = []  # すぐ実装できる改善提案

    # D1フィードバック
    if def_sentences < 3:
        warnings.append("定義文（〜とは〜です）が少ない。LLMは定義文を最優先で引用します。")
        quick_wins.append('冒頭H2に「〇〇とは — **〇〇は△△を提供するサービスです。**」を追加する')
    else:
        positives.append(f"定義文が{def_sentences}件あり、AI引用の核心データが充実しています。")

    if total_qa < 3:
        warnings.append(f"Q&Aペアが{total_qa}件のみ。FAQ形式はGoogle AI Overview・Perplexityの直接回答源です。")
        quick_wins.append("「よくある質問」セクションにQ:〜 A:〜 形式で5件以上追加する")
    else:
        positives.append(f"Q&Aペア{total_qa}件を確認。AEO・音声AI検索に対応しています。")

    if numeric_claims < 5:
        warnings.append("数値クレームが少ない。AIは「¥98,000」「4.4倍」など具体的数値を根拠として引用します。")
    else:
        positives.append(f"数値クレーム{numeric_claims}件あり。AI回答の説得力が高い。")

    # D2フィードバック
    if not has_legal_name:
        warnings.append("正式社名（株式会社）の表記がない。Knowledge Graph登録に必須です。")
    if not has_person_name:
        warnings.append("代表者フルネームがない。エンティティとして人物との紐付けができません。")
    if not has_disambiguation:
        warnings.append("差別化シグナル（〜とは無関係）が不足。同名他社との混同でAIが誤引用するリスクがあります。")
        quick_wins.append('「〇〇とは無関係の別会社です」という明確な差別化文を追加する')
    else:
        positives.append(f"差別化シグナル{disambiguation}件あり。エンティティ混同リスクを低減しています。")

    # D3フィードバック
    if cta_types < 2:
        warnings.append("CTA種類が少ない。無料相談・診断・問い合わせ・料金の4種を揃えると成約率が上がります。")
        quick_wins.append("「30分の無料AI引用診断を申し込む」リンク付きCTAを末尾に追加する")
    else:
        positives.append(f"CTA{cta_types}種類を確認。AI経由ユーザーの受け皿が整っています。")

    if friction_count < 3:
        warnings.append("摩擦除去ワードが少ない。「無料」「30分」「義務なし」を増やすと問い合わせハードルが下がります。")
    else:
        positives.append(f"摩擦除去ワード{friction_count}件あり。問い合わせの心理的ハードルを適切に下げています。")

    if price_specific < 2:
        warnings.append("具体的な料金の記載が不足。AIは「月額¥9,800〜」のような具体的価格を回答の根拠にします。")
    else:
        positives.append(f"具体的な価格情報{price_specific}件あり。AI検索ユーザーが意思決定しやすい状態です。")

    # D4フィードバック
    if not has_awards:
        warnings.append("受賞・実績の具体的な記載がない。第三者評価がないと信頼シグナルとして弱いです。")
    else:
        positives.append(f"受賞・実績シグナル{award_patterns}件あり。AIとユーザー双方への信頼性を高めています。")

    if not has_patent:
        warnings.append("特許・知財への言及がない。技術的優位性をAIに伝える機会が失われています。")

    # D5フィードバック
    if h1_count != 1:
        warnings.append(f"H1見出しが{h1_count}個（理想は1個）。AIは最初のH1をページの主題として認識します。")
    if table_rows < 4:
        warnings.append("比較テーブルが少ない。テーブル形式はAIが構造化データとして最も効率よく抽出します。")
        quick_wins.append("競合比較表・料金プラン表・機能比較表をテーブル形式で追加する")

    # D6フィードバック
    if not has_update_date:
        warnings.append("更新日の記載がない。「最終更新: 2026-05-21」を追加するとAIが情報の鮮度を判断できます。")
        quick_wins.append("冒頭または末尾に「最終更新: YYYY-MM-DD」を追加する")

    # ボトルネック警告
    if bottleneck_score < 50:
        min_stage = min(
            (stage_citation, "AI引用確率"),
            (stage_trust, "信頼性・エンティティ"),
            (stage_conversion, "成約導線"),
            (stage_structure, "コンテンツ構造"),
            key=lambda x: x[0]
        )
        warnings.insert(0, f"⚡ ボトルネック検出: 「{min_stage[1]}」({min_stage[0]}点/100)が最弱リンクです。ここを優先改善することで全体成約率が最も改善します。")

    return {
        "score": total,
        "algorithm": "Regalis AICS™ v2.0",
        "funnel_stages": {
            "ai_citation":   {"name": "AI引用確率",         "score": stage_citation,   "desc": "AIがこのコンテンツを引用する蓋然性"},
            "trust":         {"name": "信頼性・エンティティ", "score": stage_trust,      "desc": "AIとユーザーが信頼できる根拠があるか"},
            "conversion":    {"name": "成約導線",            "score": stage_conversion, "desc": "引用後にユーザーが動ける設計か"},
            "structure":     {"name": "コンテンツ構造",      "score": stage_structure,  "desc": "AI・人間双方が解析しやすい構造か"},
        },
        "bottleneck_score": bottleneck_score,
        "categories": {
            "d1_citation":  {"name": "AI引用確率",     "score": d1, "max": 25},
            "d2_entity":    {"name": "エンティティ強度", "score": d2, "max": 20},
            "d3_conversion":{"name": "成約導線",        "score": d3, "max": 25},
            "d4_trust":     {"name": "信頼性・権威性",  "score": d4, "max": 15},
            "d5_structure": {"name": "コンテンツ構造",  "score": d5, "max": 10},
            "d6_freshness": {"name": "鮮度・具体性",    "score": d6, "max":  5},
        },
        "metrics": {
            "char_count": char_count,
            "h1_count": h1_count, "h2_count": h2_count, "h3_count": h3_count,
            "list_items": list_items, "table_rows": table_rows, "md_links": md_links,
            "def_sentences": def_sentences, "def_headings": def_headings,
            "qa_pairs": total_qa, "fact_bullets": fact_bullets,
            "numeric_claims": numeric_claims, "disambiguation": disambiguation,
            "cta_types": cta_types, "friction_count": friction_count,
            "price_specific": price_specific, "social_proof": social_proof,
            "award_patterns": award_patterns, "authority_refs": authority_refs,
        },
        "signals": {
            "has_legal_name": has_legal_name, "has_person_name": has_person_name,
            "has_address": has_address, "has_founding": has_founding,
            "has_official_url": has_official_url, "has_products": has_products,
            "has_disambiguation": has_disambiguation, "has_awards": has_awards,
            "has_patent": has_patent, "has_ladder": has_ladder,
            "has_price_detail": has_price_detail, "has_update_date": has_update_date,
        },
        "warnings":   warnings,
        "positives":  positives,
        "quick_wins": quick_wins,
    }


# ── Grade ──────────────────────────────────────────────────────────────────
def get_grade(score: int) -> tuple[str, str]:
    if score >= 90: return "Elite    ★★★★★  AI検索→成約の最適設計", C.CYAN
    if score >= 75: return "Strong   ★★★★☆  AI引用・成約導線が機能", C.GREEN
    if score >= 55: return "Average  ★★★☆☆  改善余地あり",           C.YELLOW
    if score >= 35: return "Weak     ★★☆☆☆  重要シグナルが欠落",     C.RED
    return                  "Critical ★☆☆☆☆  AI検索で機能しない状態", C.RED


def bar(score: int, max_score: int, width: int = 16) -> str:
    filled = int((score / max_score) * width) if max_score > 0 else 0
    return "█" * filled + "░" * (width - filled)


def stage_bar(score: int, width: int = 20) -> str:
    filled = int((score / 100) * width)
    return "█" * filled + "░" * (width - filled)


# ── Report ─────────────────────────────────────────────────────────────────
def print_report(result: dict, source_label: str = ""):
    score = result["score"]
    grade_label, grade_color = get_grade(score)

    print(f"\n{C.WHITE}{'═'*62}{C.RESET}")
    print(f"{C.BOLD}{C.WHITE}  Regalis AICS™ — AI-to-Conversion Score Analyzer v2.0{C.RESET}")
    if source_label:
        print(f"{C.GRAY}  解析対象 : {source_label}{C.RESET}")
    print(f"{C.GRAY}  実行日時 : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{C.RESET}")
    print(f"{C.WHITE}{'═'*62}{C.RESET}")

    # ── メインスコア ────────────────────────────────────────────
    print(f"\n{C.BOLD}📊 AIO構造スコア: {grade_color}{score}{C.RESET}{C.BOLD} / 100点{C.RESET}")
    print(f"  グレード: {grade_color}{grade_label}{C.RESET}")
    print(f"  {grade_color}{'█' * int(score / 5)}{'░' * (20 - int(score / 5))}{C.RESET}  {score}%")

    # ── ファネル段階スコア（成約ファネル視点） ──────────────────
    print(f"\n{C.BOLD}🔄 AI→成約 ファネル段階スコア{C.RESET}  ← ボトルネックを特定")
    funnel = result["funnel_stages"]
    for key, stage in funnel.items():
        s = stage["score"]
        color = C.GREEN if s >= 75 else C.YELLOW if s >= 50 else C.RED
        b = stage_bar(s, 20)
        label = stage["name"]
        print(f"  {label:<16} {color}{b}{C.RESET}  {color}{s:>3}/100{C.RESET}")

    bn = result["bottleneck_score"]
    bn_color = C.GREEN if bn >= 75 else C.YELLOW if bn >= 50 else C.RED
    print(f"\n  {C.BOLD}⚡ ボトルネックスコア: {bn_color}{bn}/100{C.RESET}  ← 最弱リンクが成約率を決定")

    # ── 次元別スコア ────────────────────────────────────────────
    print(f"\n{C.BOLD}📋 次元別スコア:{C.RESET}")
    for cat in result["categories"].values():
        s, m = cat["score"], cat["max"]
        color = C.GREEN if s >= m * 0.8 else C.YELLOW if s >= m * 0.5 else C.RED
        b = bar(s, m, 16)
        print(f"  {cat['name']:<14} {color}{b}{C.RESET}  {color}{s:>2}/{m}{C.RESET}")

    # ── 生メトリクス ─────────────────────────────────────────────
    m = result["metrics"]
    print(f"\n{C.BOLD}🔬 検出メトリクス:{C.RESET}")
    pairs = [
        ("文字数",       f"{m['char_count']:,}文字"),
        ("定義文(とは~)",  f"{m['def_sentences']}件"),
        ("Q&Aペア",       f"{m['qa_pairs']}件"),
        ("ファクト箇条書き", f"{m['fact_bullets']}件"),
        ("数値クレーム",    f"{m['numeric_claims']}件"),
        ("差別化シグナル",  f"{m['disambiguation']}件"),
        ("CTA種類",        f"{m['cta_types']}/4種"),
        ("摩擦除去ワード",  f"{m['friction_count']}件"),
        ("具体的料金記載",  f"{m['price_specific']}件"),
        ("社会的証明数値",  f"{m['social_proof']}件"),
        ("受賞・実績",     f"{m['award_patterns']}件"),
        ("テーブル行数",   f"{m['table_rows']}行"),
    ]
    for i in range(0, len(pairs), 2):
        left  = pairs[i]
        right = pairs[i+1] if i+1 < len(pairs) else ("", "")
        print(f"  {C.GRAY}{left[0]:<14}{left[1]:<12}{right[0]:<14}{right[1]}{C.RESET}")

    # ── シグナルチェック ─────────────────────────────────────────
    sigs = result["signals"]
    sig_display = [
        ("正式社名", "has_legal_name"), ("代表者名", "has_person_name"),
        ("所在地",   "has_address"),    ("設立日",   "has_founding"),
        ("公式URL",  "has_official_url"),("主力製品名","has_products"),
        ("差別化明示","has_disambiguation"),("受賞実績","has_awards"),
        ("特許",     "has_patent"),     ("コミットラダー","has_ladder"),
        ("料金詳細", "has_price_detail"),("更新日",  "has_update_date"),
    ]
    print(f"\n{C.BOLD}✔ エンティティ・成約シグナル:{C.RESET}")
    for i in range(0, len(sig_display), 3):
        row = sig_display[i:i+3]
        line = ""
        for label, key in row:
            val = sigs.get(key, False)
            icon = f"{C.GREEN}✓{C.RESET}" if val else f"{C.RED}✗{C.RESET}"
            line += f"  {icon} {C.GRAY}{label:<10}{C.RESET}"
        print(line)

    # ── 改善アドバイス ───────────────────────────────────────────
    if result["warnings"]:
        print(f"\n{C.BOLD}⚠️  改善アドバイス ({len(result['warnings'])}件):{C.RESET}")
        for w in result["warnings"]:
            print(f"  {C.YELLOW}• {w}{C.RESET}")

    if result["positives"]:
        print(f"\n{C.BOLD}✅ 良好な点:{C.RESET}")
        for p in result["positives"]:
            print(f"  {C.GREEN}• {p}{C.RESET}")

    if result["quick_wins"]:
        print(f"\n{C.BOLD}🚀 クイックウィン（今すぐできる改善）:{C.RESET}")
        for i, qw in enumerate(result["quick_wins"], 1):
            print(f"  {C.PURPLE}{i}. {qw}{C.RESET}")

    print(f"\n{C.WHITE}{'═'*62}{C.RESET}\n")


# ── Compare mode ───────────────────────────────────────────────────────────
def print_compare(text_a: str, label_a: str, text_b: str, label_b: str):
    ra = analyze(text_a)
    rb = analyze(text_b)
    sa, sb = ra["score"], rb["score"]
    diff = sb - sa

    print(f"\n{C.WHITE}{'═'*62}{C.RESET}")
    print(f"{C.BOLD}{C.WHITE}  Regalis AICS™ — 競合比較モード{C.RESET}")
    print(f"{C.WHITE}{'═'*62}{C.RESET}")
    print(f"\n  {'項目':<18}  {C.CYAN}{label_a[:18]:<20}{C.RESET}  {C.YELLOW}{label_b[:18]}{C.RESET}")
    print(f"  {'─'*60}")
    print(f"  {'総合スコア':<18}  {C.CYAN}{sa:>4}/100{C.RESET}               {C.YELLOW}{sb:>4}/100{C.RESET}  {'↑'+str(diff) if diff>0 else ('↓'+str(abs(diff)) if diff<0 else '→')}")

    cats = list(ra["categories"].items())
    for key, cat_a in cats:
        cat_b = rb["categories"][key]
        sa2, sb2 = cat_a["score"], cat_b["score"]
        d = sb2 - sa2
        arrow = f"{C.GREEN}↑{d}{C.RESET}" if d > 0 else (f"{C.RED}↓{abs(d)}{C.RESET}" if d < 0 else "→")
        print(f"  {cat_a['name']:<18}  {C.CYAN}{sa2:>4}/{cat_a['max']}{C.RESET}               {C.YELLOW}{sb2:>4}/{cat_b['max']}{C.RESET}  {arrow}")

    print(f"\n  ファネルスコア比較:")
    for key, stage_a in ra["funnel_stages"].items():
        stage_b = rb["funnel_stages"][key]
        sa3, sb3 = stage_a["score"], stage_b["score"]
        d = sb3 - sa3
        color_a = C.GREEN if sa3 >= 75 else C.YELLOW if sa3 >= 50 else C.RED
        color_b = C.GREEN if sb3 >= 75 else C.YELLOW if sb3 >= 50 else C.RED
        arrow = f"{C.GREEN}↑{d}{C.RESET}" if d > 0 else (f"{C.RED}↓{abs(d)}{C.RESET}" if d < 0 else "→")
        print(f"  {stage_a['name']:<18}  {color_a}{sa3:>4}/100{C.RESET}               {color_b}{sb3:>4}/100{C.RESET}  {arrow}")
    print(f"\n{C.WHITE}{'═'*62}{C.RESET}\n")


# ── Entry Point ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    args  = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = [a for a in sys.argv[1:] if a.startswith('--')]
    save_report = '--report' in flags
    compare_mode = '--compare' in flags

    # 比較モード
    if compare_mode and len(args) >= 2:
        text_a = (fetch_from_url(args[0]) if args[0].startswith('http') else fetch_from_file(args[0]))
        text_b = (fetch_from_url(args[1]) if args[1].startswith('http') else fetch_from_file(args[1]))
        if text_a and text_b:
            print_compare(text_a, args[0], text_b, args[1])
        sys.exit(0)

    # 通常モード
    if not args:
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
