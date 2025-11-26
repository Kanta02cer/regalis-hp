# EmailJS設定ガイド

## EmailJSとは

EmailJSは、サーバーサイドのコードを書かずに、クライアント側（ブラウザ）から直接メールを送信できるサービスです。

## セットアップ手順

### 1. EmailJSアカウントの作成

1. [EmailJS公式サイト](https://www.emailjs.com/) にアクセス
2. 「Sign Up」から無料アカウントを作成（月200通まで無料）

### 2. メールサービスの設定

1. EmailJSダッシュボードにログイン
2. 「Email Services」をクリック
3. 「Add New Service」をクリック
4. 使用するメールサービスを選択（Gmail、Outlook、SendGridなど）
5. サービス名を設定（例: "regalis_contact"）
6. 認証情報を入力して接続

**重要:** サービスIDをメモしておいてください（例: `service_xxxxx`）

### 3. メールテンプレートの作成

1. 「Email Templates」をクリック
2. 「Create New Template」をクリック
3. 以下のようなテンプレートを作成：

**件名:**
```
新しい予約が入りました - {{identity_id}}
```

**本文:**
```
新しい予約が入りました。

【顧客情報】
名前: {{customer_name}}
メール: {{customer_email}}
電話: {{customer_phone}}
年齢: {{customer_age}}

【診断結果】
ID: {{identity_id}}
アーキタイプ: {{archetype}}
体型タイプ: {{physical_type}}
選択プラン: {{plan_name}}
合計金額: {{total_price}}円

【メッセージ】
{{message}}

---
このメールは自動送信されています。
```

4. 「Save」をクリック
5. テンプレートIDをメモしておいてください（例: `template_xxxxx`）

### 4. 公開キーの取得

1. 「Account」→「General」をクリック
2. 「Public Key」をコピー（例: `xxxxxxxxxxxxx`）

### 5. アプリケーションへの設定

`src/App.tsx` の以下の定数を更新：

```typescript
const EMAILJS_SERVICE_ID = 'service_xxxxx'; // ステップ2で取得したサービスID
const EMAILJS_TEMPLATE_ID = 'template_xxxxx'; // ステップ3で取得したテンプレートID
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx'; // ステップ4で取得した公開キー
```

### 6. 動作確認

1. `npm run dev` で開発サーバーを起動
2. アプリで予約フォームを送信
3. 設定したメールアドレスにメールが届くことを確認

## トラブルシューティング

### メールが届かない

- EmailJSのダッシュボードで「Logs」を確認
- エラーメッセージを確認
- サービスID、テンプレートID、公開キーが正しいか確認

### CORSエラーが発生する

- EmailJSの公開キーが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

## 本番環境での注意点

- EmailJSの無料プランは月200通まで
- より多くのメールを送信する場合は有料プランへのアップグレードを検討
- 本番環境では、環境変数を使用してキーを管理することを推奨

## 代替案: Google Apps Script

EmailJSの代わりに、Google Apps Scriptを使用することも可能です。

1. Google Apps ScriptでWebアプリとして公開
2. POSTリクエストを受け取るエンドポイントを作成
3. Gmail APIを使用してメールを送信
4. `src/App.tsx` の `startLottery` 関数を修正して、fetch APIでGoogle Apps ScriptのエンドポイントにPOSTリクエストを送信

