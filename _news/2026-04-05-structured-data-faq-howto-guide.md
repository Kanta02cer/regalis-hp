---
title: "FAQPage・HowTo構造化データの実装方法：AI検索引用率を高める設計術"
date: 2026-04-05
category: メディア・SEO
excerpt_text: "FAQPageとHowTo構造化データ（JSON-LD）は、Google検索・AI検索の両方で効果的な施策です。具体的な実装コードと設計のコツを解説します。"
---

## 構造化データとは何か

構造化データとは、Webページの内容を**機械（検索エンジン・AI）が理解しやすい形式で記述したコード**です。主にJSON-LD形式でHTMLの`<head>`や`<body>`内に記述します。

schema.orgが定めた標準形式を使うことで、GoogleやAIアシスタントがページの内容（FAQの質問と回答、手順の説明など）を正確に把握できるようになります。

## FAQPage構造化データ

### 効果

- Googleの検索結果でFAQリッチスニペットが表示される（クリック率向上）
- ChatGPT・Perplexityが質問と回答のペアを正確に引用しやすくなる
- ユーザーの疑問に直接応答するコンテンツとして評価される

### 基本的な実装コード

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "AIメディア運用代行の費用はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "月額¥98,000〜（税別）です。初期契約期間6ヶ月を前提にWebサイト開発費を無料提供しています。"
      }
    },
    {
      "@type": "Question",
      "name": "AIO対策とは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AIO（AI Impression Optimization）は、ChatGPT・Perplexityなどの生成AI検索に自社コンテンツが引用されるよう最適化する施策です。llms.txt実装、構造化データ設定、AI引用設計が主な対策です。"
      }
    }
  ]
}
</script>
```

### FAQコンテンツ設計のコツ

**質問文は実際のユーザーの言葉を使う**
「〜とは何ですか？」「〜にかかる費用は？」「〜はどのくらいの期間かかりますか？」など、実際に検索・質問されるであろう表現を使いましょう。

**回答は1〜3文で完結させる**
AIが回答を引用する際、長すぎる文章は引用されません。核心的な情報を1〜3文で答える形式が最も引用されやすいです。

**ページあたり5〜10問が目安**
FAQが多すぎると各質問の重要度が薄れます。そのページのテーマに最も関連する5〜10問に絞りましょう。

## HowTo構造化データ

### 効果

- 手順を説明するコンテンツのAI引用精度が上がる
- Googleで手順リストのリッチスニペットが表示される
- 「〜の方法」「〜のやり方」系クエリで上位表示されやすくなる

### 基本的な実装コード

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "オウンドメディアを立ち上げる方法",
  "description": "中小企業が自社メディアを6ヶ月で立ち上げるための手順です。",
  "step": [
    {
      "@type": "HowToStep",
      "name": "ターゲットとテーマを決める",
      "text": "誰に何を発信するかを明確にします。業種・悩み・キーワードを3〜5テーマに絞ります。"
    },
    {
      "@type": "HowToStep",
      "name": "Webサイトを構築する",
      "text": "CMSを選定し、SEO/AIO対応のサイト構造を実装します。llms.txtと構造化データを初期設定します。"
    },
    {
      "@type": "HowToStep",
      "name": "初期コンテンツを制作する",
      "text": "ピラーページ2〜3本とクラスター記事8〜12本を制作し、Google Search Consoleにサイトマップを送信します。"
    }
  ]
}
</script>
```

## Article構造化データ

ブログ・コラムページには必ずArticleまたはBlogPostingスキーマを実装します。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "記事タイトル",
  "description": "記事の説明",
  "datePublished": "2026-04-05",
  "author": {
    "@type": "Person",
    "name": "著者名",
    "jobTitle": "代表取締役"
  },
  "publisher": {
    "@type": "Organization",
    "name": "会社名",
    "logo": {"@type": "ImageObject", "url": "https://example.com/logo.svg"}
  }
}
</script>
```

## 構造化データ実装時の注意点

### HTMLの内容と一致させる

構造化データに記述した内容がページ本文にも表示されていることが必須です。構造化データだけに情報を書いてHTMLに書かないのはGoogleのガイドライン違反になります。

### 正確な情報のみ記述する

価格・住所・電話番号は常に最新の正確な情報を使用してください。古い情報が構造化データに残っていると信頼性が下がります。

### Google Rich Results Testで確認する

実装後はGoogleのリッチリザルトテストツール（`search.google.com/test/rich-results`）で正しく認識されているか確認しましょう。

## まとめ

FAQPage・HowTo・Article の3つの構造化データを主要ページに実装するだけで、AI引用率は大幅に改善します。技術的な実装が難しい場合は、メディア運用代行サービスに含めてもらうことをお勧めします。

→ [構造化データ対応のメディア運用代行を見る](/business/media-operation/)
