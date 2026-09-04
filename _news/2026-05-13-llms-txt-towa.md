---
title: "llms.txtとは？仕様・用途・限界を公式情報で解説【2026年版】"
date: 2026-05-13
last_modified: 2026-09-04
category: サービス
excerpt_text: "llms.txtは、Webサイトの概要と重要ページをLLMやAIエージェント向けにまとめるMarkdown形式の提案仕様です。robots.txtとの違い、Google検索での扱い、設置しても引用が保証されない理由を公式情報に基づいて解説します。"
keywords: "llms.txt,llms.txtとは,AI検索最適化,AIO対策,LLMO,robots.txt,Regalis Japan Group"
ai_summary: "llms.txtは、サイトの概要と推奨ページをAI向けに整理する提案仕様です。検索順位やAI引用を保証する仕組みではなく、Googleは検索ランキングにllms.txtを使用しないと案内しています。"
jsonld: |
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "llms.txtとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "llms.txtは、Webサイトの概要と重要ページへのリンクをMarkdown形式でまとめ、LLMやAIエージェントがサイトを理解しやすくするための提案仕様です。通常はドメイン直下の/llms.txtに設置します。"
        }
      },
      {
        "@type": "Question",
        "name": "llms.txtとrobots.txtの違いは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "robots.txtはクローラーのアクセス可否を伝える標準的な仕組みです。llms.txtはサイト概要や推奨ページを案内する任意の情報ファイルで、アクセス制御には使いません。"
        }
      },
      {
        "@type": "Question",
        "name": "llms.txtを設置するとAIの引用率は上がりますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "設置だけで引用率が上がる保証はありません。Googleは検索ランキングにllms.txtを使用しないと案内しています。本文の正確性、一次情報、内部リンク、クロール可能性、外部評価と合わせて検証する必要があります。"
        }
      },
      {
        "@type": "Question",
        "name": "llms.txtはどこに設置しますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "原則としてhttps://example.com/llms.txtのようにドメイン直下へUTF-8のテキストとして設置し、HTTP 200で取得できることと、記載したリンクが公開されていることを確認します。"
        }
      }
    ]
  }
  </script>
---

## llms.txtとは

**llms.txtは、Webサイトの概要と重要ページをLLMやAIエージェント向けにMarkdown形式で案内するための提案仕様です。** 通常はドメイン直下の `/llms.txt` に公開します。

ただし、検索エンジンの標準的なランキング要因でも、AI引用を保証するファイルでもありません。Googleは、検索ランキングにllms.txtを使用しないと公式に案内しています。Regalis Japan Group株式会社では、この前提を明示したうえで、AIが参照しやすい情報設計の補助として扱っています。

> 情報提供元・調査・執筆：Regalis Japan Group株式会社<br>
> [公式サイト]({{ '/' | relative_url }}) / [会社概要]({{ '/trillionbank/company/' | relative_url }})

## llms.txtに書く内容

提案仕様では、サイト名をH1、その概要を引用文、主要な情報群をH2、その配下をMarkdownリンクとして整理します。内容は、公開済みの一次情報だけに絞るのが基本です。

| 項目 | 記載例 | 判断基準 |
|---|---|---|
| サイト名 | `# Regalis Japan Group` | 正式名称を使う |
| 概要 | 事業内容を短く説明 | 本文や会社情報と一致させる |
| 主要ページ | サービス、会社概要、問い合わせ | 現在公開中の正規URLだけを載せる |
| 記事 | 定義、手順、料金、調査データ | AI回答の根拠になり得る一次情報を優先 |
| 補足 | 更新日、対象地域、注意事項 | 検証可能な事実だけを書く |

APIキー、個人情報、非公開の契約情報、未確定の機能は記載しません。llms.txtは公開ファイルであり、秘密情報の保管場所ではありません。

## robots.txt・sitemap.xml・構造化データとの違い

| ファイル・記述 | 主な役割 | AI引用を保証するか |
|---|---|---|
| `robots.txt` | クローラーのアクセス可否を伝える | しない |
| `sitemap.xml` | 検索エンジンへURLと更新情報を伝える | しない |
| JSON-LD | ページの種類や主体を構造化して伝える | しない |
| `llms.txt` | サイト概要と重要ページをAI向けに案内する提案仕様 | しない |

これらは代替関係ではありません。たとえば、AI検索からの参照を希望する場合でも、対象クローラーをrobots.txtで拒否していれば取得されない可能性があります。OpenAIは、ChatGPT検索への掲載を希望するサイトに対してOAI-SearchBotを許可するよう案内しています。

## llms.txtでできること・できないこと

### できること

- サイトの正式名称、事業概要、優先して読んでほしいページを1ファイルに整理する
- サービスページ、定義記事、料金・契約条件などへの導線を明確にする
- AI向け情報設計を社内で棚卸しするチェックポイントにする
- 更新対象URLを人と機械の双方が確認しやすくする

### できないこと

- AI回答での表示・引用を確約する
- 検索順位を直接上げる
- 誤った本文や古い料金情報を自動で修正する
- robots.txtのアクセス制御やsitemap.xmlのURL通知を代替する

llms.txtだけを更新し、本文・構造化データ・会社情報に矛盾が残ると、かえって情報の一貫性を損ないます。公開情報は必ず同時に整合させます。

## Google検索とAI検索での扱い

Googleは、AI検索向けに特別なAIファイルや特別な構造化データを用意する必要はないと説明しています。また、llms.txtを検索ランキングに使用しないことも明記しています。そのため、llms.txtを「順位改善の裏技」として販売・運用するのは適切ではありません。

優先順位は次のとおりです。

1. クローラーがアクセスでき、HTTP 200で本文を取得できる
2. ページ冒頭で質問に直接答え、一次情報と根拠を示す
3. 正規URL、公開日・更新日、運営主体をページ間で一致させる
4. 内部リンクとsitemap.xmlで重要ページを見つけやすくする
5. llms.txtを補助案内として追加し、効果を計測する

## Regalis Japan Groupの実装方針

Regalis Japan Groupは、ルートの [llms.txt]({{ '/llms.txt' | relative_url }}) に会社概要、主要サービス、AI検索に関する記事を掲載しています。ファイルの有無を成果とせず、HackⅡでAIエンジン別の引用URL・言及・競合SOVを継続計測し、公開前後の変化を確認します。

設置作業を行う方は、コード例と検証手順をまとめた [llms.txtの書き方・設置・検証方法]({{ '/news/llms-txt-implementation-guide/' | relative_url }}) も参照してください。

## よくある質問

### llms.txtとは何ですか？

llms.txtは、Webサイトの概要と重要ページへのリンクをMarkdown形式でまとめ、LLMやAIエージェントがサイトを理解しやすくするための提案仕様です。通常はドメイン直下の `/llms.txt` に設置します。

### llms.txtとrobots.txtの違いは何ですか？

robots.txtはクローラーのアクセス可否を伝える標準的な仕組みです。llms.txtはサイト概要や推奨ページを案内する任意の情報ファイルで、アクセス制御には使いません。

### llms.txtを設置するとAIの引用率は上がりますか？

設置だけで引用率が上がる保証はありません。Googleは検索ランキングにllms.txtを使用しないと案内しています。本文の正確性、一次情報、内部リンク、クロール可能性、外部評価と合わせて検証する必要があります。

### llms.txtはどこに設置しますか？

原則として `https://example.com/llms.txt` のようにドメイン直下へUTF-8のテキストとして設置し、HTTP 200で取得できることと、記載したリンクが公開されていることを確認します。

## まとめ

llms.txtは、AI検索時代の情報整理に使える軽量な提案仕様です。一方で、単体で引用や順位を改善するものではありません。正確な一次情報、Answer-Firstの本文、クロール可能性、内部リンク、更新履歴を先に整え、llms.txtは補助導線として検証するのが現実的です。

Regalis Japan Group株式会社は「設計から始める」を原則に、実装の有無ではなくAI回答内での引用・言及・SOVの変化まで確認します。[AI検索無料診断の相談はこちら]({{ '/contact/' | relative_url }})。

---

情報提供元・調査・執筆：Regalis Japan Group株式会社
