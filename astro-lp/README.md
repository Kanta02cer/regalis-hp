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

## コンテンツの編集

文言・事例・FAQはすべて `src/data/site.ts` に集約。コンポーネントを触らずにデータ編集だけで反映される。

- **活用事例・導入事例は現在ダミーデータ**（`tag: 'ダミー'`）。正式コンテンツ確定後に差し替える。
- FAQを編集すると、`Faq.astro` が出力する FAQPage 構造化データ（JSON-LD）にも自動反映される。

## TODO（次フェーズ）

- [ ] フォーム送信先の実装（Webhook / フォームサービス連携）
- [ ] `astro.config.mjs` の `site` を本番ドメインに変更
- [ ] OGP画像・ファビコンの設置
- [ ] 活用事例・導入事例の正式コンテンツ差し替え
- [ ] sitemap / 構造化データ（Organization等）の拡充
