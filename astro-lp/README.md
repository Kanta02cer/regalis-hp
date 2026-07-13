# 法人AI導入支援 LP（Astro）

法人向けAI導入支援サービスのランディングページ。目的はターゲット企業からの問い合わせ（AI診断・資料請求）の獲得。

## 技術スタック

- [Astro 5](https://astro.build/)（静的サイト生成）
- [Tailwind CSS v4](https://tailwindcss.com/)（`@tailwindcss/vite` プラグイン経由）
- TypeScript

## コマンド

```bash
npm install       # 依存関係のインストール
npm run dev       # 開発サーバー（http://localhost:4321）
npm run build     # 本番ビルド（dist/ に出力）
npm run preview   # ビルド結果のプレビュー
```

## デザインシステム（3色ルール）

| 役割 | 色 | トークン |
|------|-----|---------|
| ベース | クリーム `#FBF6EC` | `base-50`〜`base-300` |
| メイン | オレンジ `#EA7A2B` | `main-50`〜`main-700`（CTA・強調） |
| アクセント | ディープネイビー `#1F3A5F` | `accent-500`〜`accent-900`（見出し・信頼感） |

トークンは `src/styles/global.css` の `@theme` で定義。

## ディレクトリ構成

```
src/
├── data/site.ts          # 全コンテンツデータ（コピー・事例・FAQ）
├── layouts/BaseLayout.astro  # head / OGP / フォント / アニメーション
├── pages/index.astro     # LP本体（セクションの組み立て）
├── styles/global.css     # Tailwind + デザイントークン
└── components/
    ├── Header.astro       # 固定ヘッダー + CTA
    ├── Hero.astro         # ヒーロー（「1分で無料AI診断」CTA最前面）
    ├── Services.astro     # サービス5本柱
    ├── UseCases.astro     # 活用事例一覧（※ダミーデータ）
    ├── Curriculum.astro   # 研修カリキュラム4ステップ
    ├── CaseStudies.astro  # 導入事例（※ダミーデータ）
    ├── Faq.astro          # FAQ（FAQPage構造化データ出力）
    ├── ContactForm.astro  # 問い合わせフォーム（必須3項目）
    ├── CtaButton.astro    # CTAボタン共通コンポーネント
    └── Footer.astro
```

## SEO・構造化データ

- **Jsonld.astro** — 全ページ共通の `@graph`（Organization / WebSite / Person）。運営会社・著者の表記ゆれは `alternateName` として機械可読で出力
- **Faq.astro** — FAQPage構造化データ（リッチリザルト対応）
- **author.astro**（`/author/`）— E-E-A-T向け監修者プロフィールページ + ProfilePage構造化データ
- **canonical / OGP / twitter:card** — `BaseLayout.astro` で全ページ出力。OGP画像は `node scripts/generate-ogp.mjs` で再生成
- **sitemap** — `@astrojs/sitemap` がビルド時に `sitemap-index.xml` を生成。`public/robots.txt` から参照
- 構造化データ・SNSリンク等の元データはすべて `src/data/site.ts`（`organization` / `author`）

## リード獲得（AI診断・フォーム）

- **Diagnosis.astro**（`/#diagnosis`）— 8問のAI活用成熟度診断。回答後に結果をロックし、会社名・メール・窓口（研修/開発）の3必須項目で解錠するリードゲート。設問と判定は `src/data/diagnosis.ts`
- **ContactForm.astro**（`/#contact`）— 問い合わせフォーム（必須3項目）
- **Webhook連携** — 両フォームとも送信時に `PUBLIC_LEAD_WEBHOOK_URL`（Zapier/Make等）へJSONをPOST。ペイロードには `type`（diagnosis/contact）、`track`（選択された窓口）、`diagnosis`（スコア・レベル・全回答）を含む。共通処理は `src/lib/leads.ts`
- **スパム対策** — 画面外ハニーポット項目、localStorageによる連投制限（10分間3回まで・30秒間隔）、最短入力時間チェック（3秒未満はボット扱いで送信せず成功を装う）

### Webhook設定

```bash
cp .env.example .env
# PUBLIC_LEAD_WEBHOOK_URL にZapier Catch Hook / Make WebhookのURLを設定してビルド
```

※ URLはビルド時にクライアントJSへ埋め込まれるため、設定変更後は再ビルドが必要。未設定の場合、フォームは送信エラーを表示する。

## コンテンツの編集

文言・事例・FAQはすべて `src/data/site.ts` に集約。コンポーネントを触らずにデータ編集だけで反映される。

- **活用事例・導入事例は現在ダミーデータ**（`tag: 'ダミー'`）。正式コンテンツ確定後に差し替える。
- FAQを編集すると、`Faq.astro` が出力する FAQPage 構造化データ（JSON-LD）にも自動反映される。

## TODO（次フェーズ）

- [x] フォーム送信先の実装（Webhook連携）+ AI診断リードゲート
- [ ] `PUBLIC_LEAD_WEBHOOK_URL` に本番のZapier/Make WebhookのURLを設定
- [ ] Webhook受信側（Make/Zapier）で自動返信メール・Slack通知・日程調整のシナリオを構築
- [ ] `astro.config.mjs` の `site` と `public/robots.txt` のSitemap URLを本番ドメインに変更
- [ ] XアカウントURL確定後、`src/data/site.ts` の `sameAs` に追加
- [ ] 活用事例・導入事例の正式コンテンツ差し替え
- [x] OGP画像・ファビコンの設置
- [x] sitemap / 構造化データ（Organization / Person / FAQPage / ProfilePage）実装
