---
# ============================================================
# Trillion Bank 記事テンプレート（_tbnews/ 用）
# このファイルは docs/ 配下のためビルド・公開されません。
# 新規記事は _tbnews/YYYY-MM-DD-slug.md として保存してください。
# URLは /trillionbank/news/<slug>/ になります。
# ============================================================

layout: tb-article-authority   # 権威記事。標準記事なら省略（tb-article）
# tech_article: true           # Article → TechArticle に切替（技術実装記事のとき）
# insight: true                # index許可時のみ。※必ず4点セットで同期すること:
                               #   1. この insight: true
                               #   2. _config.yml の robots 許可 scope
                               #   3. .github/workflows/seo-integrity.yml の approved dict
                               #   4. _data/content_guardrails.yml の public_roots
title: "【タイトル】質問形式 or 名詞句＋読者メリット（32字前後）"
date: 2026-01-01
last_modified: 2026-01-01
category: 解説                 # 解説 / 調査レポート / 技術 / AI検索対策 / プレスリリース
author: 井上 幹太
tbdesc: "メタディスクリプション。ページの内容を120字前後で。誇張・保証表現は禁止。"
keywords: "主要キーワード,関連キーワード,（5-7個）"
ai_summary: "AI向け要約。記事の結論を2-3文で。数値・固有名詞を具体的に。"
og_image: /images/hero/tb-logo-color.webp

# 結論ファースト（AEO）: 本文冒頭に「ANSWER ── 結論」ブロックとして表示される
direct_answer: "タイトルの問いへの直接回答を1-2文で。定義・数値・結論を明快に。"

# 目次: H2/H3から自動生成（3見出し以上の記事で推奨）
toc: true

# 参考文献: 一次情報のみ。URLは必ずWebFetchで実在・内容整合を確認してから記載
references:
  - title: "ソース名 — ページ名"
    url: "https://example.com/"
    accessed: 2026-01-01

# FAQ: 可視の「よくある質問」＋FAQPage構造化データとして両方に出力される（一致原則）
# 回答は40-120字で自己完結させる（AIが単体で引用できる粒度）
faq_items:
  - question: "質問1？"
    answer: "回答1。"
  - question: "質問2？"
    answer: "回答2。"
---

## 最初のH2は読者の主要な疑問に対応させる

各H2の直下は結論から書く（逆ピラミッド）。補足が必要な場合はDirect Answerブロックを挿入できる:

{% raw %}{% include tb-direct-answer.html text="このセクションの結論を1-2文で。" %}{% endraw %}

## 比較・データはMarkdownテーブルで

AIエンジンはテーブルを引用しやすい。表は必ずヘッダー行を付ける（`<thead>`として出力される）。

| 項目 | 選択肢A | 選択肢B |
|---|---|---|
| 観点1 | 値 | 値 |

## 実務チェックリスト

1. 手順は番号付きリストで
2. 1項目1アクション

## できないこと・限界

保証しないこと・観測できない範囲・不確実性を必ず明記する（編集方針）。

<!-- 執筆時の禁止事項（content_guard対象）:
  価格の記載 / 世界初・日本初・業界唯一・No.1 / 完全自動 / 必ず表示 /
  売上保証・問い合わせ保証（否定形でもトークン自体を避ける） /
  HackⅡは「限定商用検証・導入相談受付」以外のステータス表記 /
  Adctorを完成済みサービスとする表現 / 顧客名・投資家名・未公開情報
  執筆後に必ず: python3 scripts/content_guard.py -->
