# 次のステップ実行サマリー

## ✅ 実行完了項目

### 1. 既存記事の最適化（サンプル）

**最適化した記事**: `_posts/2025-11-13-where-to-buy-order-suits.md`

#### 実装内容

1. **内部リンクの追加**
   - 「Regalis Japan Group株式会社」→ TOPページへのリンク
   - 「コレクション」→ Collectionsページへのリンク
   - 「AI採寸」→ 診断ツールページへのリンク
   - 「ブランドの哲学」→ Philosophyページへのリンク
   - 「出張採寸」「ご来店予約」→ Contactページへのリンク

2. **FAQ構造化データの追加**
   - Front Matterの`faq`フィールドに5つのFAQを追加
   - 回答に「四ツ谷麹町オーダースーツ」「Regalis Japan Group」などのキーワードを含める

3. **メタディスクリプションの最適化**
   - `excerpt`に「四ツ谷麹町オーダースーツ「Regalis Japan Group」」を追加

4. **キーワードの最適化**
   - `keywords`に「四ツ谷麹町オーダースーツ」「Regalis Japan Group」を追加

### 2. 既存記事最適化ガイドラインの作成

**ファイル**: `_existing-posts-optimization-guide.md`

#### 内容

- 内部リンクの追加方法（リンク対象とアンカーテキストの例）
- FAQ構造化データの追加方法（Front Matter形式）
- メタディスクリプションの最適化方法
- キーワード戦略（3層構造）
- 見出し構造の最適化（質問形式の推奨）
- 最適化手順（Step-by-step）
- 最適化済み記事の例

---

## 🔄 継続して実施すべき項目

### 1. 既存記事の最適化（全記事）

**優先度**: 高

**対象記事**: `_posts/`ディレクトリ内の全記事

**実施内容**:
1. 内部リンクの追加（最低2本/記事）
2. FAQ構造化データの追加（Front Matterの`faq`フィールド）
3. メタディスクリプションの最適化
4. キーワードの追加

**参考**: `_existing-posts-optimization-guide.md`

### 2. Google Search Consoleでの設定

**優先度**: 高

**実施内容**:
1. **独自ドメインのプロパティを追加**
   - GSCにログイン
   - 「プロパティを追加」→「ドメイン（例: `regalis-order-suits.com`）」を選択
   - DNS設定（TXTレコード）を行い、所有権を確認

2. **サイトマップの送信**
   - `https://regalis-order-suits.com/sitemap.xml`をGSCに送信
   - これにより、Googleのロボット（クローラー）を呼び込む

3. **URL検査**
   - TOPページのURLを入力
   - 「インデックス登録をリクエスト」ボタンを押す
   - これでアイコンの再取得も促される

4. **構造化データの検証**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)で各ページの構造化データを検証
   - エラーがあれば修正

### 3. パフォーマンス最適化

**優先度**: 中

**実施内容**:
1. **画像の最適化**
   - WebP形式の使用状況を確認
   - 画像の遅延読み込み（`loading="lazy"`）の確認
   - 画像サイズの最適化（適切な解像度）

2. **CSS/JSの最適化**
   - 未使用CSSの削除
   - JavaScriptの最小化
   - Critical CSSのインライン化

3. **フォントの最適化**
   - `font-display: swap`の設定（既に実装済み）
   - フォントのサブセット化

### 4. アクセシビリティ改善

**優先度**: 中

**実施内容**:
1. **alt属性の確認**
   - すべての画像に適切なalt属性が設定されているか確認
   - 装飾画像は空のalt属性（`alt=""`）を使用

2. **セマンティックHTML**
   - 適切な見出し階層（h1→h2→h3）の確認
   - ランドマーク要素（`<main>`, `<nav>`, `<article>`）の使用

3. **ARIA属性**
   - ナビゲーションメニューのaria-label
   - ボタンのaria-expanded

### 5. パフォーマンステスト

**優先度**: 中

**実施内容**:
1. **Lighthouseスコアの確認**
   - Chrome DevToolsのLighthouseで各ページをテスト
   - 目標：90点以上

2. **Core Web Vitalsの測定**
   - LCP（Largest Contentful Paint）
   - FID（First Input Delay）
   - CLS（Cumulative Layout Shift）

3. **モバイル表示の確認**
   - モバイルデバイスでの表示確認
   - タッチターゲットサイズ（44x44px以上）の確認

---

## 📊 期待される効果

### SEO効果

- **内部リンク**: TOPページやCollectionページへの「リンクジュース」が流れ、サイト全体の順位が向上
- **FAQ構造化データ**: 検索結果にFAQが表示され、クリック率が向上
- **メタディスクリプション**: 検索結果でのクリック率が向上

### AI検索最適化（AIO）効果

- **Gemini検索スキーム**: FAQ構造化データにより、AI概要に採用されやすくなる
- **Google SGE**: 質問形式の見出しで検索意図に直接応答
- **ChatGPT / Microsoft Copilot**: 要約ブロック（excerpt）で回答生成に活用

### ユーザー体験

- **サイト内回遊**: 内部リンクにより、ユーザーのサイト内回遊が促進
- **情報アクセス**: FAQ構造化データにより、ユーザーが求める情報にすぐアクセスできる

---

## 🎯 次のアクション

### 即座に実施すべき項目

1. **Google Search Consoleでの設定**
   - 独自ドメインのプロパティを追加
   - サイトマップを送信
   - URL検査でインデックス登録をリクエスト

2. **既存記事の最適化（優先度の高い記事から）**
   - アクセス数の多い記事から順に最適化
   - 最低2本の内部リンクを追加
   - FAQ構造化データを追加

### 継続的に実施すべき項目

1. **新規記事作成時の最適化**
   - `_journal-template.md`をテンプレートとして使用
   - `_existing-posts-optimization-guide.md`を参照

2. **定期的なメンテナンス**
   - 構造化データの検証（Google Rich Results Test）
   - サイトマップの更新確認
   - リンク切れのチェック
   - パフォーマンステスト（Lighthouse）

---

## 📝 注意事項

- **構造化データの重複**: 同じページに同じタイプの構造化データを複数配置しない
- **メタディスクリプション**: 各ページで一意にする（重複を避ける）
- **内部リンク**: 自然な文脈で配置する（キーワードの詰め込みは避ける）
- **FAQ構造化データ**: 実際にユーザーが検索しそうな質問形式にする

---

## 🔗 参考リソース

- [既存記事最適化ガイドライン](_existing-posts-optimization-guide.md)
- [Journal記事SEO/AIO最適化ガイドライン](_journal-seo-guidelines.md)
- [AIO実装チェックリスト](_aio-optimization-checklist.md)
- [AIO実装サマリー](_aio-implementation-summary.md)
- [Google Search Central - 構造化データ](https://developers.google.com/search/docs/appearance/structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

