# EmailJSテンプレート設定ガイド

## 📋 このガイドの目的

診断レポート送信と予約詳細レポート送信の2つのEmailJSテンプレートを作成し、アプリに設定する手順を説明します。

---

## 🎯 作成するテンプレート

1. **診断レポート送信用テンプレート** - ユーザーが「診断レポートを取得する」を選択した時に使用
2. **予約詳細レポート用テンプレート** - 来店予約が完了した時に使用

---

## ステップ1: EmailJSダッシュボードにアクセス

1. https://www.emailjs.com/ にアクセス
2. ログイン（既にアカウント作成済みの場合）
3. ダッシュボードが表示されます

---

## ステップ2: 診断レポート送信用テンプレートの作成

### 2-1. テンプレート作成画面を開く

1. 左メニューから **「Email Templates」** をクリック
2. **「Create New Template」** ボタンをクリック

### 2-2. テンプレートの基本設定

**テンプレート名:**
```
Regalis診断レポート送信
```

**Service（サービス）:**
- 既に設定済みのサービスを選択（例: `regalis_contact`）

**To Email（送信先）:**
- `{{customer_email}}` と入力（ユーザーのメールアドレスに送信）

**From Name（送信者名）:**
```
Regalis Japan Group
```

**Reply To（返信先）:**
- 店舗のメールアドレスを入力（例: `info@regalis.co.jp`）

### 2-3. 件名（Subject）の設定

```
【Regalis】スーツ診断レポート - {{identity_id}}
```

### 2-4. 本文（Content）の設定

以下のHTMLテンプレートを使用してください：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
    .info-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 10px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Regalis Japan Group</h1>
      <p style="margin: 10px 0 0 0;">スーツ診断レポート</p>
    </div>
    
    <div class="content">
      <p>この度は、Regalis Japan Groupのスーツ診断をご利用いただき、ありがとうございます。</p>
      
      <div class="section">
        <div class="section-title">📋 診断結果</div>
        <div class="info-box">
          <p><strong>診断ID:</strong> {{identity_id}}</p>
          <p><strong>アーキタイプ:</strong> {{archetype}}</p>
          <p><strong>体型タイプ:</strong> {{physical_type}}</p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">💰 推奨プラン</div>
        <div class="info-box">
          <p><strong>プラン名:</strong> {{plan_name}}</p>
          <p><strong>お見積もり:</strong> {{total_price}}</p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">📄 詳細レポート</div>
        <pre>{{report_content}}</pre>
      </div>
      
      <div class="section">
        <p>このレポートは、診断結果と回答内容をまとめたものです。</p>
        <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Regalis Japan Group</p>
      <p>このメールは自動送信されています。</p>
    </div>
  </div>
</body>
</html>
```

### 2-5. テンプレートを保存

1. **「Save」** ボタンをクリック
2. **テンプレートID**をコピー（例: `template_abc123`）
   - テンプレート一覧に表示されるIDをメモしてください

---

## ステップ3: 予約詳細レポート用テンプレートの作成

### 3-1. 新しいテンプレートを作成

1. **「Email Templates」** ページで **「Create New Template」** をクリック

### 3-2. テンプレートの基本設定

**テンプレート名:**
```
Regalis予約詳細レポート送信
```

**Service（サービス）:**
- 同じサービスを選択

**To Email（送信先）:**
- `{{customer_email}}` と入力

**From Name（送信者名）:**
```
Regalis Japan Group
```

**Reply To（返信先）:**
- 店舗のメールアドレスを入力

### 3-3. 件名（Subject）の設定

```
【Regalis】予約確認レポート - {{booking_id}}
```

### 3-4. 本文（Content）の設定

以下のHTMLテンプレートを使用してください：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
    .info-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 10px 0; }
    .step-box { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #10b981; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; font-size: 12px; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Regalis Japan Group</h1>
      <p style="margin: 10px 0 0 0;">予約確認レポート</p>
    </div>
    
    <div class="content">
      <p>{{customer_name}} 様</p>
      <p>この度は、Regalis Japan Groupへのご予約ありがとうございます。</p>
      <p>予約が正常に受け付けられました。詳細レポートをお送りいたします。</p>
      
      <div class="section">
        <div class="section-title">📋 予約情報</div>
        <div class="info-box">
          <p><strong>予約ID:</strong> {{booking_id}}</p>
          <p><strong>お名前:</strong> {{customer_name}} 様</p>
          <p><strong>メールアドレス:</strong> {{customer_email}}</p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">📄 詳細レポート</div>
        <pre>{{report_content}}</pre>
      </div>
      
      <div class="section">
        <p>ご来店をお待ちしております。</p>
        <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Regalis Japan Group</p>
      <p>このメールは自動送信されています。</p>
    </div>
  </div>
</body>
</html>
```

### 3-5. テンプレートを保存

1. **「Save」** ボタンをクリック
2. **テンプレートID**をコピー（例: `template_xyz789`）

---

## ステップ4: App.tsxにテンプレートIDを設定

### 4-1. App.tsxを開く

エディタで `suit-mbti-app/src/App.tsx` を開きます。

### 4-2. テンプレートIDを更新

ファイルの20-24行目あたりにある以下の部分を、取得したテンプレートIDに置き換えます：

```typescript
// EmailJS設定
const EMAILJS_SERVICE_ID = 'service_eknowod'; // 既に設定済み
const EMAILJS_TEMPLATE_ID = 'template_xvgcres'; // 既に設定済み（予約通知用）
const EMAILJS_PUBLIC_KEY = 't_2xYv1Fj4qOBuUXS'; // 既に設定済み
const EMAILJS_REPORT_TEMPLATE_ID = 'template_abc123'; // ← ステップ2で取得したIDに置き換え
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_xyz789'; // ← ステップ3で取得したIDに置き換え
```

**例:**
```typescript
const EMAILJS_REPORT_TEMPLATE_ID = 'template_abc123'; // 診断レポート送信用
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_xyz789'; // 予約詳細レポート用
```

### 4-3. ファイルを保存

変更を保存します。

---

## ステップ5: 動作確認

### 5-1. 開発サーバーを起動

```bash
cd suit-mbti-app
npm run dev
```

### 5-2. 診断レポート送信のテスト

1. ブラウザで `http://localhost:5173` を開く
2. 診断を最後まで進める
3. 結果画面で **「診断レポートを取得する」** をクリック
4. メールアドレスを入力して送信
5. メールボックスを確認してレポートが届くことを確認

### 5-3. 予約詳細レポート送信のテスト

1. 診断結果画面で **「来店予約をする」** をクリック
2. 予約フォームに情報を入力して送信
3. 抽選画面が表示される
4. メールボックスを確認して予約詳細レポートが届くことを確認

### 5-4. EmailJSダッシュボードで確認

1. EmailJSダッシュボードの **「Logs」** を確認
2. 送信履歴が表示されることを確認
3. エラーがないか確認

---

## 🔍 トラブルシューティング

### メールが届かない

1. **EmailJSのLogsを確認**
   - ダッシュボードの「Logs」でエラーを確認
   - エラーメッセージを確認

2. **テンプレートIDが正しいか確認**
   - `App.tsx`のテンプレートIDが正しいか確認
   - テンプレート一覧でIDを再確認

3. **変数名が正しいか確認**
   - テンプレート内の変数名（`{{report_content}}`など）が正しいか確認
   - 大文字小文字を確認

### レポート内容が表示されない

1. **変数名の確認**
   - `{{report_content}}`がテンプレートに含まれているか確認
   - HTMLテンプレートの`<pre>`タグ内に`{{report_content}}`があるか確認

2. **コードの確認**
   - `App.tsx`の`generateReport`関数と`generateBookingReport`関数が正しく動作しているか確認
   - ブラウザのコンソールでエラーを確認

### テンプレートが保存できない

1. **必須項目の確認**
   - Service、To Email、From Nameが設定されているか確認
   - テンプレート名が入力されているか確認

2. **HTMLの確認**
   - HTMLテンプレートに構文エラーがないか確認
   - 特殊文字がエスケープされているか確認

---

## ✅ チェックリスト

### テンプレート作成
- [ ] 診断レポート送信用テンプレートを作成した
- [ ] 予約詳細レポート用テンプレートを作成した
- [ ] 両方のテンプレートIDをメモした

### App.tsx設定
- [ ] `EMAILJS_REPORT_TEMPLATE_ID`を設定した
- [ ] `EMAILJS_BOOKING_TEMPLATE_ID`を設定した
- [ ] ファイルを保存した

### 動作確認
- [ ] 診断レポート送信が成功した
- [ ] 予約詳細レポート送信が成功した
- [ ] メールの内容が正しく表示される
- [ ] EmailJSのLogsでエラーがない

---

## 📝 補足情報

### 使用される変数一覧

**診断レポート送信テンプレート:**
- `{{customer_email}}` - 顧客のメールアドレス
- `{{identity_id}}` - 診断ID
- `{{archetype}}` - アーキタイプ名
- `{{physical_type}}` - 体型タイプ名
- `{{plan_name}}` - 選択プラン名
- `{{total_price}}` - 合計金額
- `{{report_content}}` - レポート本文（重要）

**予約詳細レポート送信テンプレート:**
- `{{customer_email}}` - 顧客のメールアドレス
- `{{customer_name}}` - 顧客名
- `{{booking_id}}` - 予約ID
- `{{report_content}}` - レポート本文（重要）

### テンプレートのカスタマイズ

- HTMLとCSSを自由に編集できます
- ブランドカラーやロゴを追加できます
- レイアウトを変更できます
- `{{report_content}}`変数は必ず含めてください（レポート本文が表示されます）

---

## 🎉 完了！

すべての設定が完了したら、アプリケーションは完全に動作するようになります！

問題が発生した場合は、EmailJSの公式ドキュメント（https://www.emailjs.com/docs/）を参照するか、お問い合わせください。

