# 既存HTMLサイトへの統合ガイド

## 概要

このガイドでは、ビルド済みのSuit-MBTI v9.0アプリケーションを既存のJekyllサイト（または静的HTMLサイト）に統合する手順を説明します。

## 前提条件

- `npm run build` が完了していること
- `dist/` ディレクトリにビルド済みファイルが存在すること

## 統合手順

### ステップ1: ビルドファイルの配置

1. `dist/` ディレクトリの内容を既存サイトの適切な場所にコピーします。

   **推奨配置場所:**
   ```
   /assets/suit-mbti-app/
     ├── assets/
     │   ├── index.css
     │   ├── main.js
     │   └── ...
   ```

2. または、プロジェクトルートに `suit-mbti-app/` ディレクトリを作成して配置します。

### ステップ2: HTMLページの作成

既存サイトに新しいページ（例: `order-diagnosis.html`）を作成します。

**Jekyllの場合 (`order-diagnosis.html`):**

```html
---
layout: default
title: "スーツ診断 - Regalis Japan Group"
---

<div id="regalis-suit-app"></div>

<link rel="stylesheet" href="{{ '/assets/suit-mbti-app/assets/index.css' | relative_url }}">
<script type="module" src="{{ '/assets/suit-mbti-app/assets/main.js' | relative_url }}"></script>
```

**通常のHTMLの場合 (`order-diagnosis.html`):**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>スーツ診断 - Regalis Japan Group</title>
    <link rel="stylesheet" href="/assets/suit-mbti-app/assets/index.css">
</head>
<body>
    <div id="regalis-suit-app"></div>
    <script type="module" src="/assets/suit-mbti-app/assets/main.js"></script>
</body>
</html>
```

### ステップ3: ナビゲーションへの追加

既存のナビゲーションメニューにリンクを追加します。

**例 (`_includes/header.html`):**

```html
<nav>
    <!-- 既存のリンク -->
    <a href="{{ '/order-diagnosis.html' | relative_url }}">スーツ診断</a>
</nav>
```

### ステップ4: スタイルの競合回避

既存サイトのスタイルと競合しないように、アプリは `#regalis-suit-app` 内にスコープされています。

必要に応じて、既存のCSSで以下のように調整できます：

```css
#regalis-suit-app {
    /* 必要に応じてスタイルを追加 */
    min-height: 100vh;
}
```

## 動作確認

1. 開発サーバーを起動（Jekyllの場合: `bundle exec jekyll serve`）
2. `http://localhost:4000/order-diagnosis.html` にアクセス
3. アプリが正常に表示されることを確認
4. 診断フローを最後まで実行して、EmailJSの送信が正常に動作することを確認

## トラブルシューティング

### アプリが表示されない

- ブラウザのコンソールでエラーを確認
- ファイルパスが正しいか確認
- `dist/` ディレクトリの内容が正しく配置されているか確認

### EmailJSが動作しない

- `src/App.tsx` のEmailJS設定が正しいか確認
- EmailJSのテンプレートが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

### スタイルが崩れる

- 既存サイトのCSSと競合していないか確認
- Tailwind CSSが正しく読み込まれているか確認

## 本番環境へのデプロイ

1. `npm run build` を実行
2. `dist/` の内容を本番サーバーにアップロード
3. HTMLページが正しくアプリを参照しているか確認
4. EmailJSの設定が本番環境でも動作するか確認

## サポート

問題が発生した場合は、開発チームにご連絡ください。

