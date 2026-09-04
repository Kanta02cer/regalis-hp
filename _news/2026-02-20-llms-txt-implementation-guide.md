---
title: "llms.txtの書き方・設置・検証方法｜Jekyll実装例付き【2026年版】"
date: 2026-02-20
last_modified: 2026-09-04
category: サービス
excerpt_text: "llms.txtの作成からドメイン直下への設置、HTTP 200・UTF-8・リンク切れの確認、公開後のAI引用計測までを実例付きで解説します。JekyllやGitHub Pagesで導入する際の設定と、書いてはいけない情報も確認できます。"
keywords: "llms.txt 書き方,llms.txt 設置,llms.txt Jekyll,llms.txt GitHub Pages,AI検索最適化,Regalis Japan Group"
ai_summary: "llms.txtを公開情報だけで作成し、ドメイン直下へ設置して技術検証とAI引用計測を行う実務ガイドです。llms.txtは提案仕様であり、設置だけで検索順位やAI引用が向上する保証はありません。"
jsonld: |
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "llms.txtはどのような形式で書きますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "UTF-8のプレーンテキストをMarkdown形式で記述します。H1にサイト名、引用文に概要、H2ごとにサービスや記事を分け、公開中の正規URLをMarkdownリンクで掲載します。"
        }
      },
      {
        "@type": "Question",
        "name": "Jekyllでllms.txtを公開するにはどうしますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "リポジトリ直下にllms.txtを置き、必要に応じて_config.ymlのincludeにllms.txtを追加します。ビルド後に/llms.txtがHTTP 200で取得できることを確認します。"
        }
      },
      {
        "@type": "Question",
        "name": "llms.txtに書いてはいけない情報はありますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "APIキー、個人情報、非公開URL、未発表サービス、未確定の価格や実績は記載しません。llms.txtは誰でも取得できる公開ファイルです。"
        }
      },
      {
        "@type": "Question",
        "name": "llms.txt公開後の効果はどう測りますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "対象キーワードとAIエンジンを固定し、公開前後の引用率、言及率、自社SOV、引用URLを比較します。クロール・インデックス・引用はいずれも保証されないため、複数週で評価します。"
        }
      }
    ]
  }
  </script>
---

## llms.txtの実装手順

**llms.txtは、公開済みの正確な情報だけをMarkdown形式で整理し、ドメイン直下へ配置したうえで、取得可否とAI引用の変化を別々に検証します。** このページではJekyllとGitHub Pagesを例に、作成から計測までを順番に説明します。

> 情報提供元・調査・執筆：Regalis Japan Group株式会社<br>
> [公式サイト]({{ '/' | relative_url }}) / [会社概要]({{ '/trillionbank/company/' | relative_url }})

llms.txtの位置づけやrobots.txtとの違いを先に確認したい方は、[llms.txtとは？仕様・用途・限界]({{ '/news/llms-txt-towa/' | relative_url }})を参照してください。

## Step 1：掲載する公開情報を決める

最初に「AIへ伝えたいこと」ではなく、「公開ページで確認できる事実」を集めます。

- 正式な会社名・ブランド名
- 事業やサービスの短い説明
- 会社概要、サービス、料金、問い合わせの正規URL
- 自社調査、定義、手順など一次情報を含む記事
- 情報の対象地域や更新日

APIキー、個人情報、非公開資料、ログイン後のURL、未発表サービス、未確定の価格・導入実績は除外します。

## Step 2：Markdown形式で記述する

最小構成は次のとおりです。

```markdown
# Example Company

> Example Companyは、企業向けにExample Serviceを提供しています。

## Company

- [会社概要](https://example.com/company/): 所在地と運営会社情報
- [お問い合わせ](https://example.com/contact/): 法人向け相談窓口

## Services

- [Example Service](https://example.com/service/): サービス内容と提供範囲

## Guides

- [用語解説](https://example.com/news/guide/): 定義と実装方法
```

リンク先を説明する一文は短くし、各ページの実際の内容と一致させます。キーワードを並べただけの説明や、公開ページに存在しない実績は載せません。

## Step 3：ドメイン直下へ設置する

公開URLは原則として `https://example.com/llms.txt` です。Jekyllではリポジトリ直下に `llms.txt` を置きます。構成によってコピー対象から外れる場合は、`_config.yml` に次の設定を追加します。

```yaml
include:
  - llms.txt
```

既に `include:` がある場合は、新しいキーを重複させず、既存の配列へ `llms.txt` を追加します。

## Step 4：公開状態を検証する

ビルド成功だけで完了にせず、公開後に次の項目を確認します。

| 確認項目 | 合格条件 |
|---|---|
| HTTPステータス | `/llms.txt` が200を返す |
| 文字コード | UTF-8で日本語が文字化けしない |
| Content-Type | テキストとして取得できる |
| URL | 全リンクが公開中の正規URLである |
| 内容 | サイト本文、料金、会社情報と矛盾しない |
| 秘密情報 | APIキーや個人情報を含まない |

Regalis Japan Groupの実装例は、公開中の [llms.txt]({{ '/llms.txt' | relative_url }}) で確認できます。

## Step 5：本文・構造化データと整合させる

llms.txtは要約ファイルです。次の情報がページ本文と食い違わないようにします。

- 会社・ブランドの正式名称
- サービス名と提供範囲
- 料金と契約条件
- 公開日・最終更新日
- 正規URLと内部リンク

たとえば、AI検索計測サービス「HackⅡ」の料金・提供範囲は個別案内です。一方、SEO・AIOメディア運営代行は月額¥98,000〜で、初期6ヶ月契約などの条件があります。異なるサービスの料金を混在させないことが、AIにも利用者にも重要です。

## Step 6：公開後の変化を計測する

llms.txtを公開した事実だけでは効果を判断できません。対象キーワードとAIエンジンを固定し、公開前後で同じ条件を比較します。

| 指標 | 確認すること |
|---|---|
| 引用率 | 自社URLが出典リンクとして付いた計測の割合 |
| 言及率 | リンクの有無を問わず自社名が回答に出た割合 |
| 自社SOV | 全引用枠に占める自社ドメインの割合 |
| 引用URL | llms.txtで案内したページが実際に選ばれたか |
| 競合SOV | 同じ条件で競合との差が縮まったか |

クロール、インデックス、AI回答への採用には時間差があります。1回だけの増減で判断せず、同じ曜日・同じエンジン・同じキーワード群で複数週を比較します。

## 実装チェックリスト

- [ ] H1にサイトの正式名称を記載した
- [ ] 概要は公開ページの表現と一致している
- [ ] 正規URLのみを掲載した
- [ ] 非公開情報や未確定情報を除外した
- [ ] `/llms.txt` がHTTP 200で取得できる
- [ ] UTF-8で表示できる
- [ ] 記載したリンクに404がない
- [ ] sitemap.xmlと主要ページの内部リンクを整えた
- [ ] 公開前の引用率・言及率・SOVを保存した
- [ ] 公開後も同条件で複数週計測する

## よくある質問

### llms.txtはどのような形式で書きますか？

UTF-8のプレーンテキストをMarkdown形式で記述します。H1にサイト名、引用文に概要、H2ごとにサービスや記事を分け、公開中の正規URLをMarkdownリンクで掲載します。

### Jekyllでllms.txtを公開するにはどうしますか？

リポジトリ直下に `llms.txt` を置き、必要に応じて `_config.yml` の `include` に `llms.txt` を追加します。ビルド後に `/llms.txt` がHTTP 200で取得できることを確認します。

### llms.txtに書いてはいけない情報はありますか？

APIキー、個人情報、非公開URL、未発表サービス、未確定の価格や実績は記載しません。llms.txtは誰でも取得できる公開ファイルです。

### llms.txt公開後の効果はどう測りますか？

対象キーワードとAIエンジンを固定し、公開前後の引用率、言及率、自社SOV、引用URLを比較します。クロール・インデックス・引用はいずれも保証されないため、複数週で評価します。

## まとめ

llms.txtの実装では、書式より先に情報の正確性を揃えることが重要です。ドメイン直下への設置、HTTP 200・UTF-8・リンク切れの確認を行い、その後は引用率・言及率・SOVを同じ条件で測ります。

Googleはllms.txtを検索ランキングに使用しないと案内しており、他のAIサービスでも引用は保証されません。Regalis Japan Group株式会社は「設計から始める」を原則に、サイト構造と一次情報を整えたうえでHackⅡの計測結果から次の改善を決めます。[AI検索無料診断の相談はこちら]({{ '/contact/' | relative_url }})。

---

情報提供元・調査・執筆：Regalis Japan Group株式会社
