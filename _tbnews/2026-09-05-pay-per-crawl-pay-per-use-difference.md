---
layout: tb-article-authority
title: Pay per CrawlとPay per Useの違い｜AIによる情報利用をどう契約・記録するか
tbdesc: Pay per Crawlは取得時の課金、Pay per UseはAPI・RAG・MCP・回答利用などを含む広い考え方です。アクセス制御、契約、利用証跡、請求の役割を整理します。
date: 2026-09-05
last_modified: 2026-09-06
category: AIデータ権利
insight: true
toc: true
tech_article: true
cta_type: adctor
author: 井上 幹太
reviewed_by: 株式会社Trillion Bank 編集部
references:
  - title: Cloudflare - What is Pay Per Crawl?
    url: https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/
    accessed: 2026-09-05
  - title: Really Simple Licensing - RSL Standard
    url: https://rslstandard.org/
    accessed: 2026-09-05
faq_items:
  - question: Pay per Crawlとは何ですか？
    answer: AIクローラーがWebコンテンツを取得する際に、サイト側が価格や支払い条件を提示し、支払い確認後に取得を許可する考え方です。
  - question: Pay per Useとの違いは何ですか？
    answer: Pay per Useは取得だけでなく、API呼び出し、RAG検索、MCPツール、表示、引用など、契約で定めた利用単位を対象にする広い考え方です。
  - question: すべてのAI企業から自動的に料金を取れますか？
    answer: いいえ。相手の参加、認証、契約、支払い手段、利用証跡が必要で、未知のボットや外部AIの全利用を把握できるわけではありません。
---

## 結論

Pay per Crawlは、AIクローラーがWebコンテンツを取得するときに価格や支払い条件を提示するモデルです。Pay per Useは、取得だけでなくAPI、RAG、MCPツール、表示、引用など、**契約で定めた利用イベントを記録・請求する広い考え方**です。

両者とも、料金表示だけでは成立しません。誰が利用したか、どのデータか、何の用途か、どの契約版が適用されたか、重複していないかを確認できる必要があります。

## 役割の違い

| 項目 | Pay per Crawl | Pay per Use |
|---|---|---|
| 主な単位 | Webページ等の取得 | crawl、API、RAG、MCP、表示、引用等 |
| 制御地点 | CDN、WAF、エッジ、サイト入口 | API、アプリ、RAG、MCP、配信基盤等 |
| 必要な証拠 | 認証、支払い、正常提供 | 利用者、Resource、用途、契約、イベント、請求 |
| 強み | 入口で分かりやすく制御できる | 実際の価値・用途に近い契約を設計できる |
| 難しさ | 非協調ボット、価格、参加者不足 | 利用報告、標準化、監査、複数システムの照合 |

## CloudflareのPay per Crawl

Cloudflareの公開ドキュメントでは、サイト所有者がAIクローラーに対し、無料、ブロック、有料という方針を設定し、支払いに応じてコンテンツを提供する仕組みを説明しています。これはエッジでのアクセスと決済を扱う重要な基盤です。

一方、企業間の個別契約、用途制限、データ版、削除義務、RAGやMCPでの再利用、監査資料までを一つの仕組みで管理するには、別の業務設計が必要です。

## 機械可読な利用条件

RSLは、コンテンツの利用条件を機械が読める形で示すための標準です。条件を表現する標準と、実際の契約、認証、利用イベント、請求を運用するシステムは役割が異なります。

## 成立に必要な7要素

1. **Resource** - 対象となる記事、データ、API、MCPツール等。
2. **Rights holder** - 誰が許諾できるか。
3. **Buyer identity** - 誰が利用するか。
4. **License** - 用途、期間、地域、再利用、削除等の条件。
5. **Credential** - APIキー、署名、OAuth等の認証。
6. **Usage event** - いつ、何を、何の目的で使ったか。
7. **Billing evidence** - 請求対象、重複排除、調整、支払いの記録。

## 最初から行わない方がよいこと

- 未知のボットをすべて識別できる前提にする
- 外部AIのすべての引用を自動請求する
- 1アクセスの小額決済だけで採算を作る
- 権利者と利用者がいない状態で総合市場を作る
- 決済手段だけを競争優位とする

まずは、権利者、利用者、対象データ、契約条件が明確な1件で、認証、利用記録、月次請求の成立性を検証します。

## Adctorの現在地

Adctorは、AI・RAG・MCP・Agentによるコンテンツ利用を、契約、認証、利用証跡、将来の請求へ接続するための研究開発・PoCプログラムです。完成済みの決済・徴収・分配ネットワークではありません。技術・契約・運用が成立する限定範囲から検証します。
