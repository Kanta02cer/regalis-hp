# 次のステップ - 実装完了までの流れ

## 📍 現在の状況

- ✅ プロジェクトのセットアップ完了
- ✅ 依存関係のインストール完了
- ✅ 開発サーバー起動中
- ⏳ EmailJS設定（次に実施）

---

## 🎯 実装完了までの全体フロー

```
1. EmailJS設定
   ↓
2. 動作確認・テスト
   ↓
3. ビルド（本番用ファイル生成）
   ↓
4. 既存サイトへの統合
   ↓
5. 本番環境での動作確認
   ↓
6. 公開
```

---

## ステップ1: EmailJS設定 ⏳（現在ここ）

### 実施内容

1. **EmailJSアカウント作成**
   - https://www.emailjs.com/ でアカウント作成

2. **メールサービス接続**
   - GmailまたはOutlookを接続
   - サービスIDを取得

3. **メールテンプレート作成**
   - 予約通知用のテンプレートを作成
   - テンプレートIDを取得

4. **公開キー取得**
   - アカウント設定から公開キーを取得

5. **App.tsxに設定を反映**
   - `src/App.tsx` の3つの定数を更新

**詳細は `EMAILJS_SETUP_STEP_BY_STEP.md` を参照してください。**

---

## ステップ2: 動作確認・テスト

### 2-1. ローカルでの動作確認

```bash
# 開発サーバーが起動していることを確認
# ブラウザで http://localhost:5173 を開く
```

**確認項目:**
- [ ] 診断フローが正常に動作する
- [ ] 予約フォームが表示される
- [ ] フォーム送信が成功する
- [ ] EmailJSでメールが送信される
- [ ] 抽選機能が動作する
- [ ] スマートフォンでも正常に表示される

### 2-2. EmailJSの動作確認

1. テスト予約を送信
2. EmailJSダッシュボードの「Logs」で送信履歴を確認
3. 設定したメールアドレスにメールが届くことを確認

---

## ステップ3: ビルド（本番用ファイル生成）

### 3-1. ビルド実行

```bash
cd suit-mbti-app
npm run build
```

### 3-2. ビルド結果の確認

`dist/` ディレクトリに以下のファイルが生成されます：

```
dist/
├── assets/
│   ├── index-[hash].css
│   ├── main-[hash].js
│   └── ...
└── index.html
```

### 3-3. ビルドファイルの確認

```bash
# ビルド結果をプレビュー
npm run preview
```

---

## ステップ4: 既存サイトへの統合

### 4-1. ビルドファイルの配置

**オプションA: プロジェクトルートに配置（推奨）**

```bash
# dist/の内容を既存サイトの適切な場所にコピー
cp -r suit-mbti-app/dist/* /path/to/your/site/assets/suit-mbti-app/
```

**オプションB: 別ディレクトリに配置**

```bash
# 例: _site/assets/suit-mbti-app/ に配置
mkdir -p _site/assets/suit-mbti-app
cp -r suit-mbti-app/dist/* _site/assets/suit-mbti-app/
```

### 4-2. HTMLページの作成

既存サイトに `order-diagnosis.html` を作成（既に作成済み）。

必要に応じて、パスを調整：

```html
---
layout: null
title: "スーツ診断 - Regalis Japan Group"
---

<div id="regalis-suit-app"></div>

<link rel="stylesheet" href="{{ '/assets/suit-mbti-app/assets/index.css' | relative_url }}">
<script type="module" src="{{ '/assets/suit-mbti-app/assets/main.js' | relative_url }}"></script>
```

### 4-3. ナビゲーションへの追加

`_includes/header.html` などにリンクを追加：

```html
<a href="{{ '/order-diagnosis.html' | relative_url }}">スーツ診断</a>
```

**詳細は `INTEGRATION_GUIDE.md` を参照してください。**

---

## ステップ5: 本番環境での動作確認

### 5-1. 本番環境にデプロイ

- GitHub Pages、Netlify、Vercelなど、使用しているホスティングサービスにデプロイ

### 5-2. 動作確認

1. 本番URLでアクセス
2. 診断フローを最後まで実行
3. EmailJSの送信が正常に動作することを確認
4. スマートフォンでも動作確認

### 5-3. EmailJSの本番環境設定

- EmailJSの設定は開発環境と同じで動作します
- ただし、本番環境のURLをEmailJSの「Allowed Origins」に追加することを推奨

---

## ステップ6: 公開

### 6-1. 最終確認

- [ ] すべての機能が正常に動作する
- [ ] メール送信が正常に動作する
- [ ] モバイル対応が正常
- [ ] デザインが既存サイトと調和している

### 6-2. 公開

- サイトを公開
- SNSやメールで告知

---

## 🔧 トラブルシューティング

### ビルドエラーが発生する

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 既存サイトでアプリが表示されない

- ファイルパスが正しいか確認
- ブラウザのコンソールでエラーを確認
- `dist/` の内容が正しく配置されているか確認

### EmailJSが動作しない

- `src/App.tsx` の設定が正しいか確認
- EmailJSダッシュボードの「Logs」でエラーを確認
- 公開キーが正しく設定されているか確認

---

## 📚 参考ドキュメント

- `README.md` - プロジェクト概要
- `EMAILJS_SETUP_STEP_BY_STEP.md` - EmailJS設定の詳細手順
- `INTEGRATION_GUIDE.md` - 既存サイトへの統合ガイド
- `EMAILJS_SETUP.md` - EmailJS設定の概要

---

## ✅ チェックリスト

### EmailJS設定
- [ ] EmailJSアカウント作成
- [ ] メールサービス接続
- [ ] テンプレート作成
- [ ] App.tsxに設定反映

### 動作確認
- [ ] ローカルで動作確認
- [ ] EmailJS送信確認
- [ ] モバイル対応確認

### ビルド・統合
- [ ] ビルド実行
- [ ] 既存サイトに統合
- [ ] 本番環境で動作確認

### 公開
- [ ] 最終確認
- [ ] 公開

---

## 🎉 完了！

すべてのステップが完了したら、スーツ診断アプリが既存サイトで動作するようになります！

