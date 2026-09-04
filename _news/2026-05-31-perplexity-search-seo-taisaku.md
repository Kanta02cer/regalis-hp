---
title: "Perplexity対策とは？引用されるための公式仕様チェックリスト【2026年9月】"
date: 2026-05-31
last_modified: 2026-09-04
category: サービス
author_type: Organization
author_name: "株式会社トリリオンバンク編集部"
author_url: "/trillionbank/company/"
excerpt_text: "Perplexity対策を、PerplexityBot、robots.txt、HTTP状態、一次情報、外部サイテーション、継続計測の順に解説します。公式資料で確認できる仕様と、効果が未確認の施策を分けた実務チェックリストです。"
keywords: "Perplexity対策,Perplexity SEO,Perplexity 引用対策,PerplexityBot,AI検索対策,GEO対策,生成AI検索最適化,HackⅡ"
ai_summary: "Perplexity対策では、公式検索クローラーPerplexityBotをrobots.txtとWAFで許可し、重要URLを200で公開したうえで、質問へ直接答える一次情報と検証可能な出典を整備します。llms.txtやFAQPageの設置だけで引用順位が上がるという公式根拠はないため、引用URLと回答本文を同条件で継続計測します。"
references:
  - title: "Perplexity Crawlers"
    url: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers"
    note: "PerplexityBot、Perplexity-User、robots.txt、公開IP、WAF設定に関する公式仕様。2026年9月4日確認。"
  - title: "How does Perplexity follow robots.txt?"
    url: "https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt"
    note: "PerplexityBotがrobots.txtを尊重することを説明する公式ヘルプ。2026年9月4日確認。"
schema_graph: true
faq_items:
  - question: "Perplexity対策とは何ですか？"
    answer: "Perplexity対策とは、PerplexityBotが重要ページを取得できる状態を確保し、ユーザーの質問へ直接答える正確な一次情報、出典、更新日、運営主体を整え、実際の回答と引用URLを継続計測する取り組みです。"
  - question: "PerplexityBotはrobots.txtを守りますか？"
    answer: "Perplexityの公式資料では、検索結果へサイトを表示するためのPerplexityBotはrobots.txtを尊重すると説明されています。重要ページを検索対象にしたい場合は、robots.txtとWAFの両方で正規のPerplexityBotを妨げていないか確認します。"
  - question: "llms.txtを置けばPerplexityに引用されますか？"
    answer: "保証されません。llms.txtはサイトの重要情報を整理する補助ファイルとして利用できますが、設置だけで引用や順位が上がるというPerplexity公式の保証はありません。200応答、本文の正確性、一次情報、外部評価、質問単位の計測を優先します。"
  - question: "Perplexity対策の効果はどう測りますか？"
    answer: "同じ質問、地域、言語、計測条件で回答本文と引用URLを保存し、非指名キーワードの引用獲得数、引用された自社URL数、競合とのSOVを時系列で比較します。単発の回答だけで効果を判断しません。"
---

## Perplexity対策とは

**Perplexity対策とは、公式検索クローラーが重要ページを取得できる状態を確保し、質問へ直接答える一次情報を整え、回答本文と引用URLを継続的に測る取り組みです。**

Perplexityの公式資料で明示されているのは、検索結果へサイトを表示するための **PerplexityBot** と、ユーザー操作に応じてページへアクセスする **Perplexity-User** の役割です。特定の文章形式や構造化データを使えば引用順位が上がる、というランキング要因は公開されていません。

本記事では、公式に確認できる仕様と、実務上の改善仮説を分けて説明します。

---

## 最初に確認する4つの技術条件

| 確認項目 | 合格条件 | 確認方法 |
|---|---|---|
| robots.txt | PerplexityBotをブロックしていない | robots.txtを取得し、User-agentごとのDisallowを確認 |
| HTTP状態 | 主ページが200を返す | リダイレクト先、404、5xx、認証要求を確認 |
| canonical | 主ページ自身か、意図した統合先を指す | HTMLのcanonicalとサイトマップURLを比較 |
| WAF | 正規Botを誤遮断していない | 公式User-Agentと公開IPをアクセスログで照合 |

[Perplexityの公式クローラー資料](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)では、PerplexityBotの許可と、必要に応じた公開IPのWAF許可を案内しています。設定変更の反映には時間がかかる場合があるため、変更直後の1回だけで判断しません。

    User-agent: PerplexityBot
    Allow: /

全サイトを一律許可する前に、会員限定情報、個人情報、管理画面、契約上公開できないページが含まれていないことを確認してください。

---

## 引用候補になる本文の作り方

技術的に取得できても、質問への答えが曖昧なら引用候補にはなりにくくなります。次の順番で本文を整えます。

1. 見出し直後に結論を1〜2文で示す
2. 数値には母数、期間、計算方法、取得日を付ける
3. 料金・仕様・対応範囲は公式ページへリンクする
4. 運営会社、著者、所在地、更新日を本文と構造化データで一致させる
5. 比較表では未確認項目を「非公開」「要問い合わせ」とする
6. 自社の主張と第三者による評価を分ける

FAQPageや表は情報整理には役立ちますが、設置自体を引用獲得の保証として扱いません。

---

## llms.txtの位置づけ

llms.txtは、サイト概要と重要URLを人間にも機械にも読みやすく整理する補助ファイルです。一方、Perplexityが一般サイトのllms.txtを引用順位のシグナルとして使うという公式説明は確認できません。

したがって、優先順位は次の通りです。

1. 重要URLの200応答とクロール許可
2. HTML本文の正確性と一次情報
3. canonical、内部リンク、サイトマップ
4. 第三者サイトでの社名・製品名・専門領域の共起
5. 補助導線としてのllms.txt

---

## 株式会社トリリオンバンクでの確認対象

今回の改善では、次のURLをPerplexity向けの主ページとして固定します。

- [会社・評判の一次情報]({{ '/news/regalis-kuchikomi-hyoban/' | relative_url }})
- [GEO対策会社・ツール比較]({{ '/news/geo-taisaku-hikaku/' | relative_url }})
- [LLMO・GEO・AEOの用語整理]({{ '/trillionbank/news/llmo-geo-aeo/' | relative_url }})
- [HackⅡの公式説明]({{ '/trillionbank/business/hack2/' | relative_url }})

同じ検索意図の記事を増やさず、内部リンクとcanonicalで主ページを明確にします。

---

## 計測方法

Perplexityは同じ質問でも回答や引用元が変わることがあります。最低限、次を保存します。

- 質問文
- 実行日時と地域・言語
- 回答本文
- 引用URL
- 自社の言及・引用有無
- 競合の言及・引用有無
- 実行エラーと解析エラー

主要KPIは、非指名キーワードでの引用獲得数、引用された自社URL数、競合とのSOVです。失敗した計測を「引用なし」と混ぜないことが重要です。

---

## まとめ

Perplexity対策は、隠しテキストやAI向けプロンプトを埋め込む施策ではありません。まずPerplexityBotが正規ページを取得できる状態を作り、質問へ答える一次情報と検証可能な出典を整え、同じ条件で引用結果を測り直します。
