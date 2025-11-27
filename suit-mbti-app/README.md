# Suit-MBTI v9.0 - Regalis Japan Group

React製のスーツ診断アプリケーションを既存のHTMLサイトに埋め込むためのプロジェクトです。

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
cd suit-mbti-app
npm install
```

### 2. EmailJSの設定

1. [EmailJS](https://www.emailjs.com/) にアカウントを作成
2. サービス（Gmail、Outlookなど）を設定
3. テンプレートを作成
4. `src/App.tsx` の以下の定数を更新：

```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認できます。

### 4. ビルド

```bash
npm run build
```

`dist/` ディレクトリにビルドされたファイルが生成されます。

## 📦 既存サイトへの埋め込み方法

### 方法1: ビルド済みファイルを直接配置

1. `npm run build` を実行
2. `dist/` ディレクトリ内のファイルを既存サイトの適切な場所にコピー
3. HTMLページに以下のコードを追加：

```html
<!-- アプリを埋め込む場所 -->
<div id="regalis-suit-app"></div>

<!-- ビルド済みファイルを読み込む -->
<link rel="stylesheet" href="/path/to/dist/assets/index.css">
<script type="module" src="/path/to/dist/assets/main.js"></script>
```

### 方法2: CDN経由で配置（推奨）

1. `dist/` ディレクトリの内容をWebサーバーにアップロード
2. HTMLページに以下のコードを追加：

```html
<div id="regalis-suit-app"></div>

<link rel="stylesheet" href="https://yourdomain.com/suit-mbti-app/assets/index.css">
<script type="module" src="https://yourdomain.com/suit-mbti-app/assets/main.js"></script>
```

## 📝 EmailJSテンプレート設定例

EmailJSのテンプレートには以下の変数を使用できます：

- `{{to_name}}` - 顧客名
- `{{to_email}}` - 顧客メールアドレス
- `{{customer_name}}` - 顧客名
- `{{customer_email}}` - 顧客メールアドレス
- `{{customer_phone}}` - 電話番号
- `{{customer_age}}` - 年齢
- `{{identity_id}}` - 診断ID
- `{{plan_name}}` - 選択プラン名
- `{{archetype}}` - アーキタイプ名
- `{{physical_type}}` - 体型タイプ
- `{{total_price}}` - 合計金額
- `{{message}}` - メッセージ

## 🎨 カスタマイズ

- デザインの変更: `src/App.tsx` 内のコンポーネントを編集
- スタイルの調整: `src/index.css` または Tailwindクラスを編集
- 診断ロジックの変更: `src/App.tsx` の `calculateResult` 関数を編集

## 📄 ライセンス

Regalis Japan Group 専用

