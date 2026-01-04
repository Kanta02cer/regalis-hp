# GitHub.ioページをGoogle検索から削除するガイド

作成日: 2025年1月4日
対象: Regalis Japan Group サイト

---

## 問題の概要

GitHub PagesでCNAMEを使用している場合、以下の両方のURLでアクセス可能です：
- 独自ドメイン: `https://regalis-order-suits.com`
- GitHub.io: `https://[username].github.io/regalis-hp` または `https://kanta02cer.github.io/regalis-hp`

Google検索では、GitHub.ioのURLもインデックスされて表示される可能性があります。これを防ぐため、以下の対策を実装します。

---

## 実装済みの対策

### 1. Canonicalタグの設定 ✅

`_includes/head.html`に以下の設定が既に実装されています：

```html
<link rel="canonical" href="{{ page.url | absolute_url }}">
```

これにより、すべてのページで独自ドメイン（`https://regalis-order-suits.com`）が正規URLとして指定されています。

### 2. サイトマップの設定 ✅

`sitemap.xml`では、`site.url`（`https://regalis-order-suits.com`）を使用しているため、GitHub.ioのURLは含まれていません。

### 3. robots.txtの設定 ✅

`robots.txt`は正しく設定されており、独自ドメインのサイトマップを参照しています。

---

## Google Search Consoleでの対応手順

### ステップ1: GitHub.ioのプロパティを追加（まだの場合）

1. [Google Search Console](https://search.google.com/search-console)にログイン
2. プロパティの追加をクリック
3. 「URLプレフィックス」を選択
4. GitHub.ioのURLを入力（例: `https://kanta02cer.github.io/regalis-hp`）
5. 所有権の確認を行う（HTMLファイルまたはメタタグ方式）

### ステップ2: GitHub.ioサイトのインデックス状況を確認

1. GitHub.ioのプロパティを選択
2. 左メニューから「カバレッジ」を選択
3. インデックスされているURLの数を確認

### ステップ3: GitHub.ioサイトを削除リクエスト

1. GitHub.ioのプロパティを選択
2. 左メニューから「削除」を選択
3. 「新しい削除リクエスト」をクリック
4. 「URLプレフィックス」を選択
5. GitHub.ioのURLプレフィックスを入力（例: `https://kanta02cer.github.io/regalis-hp/`）
6. 「削除をリクエスト」をクリック

**注意**: 削除リクエストは、サイト全体が検索結果から削除されることを意味します。GitHub.ioのサイトは、独自ドメインにリダイレクトされるため、この設定で問題ありません。

### ステップ4: 独自ドメインのプロパティを確認

1. `https://regalis-order-suits.com`のプロパティを選択
2. 左メニューから「設定」→「サイトマップ」を選択
3. `sitemap.xml`が正しく登録されているか確認
4. 必要に応じて、サイトマップを再送信

### ステップ5: 独自ドメインのページを再インデックス

1. 独自ドメインのプロパティを選択
2. 左メニューから「URL検査」を選択
3. 主要なページのURLを入力（例: `https://regalis-order-suits.com/`）
4. 「インデックス登録をリクエスト」をクリック

---

## 追加の対策（オプション）

### GitHub Pagesの設定確認

GitHubリポジトリの設定で、以下を確認してください：

1. GitHubリポジトリに移動
2. 「Settings」→「Pages」を選択
3. 「Custom domain」が`regalis-order-suits.com`に設定されているか確認
4. 「Enforce HTTPS」が有効になっているか確認

### GitHub.ioへのリダイレクト設定（推奨）

GitHub Pagesでは、GitHub.ioのURLから独自ドメインへのリダイレクトを自動的に行います。ただし、明示的にリダイレクトを設定したい場合は、以下の方法があります：

**注意**: GitHub Pagesでは、`.htaccess`ファイルは使用できません。リダイレクトは、GitHub Pagesが自動的に処理します。

---

## 確認方法

### 1. Google検索で確認

以下の検索クエリで、GitHub.ioのURLが表示されないことを確認：

```
site:kanta02cer.github.io regalis
```

または

```
site:github.io regalis-order-suits
```

### 2. 独自ドメインの確認

以下の検索クエリで、独自ドメインのURLのみが表示されることを確認：

```
site:regalis-order-suits.com
```

### 3. Google Search Consoleで確認

1. 独自ドメインのプロパティを選択
2. 左メニューから「ページ」を選択
3. インデックスされているページのURLが、すべて`regalis-order-suits.com`で始まっていることを確認

---

## 注意事項

### 削除リクエストについて

- 削除リクエストは、検索結果からの削除をリクエストするもので、実際のサイトを削除するものではありません
- 削除リクエストの処理には、数日から数週間かかる場合があります
- 削除後も、GitHub.ioのURLは引き続きアクセス可能ですが、検索結果には表示されなくなります

### Canonicalタグについて

- Canonicalタグは、重複コンテンツの問題を解決するために使用されます
- Googleは、Canonicalタグで指定されたURLを優先的にインデックスします
- 既に実装されているため、追加の設定は不要です

### サイトマップについて

- サイトマップには、独自ドメインのURLのみが含まれています
- GitHub.ioのURLは、サイトマップに含まれていないため、新規インデックスされる可能性は低いです

---

## トラブルシューティング

### GitHub.ioのURLがまだ表示される場合

1. **削除リクエストの処理待ち**: 削除リクエストの処理には時間がかかります。数週間待ってから確認してください。

2. **新しいページがインデックスされている**: GitHub.ioのURLで新しいページがインデックスされている場合、再度削除リクエストを送信してください。

3. **キャッシュの問題**: Googleの検索結果キャッシュが更新されるまで時間がかかる場合があります。

### 独自ドメインのページが表示されない場合

1. **インデックス登録の確認**: Google Search Consoleで、ページがインデックスされているか確認してください。

2. **サイトマップの確認**: サイトマップが正しく送信されているか確認してください。

3. **Canonicalタグの確認**: すべてのページで、Canonicalタグが正しく設定されているか確認してください。

---

## 参考リンク

- [Google Search Console ヘルプ](https://support.google.com/webmasters)
- [重複コンテンツの解決方法](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls)
- [サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

---

**最終更新**: 2025年1月4日

