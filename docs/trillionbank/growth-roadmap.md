# トリリオンバンク Web成長ロードマップ（SEO/AEO × 案件獲得動線）

目的：**お金をかけずにSEO/AEOで問い合わせ100件・成約1,000万円**を狙う。
そのための「Web改修の優先順位」「連携サービス」「案件が取れるまでの動線」をまとめる。

---

## A. 案件が取れるまでの動線（ファネル）

```
[TOFU 集客]  SEO/AEO記事(自社メディア) ＋ AI検索での被引用(HackⅡをドッグフード)
             ＋ YouTube/SNS(令和の虎・Nontitle) ＋ IndexNow即時送信
      │
      ▼  記事内CTA（各記事末に「無料AI検索診断β」）
[MOFU 獲得]  無料AI検索診断(β)＝URLを入れるだけのリードマグネット
             ＋ 資料DL（会社紹介/HackⅡ概要）→ メールアドレス獲得
      │
      ▼  自動返信＋ナーチャリング（メール/事例）
[BOFU 育成]  商談予約（カレンダー） → 事例・料金・提案
      │
      ▼
[成約]       HackⅡ Pro（事業者）/ Expert（代理店）/ PPC PoC
```

**KPIの目安（100件/1,000万逆算）**
- 記事流入 月10,000〜（記事60〜100本 × 平均100〜/月）
- 診断/資料DL CV率 1〜2% → リード 100〜200/月
- 商談化 20〜30% → 商談 20〜60/月
- 成約 10〜20% × 平均単価30〜100万円 → 月数百万〜

---

## B. Web改修 提案（優先度順）＋ 連携サービス

### ★優先度1（今すぐ・低コストで効く）

| 改修 | 内容 | 連携サービス（無料〜低額） |
|---|---|---|
| フォームの実サーバー化 | 現状mailto → 実送信・自動返信・スパム対策・入力保持 | **Formspree** / **Web3Forms** / **Basin**（無料枠）。CRM連携なら **HubSpot Forms（無料）** |
| リード管理・自動返信 | 問い合わせを一元管理＋自動メール | **HubSpot CRM（無料）** or **Resend**（※package.json導入済）＋簡易DB |
| 商談予約導線 | 「商談」CTAをその場で予約に | **TimeRex** / **Spir** / **Calendly**（日本語UIならTimeRex/Spir） |
| アクセス解析・イベント計測 | cta_click/contact_submit/scroll_depth等 | **GA4 + Google Tag Manager**（無料）＋ **Microsoft Clarity**（無料ヒートマップ） |
| 検索インデックス | 記事公開を即反映 | **Google Search Console** / **Bing Webmaster** / **IndexNow**（キー導入済） |
| 資料DL（リードマグネット） | 会社紹介/HackⅡ概要PDFをメール引換で配布 | PDF生成（後述）＋ Formspree/HubSpot |

### ★優先度2（記事エンジン＝回す仕組み）

| 改修 | 内容 | 連携サービス |
|---|---|---|
| WordPress風の記事編集UI | 非エンジニアでもブラウザ入稿 | **Decap CMS（旧Netlify CMS）** を `/admin` に設置（GitHub OAuth）。※Jekyllのまま実現 |
| AI記事生成（回す） | キーワード→下書きを量産→レビュー→公開 | **Claude / GPT / Gemini API** で下書き、**Perplexity** で一次情報リサーチ。運用は「生成→人がファクト確認→commit」 |
| アイキャッチ画像 | 記事サムネ | 生成AI画像（前回仕様）or Canva/Figma。フラット方針に合わせSVG/単色でも可 |
| 内部リンク自動化 | 記事間・事業ページへの導線 | Jekyll関連記事プラグイン or 手動テンプレ（プロンプトに内蔵） |

### ★優先度3（信頼・CV最大化）

| 改修 | 内容 | 連携サービス |
|---|---|---|
| 導入事例/お客様の声 | 実績が出たら随時 | 自社CMS（Decap） |
| セキュリティヘッダー | CSP/HSTS等（仕様§14） | GitHub Pagesは制限あり → **Cloudflare（無料）**を前段に置きヘッダー付与＋高速化＋WAF |
| パフォーマンス/Lighthouse | 画像最適化・遅延読込 | Cloudflare/自前最適化。目標 Perf90+/SEO95+ |
| 独自ドメインの堅牢化 | 現状さくらDNS→GitHub | **Cloudflare**でDNS/CDN/セキュリティ統合（任意） |
| 会社プロフィールPDF | 商談・投資家用 | 印刷用HTML→PDF（同一デザイン） |

---

## C. 連携の“最短構成”おすすめ（無料重視）

1. **HubSpot（無料CRM＋フォーム＋メール）** … リード獲得〜自動返信〜商談化を1つで
2. **TimeRex or Spir** … 商談予約
3. **GA4 + GTM + Clarity** … 計測・改善
4. **Search Console + IndexNow** … SEO/AEOの土台
5. **Decap CMS** … WordPress風の記事入稿
6. **Claude/GPT/Gemini API** … 記事下書きの量産（プロンプトは `article-prompt-system.md`）
7. （任意）**Cloudflare** … セキュリティヘッダー/高速化/WAF

> どれも本サイト（Jekyll/GitHub Pages）を作り替えずに“足す”だけで導入できます。

---

## D. 進め方（提案）

- **Step 1（今週）**：フォーム実送信化（Formspree/HubSpot）＋GA4/GTM＋商談予約リンク
- **Step 2**：Decap CMSで入稿環境＋記事プロンプト運用開始（週2〜3本）
- **Step 3**：資料DL（PDF）＋メールナーチャリング
- **Step 4**：Cloudflare前段でセキュリティ/高速化、Lighthouse最適化

各Stepで必要なのは「アカウント作成」と「ID/エンドポイントの共有」だけです。共有いただければ私が実装します。
