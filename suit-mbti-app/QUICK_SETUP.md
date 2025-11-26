# EmailJSテンプレート設定 - クイックガイド

## 🚀 5分で完了！設定手順

### ステップ1: EmailJSにログイン
https://www.emailjs.com/ にアクセスしてログイン

### ステップ2: 診断レポート送信用テンプレートを作成

1. **「Email Templates」** → **「Create New Template」**
2. 設定内容:
   - **テンプレート名**: `Regalis診断レポート送信`
   - **Service**: 既存のサービスを選択
   - **To Email**: `{{customer_email}}`
   - **From Name**: `Regalis Japan Group`
   - **件名**: `【Regalis】スーツ診断レポート - {{identity_id}}`
   - **本文**: `EMAILJS_TEMPLATE_SETUP_GUIDE.md`の「ステップ2-4」のHTMLテンプレートをコピー&ペースト
3. **「Save」** → テンプレートIDをコピー（例: `template_abc123`）

### ステップ3: 予約詳細レポート用テンプレートを作成

1. **「Email Templates」** → **「Create New Template」**
2. 設定内容:
   - **テンプレート名**: `Regalis予約詳細レポート送信`
   - **Service**: 同じサービスを選択
   - **To Email**: `{{customer_email}}`
   - **From Name**: `Regalis Japan Group`
   - **件名**: `【Regalis】予約確認レポート - {{booking_id}}`
   - **本文**: `EMAILJS_TEMPLATE_SETUP_GUIDE.md`の「ステップ3-4」のHTMLテンプレートをコピー&ペースト
3. **「Save」** → テンプレートIDをコピー（例: `template_xyz789`）

### ステップ4: App.tsxを更新

`src/App.tsx`の24-25行目を更新:

```typescript
const EMAILJS_REPORT_TEMPLATE_ID = 'template_abc123'; // ← ステップ2で取得したID
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_xyz789'; // ← ステップ3で取得したID
```

### ステップ5: 動作確認

```bash
npm run dev
```

ブラウザでテスト:
1. 診断を完了
2. 「診断レポートを取得する」をクリック → メール確認
3. 「来店予約をする」をクリック → メール確認

---

## 📚 詳細ガイド

より詳しい手順は `EMAILJS_TEMPLATE_SETUP_GUIDE.md` を参照してください。

