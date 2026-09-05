---
title: "RAG・MCPで使うデータの権利と利用証跡｜企業AI導入で確認すべきこと"
date: 2026-09-05
last_modified: 2026-09-05
category: 調査・解説
author: 井上 幹太
permalink: /trillionbank/news/rag-mcp-data-rights-evidence/
tbdesc: "企業がRAGやMCPで外部・社内データを使う際に、権利者、利用目的、契約、版、認証、利用ログ、削除、請求をどう管理すべきかを解説します。"
keywords: "RAG データ権利,RAG 利用証跡,MCP データガバナンス,AI Data BOM,AI利用ログ 監査,生成AI 契約管理,AIデータライセンス,Adctor"
ai_summary: "RAG・MCPのデータ管理では、アクセスログだけでなく、Resource、権利者、契約、許可用途、版、利用主体、利用イベント、削除・失効を結び付ける必要がある。外部AIの全利用を観測できるとは限らないため、認証済み・署名済み証跡を優先する。"
faq_items:
  - question: "RAGで使うデータは、公開Web情報なら自由に使えますか？"
    answer: "公開されていることと、学習、保存、再配布、商用RAG等の利用が許可されていることは同じではありません。契約、利用規約、著作権、個人情報、機密性、対象地域等を確認します。"
  - question: "アクセスログがあればAI利用を監査できますか？"
    answer: "アクセスログだけでは、権利者、契約版、利用目的、回答への利用、削除義務等を十分に説明できない場合があります。Resource、License、Identity、Usage Eventを結び付けます。"
  - question: "MCPツールの利用はどの単位で記録しますか？"
    answer: "利用主体、ツール名・版、入力Resource、実行日時、目的、結果、契約・権限、関連する請求単位を記録します。機密情報や個人情報を必要以上にログへ残さない設計も必要です。"
references:
  - title: "Model Context Protocol - Server concepts"
    url: "https://modelcontextprotocol.io/docs/learn/server-concepts"
  - title: "NIST AI 600-1 - Generative Artificial Intelligence Profile"
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
  - title: "CycloneDX - Machine Learning Bill of Materials"
    url: "https://cyclonedx.org/capabilities/mlbom/"
  - title: "Really Simple Licensing (RSL)"
    url: "https://rslstandard.org/"
  - title: "Cloudflare - What is Pay Per Crawl?"
    url: "https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/"
---

**企業がRAGやMCPでデータを使うときは、「取得できたか」だけでなく、「誰のデータを、どの契約で、何の目的に、どの版で、誰が使い、いつ失効・削除するか」を結び付けて管理します。** アクセスログだけでは、顧客・法務・監査部門へ正規利用を十分に説明できない場合があります。

## RAG・MCPで権利管理が必要になる理由

企業AIでは、社内文書、顧客データ、マニュアル、契約書、専門データベース、外部API、Web情報等を組み合わせます。利用経路が増えると、次の質問へ即答しにくくなります。

- データの権利者は誰か
- 学習、検索、要約、表示、再配布のどこまで許可されているか
- 契約期間と対象ユーザーは何か
- 最新版が使われているか
- どのAI・Agent・MCPツールが使ったか
- 契約終了後に停止・削除できるか
- 利用量と請求が一致しているか

この説明責任を、後から人手で集めるのではなく、導入時から設計する必要があります。

## まず5つの台帳を分ける

### 1. Resource

利用対象となる情報資産です。

- 文書、記事、画像、問題・解説
- データセット
- API
- MCPツール
- RAGコーパス
- 商品・部品・施設情報

Resource ID、権利者、版、更新日、Fingerprint、機密区分、保存場所を記録します。

### 2. License / Contract

誰が、何を、どの条件で使えるかを定めます。

| 条件 | 例 |
|---|---|
| 許可用途 | 社内RAG、顧客回答、要約 |
| 禁止用途 | 基盤モデル学習、第三者再配布 |
| 帰属 | 回答時に出典表示 |
| 期間 | 2026年4月から2027年3月 |
| 対象 | 契約法人・特定部署 |
| 保存 | キャッシュ30日以内 |
| 終了時 | 利用停止・削除・確認報告 |
| 料金 | 月額、最低保証、従量 |

契約書をAIで読み取る場合も、AI出力をそのまま法的判断にせず、人が承認した条件だけを実行可能なPolicyへ変換します。

### 3. Identity / Credential

実際の利用主体を確認します。

- 法人・部署・サービス
- AI Agent・RAGアプリケーション
- APIキー、OAuth、HMAC、mTLS等
- 権限Scope
- 発行日、失効日、Rotation履歴

User-AgentやIPだけでは偽装・共有・代理利用を十分に防げないため、契約済み利用者の認証を優先します。

### 4. Usage Event

実際の利用記録です。

```text
誰が
どのResourceを
どのシステムで
いつ
何の目的に
どのLicense版で
どの処理へ使ったか
```

Idempotency Key、Request ID、Event Hash、タイムスタンプ等で重複・改ざん・再送を扱います。個人情報や秘密情報をログへ必要以上に保存しない設計も必要です。

### 5. Evidence / Billing

利用イベントを、監査・請求に使える証拠へ整理します。

- 認証済みアクセス
- 署名付き利用報告
- 支払・Receipt
- 契約との一致・不一致
- 調整・取消
- 月次請求明細
- 削除・失効確認

## すべての証拠を同じ強さで扱わない

証拠には信頼度があります。

| 証拠 | 主な用途 |
|---|---|
| 決済済み・署名済みReceipt | 確定請求・提供確認 |
| APIキー・HMAC・OAuth等の認証済み利用 | 契約に基づく利用・請求 |
| Buyerの署名付きUsage Report | 契約で定めた自己報告 |
| Edgeで推定したBotアクセス | 分析・調査 |
| 外部AI回答・引用の観測 | 不一致検知・調査の手掛かり |

外部AIが回答で引用したことだけを根拠に、自動的に無断利用や請求対象と断定することは適切ではありません。契約済み・認証済み・署名済みのイベントから始めます。

## MCPではツール単位の利用を記録する

MCPはAIアプリケーションからツールやResourceへ接続する仕組みです。企業利用では、次を記録します。

- MCP Serverと運営主体
- Tool名・Version
- 呼び出したAgent・ユーザー区分
- 入力したResource ID
- 実行目的・Scope
- 成功・失敗
- 出力・保存の扱い
- License ID
- 利用量・料金単位

ただし、プロンプト全文や機密データを無制限に保存するのではなく、監査に必要な最小項目、Hash、参照ID等で設計します。

## AI Data BOMという考え方

ソフトウェアでは、構成部品を管理するSBOMが使われます。AIシステムでも、モデル、データ、サービス、依存関係、ライセンス等を一覧化する考え方があります。

AI Data BOMには、少なくとも次を含めます。

- データセット・文書群の名称と版
- 権利者・提供者
- 利用目的
- License・期限
- 更新・削除条件
- 利用するAI・RAG・MCP
- 証跡の所在
- 問題発生時の責任者

これは「AIが回答を作る内部過程を完全に再現する」ものではなく、企業が管理可能な構成と利用経路を説明するための資料です。

## Pay per CrawlとPay per Useの位置付け

Pay per Crawlは、AIクローラーがページを正常取得した単位で価格を付ける方式です。一方、企業RAG・API・MCPでは、取得後の利用目的や回数、対象ユーザー、出力等が価値に影響します。

そのため、実務上は次の組み合わせを検討します。

- 月額・年額ライセンス
- 最低保証
- API Call / Retrieval / MCP Tool Callの従量
- 利用人数・部署・地域
- 鮮度・更新頻度
- SLA・監査対応
- 追加利用の調整

決済方法だけでなく、その請求がどのResource・契約・Usage Eventに基づくかを追跡できることが重要です。

## 導入時のチェックリスト

1. 権利者と提供者は一致しているか
2. 公開情報と利用許諾を混同していないか
3. 学習、RAG、表示、再配布を分けているか
4. ResourceとVersionを識別できるか
5. 利用主体を認証できるか
6. 契約版とUsage Eventを結び付けられるか
7. 重複・取消・訂正を扱えるか
8. 契約終了後に停止・削除できるか
9. 顧客へ提出するEvidence Packを作れるか
10. 外部AIで観測できない範囲を明示しているか

## Adctorが目指す範囲

Adctorは、AI・RAG・MCP・Agentによるデータ利用を、Resource、権利者、契約、Identity、Usage Event、Evidence、Billingへ接続するための研究・PoCです。Cloudflare、AWS、x402、外部Marketplace等の入口や決済を置き換えるのではなく、複数基盤を横断する証跡・照合レイヤーを検討しています。

現段階では商用完成品、自動徴収、完全なBot識別、外部AIの全Citation観測を提供済みとするものではありません。まずは1 Resource、1 License、1 Buyer等の限定PoCで、契約と実利用を結び付けられるかを検証します。

RAG・MCPのデータ権利管理は、AI導入を止めるためではありません。**正規のデータを安心して使い、問題が起きたときに説明・停止・修正できる状態をつくるための基盤**です。