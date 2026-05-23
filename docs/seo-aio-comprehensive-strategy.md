# Regalis Japan Group — SEO/AIO 網羅的施策マスタープラン
## 完全版 競合圧倒ロードマップ 2026年版

**最終更新:** 2026-05-25  
**対象:** 代表・井上幹太（手動対応項目あり）  
**実装済みスコア:** 67/100 → 目標 95/100

---

## 凡例

| 記号 | 意味 |
|------|------|
| 🔴 **要手動** | 人間が操作・判断・申請する必要があるもの |
| 🤖 **自動実装済** | Claude Codeが実装完了 |
| 🔧 **実装可能** | コードで実装できる（次のスプリントで対応） |
| ⏳ **中長期** | 3ヶ月以上かかる施策 |

---

## PART A — 🔴 手動で必ず対応すべき施策（優先度順）

### A-1. Google Search Console 設定 【最優先 / 今すぐ】

**なぜ重要：** GSCなしではGoogle検索での順位・クリック数・インデックス状況が把握できない。AI Overviewへの引用状況もGSCで確認できる。

**手順：**
1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. 「プロパティを追加」→ `https://regalis-order-suits.com`
3. 「HTMLタグ」認証を選択 → メタタグをコピー
4. `_layouts/corp.html` の `<head>` に追記（Claude Codeで追加可）  
   例: `<meta name="google-site-verification" content="XXXX">`
5. GSCで「確認」をクリック
6. サイトマップを送信: `https://regalis-order-suits.com/sitemap.xml`
7. **Discover** タブで AI Overview引用状況を定期確認

---

### A-2. Bing Webmaster Tools 登録 【優先度高】

**なぜ重要：** Bing CopilotはMicrosoft Copilot経由でAI回答を生成する。BingへのインデックスはCopilot引用に直結する。

**手順：**
1. [Bing Webmaster Tools](https://www.bing.com/webmasters/) にアクセス
2. サイト追加 → `https://regalis-order-suits.com`
3. XMLサイトマップ送信
4. `robots.txt` で `Bingbot: Allow /` を確認（実装済み）
5. **IndexNow APIキー** を取得 → `_config.yml` の `indexnow_key:` に設定

**IndexNow設定（コード側で準備済み `/indexnow.txt`）：**
```
REPLACE_WITH_YOUR_INDEXNOW_KEY
```
→ Bing Webmaster ToolsでAPIキーを取得後、`_config.yml` に `indexnow_key: YOUR_KEY` を追加

---

### A-3. Googleビジネスプロフィール（GBP）最適化 【優先度高】

**なぜ重要：** Google AI OverviewのLocalBusiness引用はGBPデータと連動する。「東京 AI検索対策 会社」「麹町 IT企業」などの地域クエリでの引用に直結する。

**手順：**
1. [Googleビジネスプロフィール](https://business.google.com/) にログイン
2. **必須入力項目：**
   - 営業カテゴリ: 「インターネットマーケティングサービス」+「IT管理サービス」
   - 説明文（750文字）: HackⅡ・LLMO・AIO・レガリスのキーワードを含める
   - サービス一覧: SEO/AIOメディア運営代行・AI検索対策・DXコンサルの3本を登録
   - 料金情報: 月額¥98,000〜を明示
   - 写真: オフィス外観・代表・チームを10枚以上
   - Q&A: 「AI検索対策の費用は？」「どんな会社に向いていますか？」を自分で投稿・回答
3. **毎月の運用：** 投稿（記事更新のお知らせ）を月2回以上

---

### A-4. Wikidata エンティティ登録 【優先度高 / AI引用の最重要シグナル】

**なぜ重要：** ChatGPT・Gemini・Claudeなどの主要LLMはWikidataを信頼性の高い情報源として参照する。Wikidataにエンティティが存在する企業はAI引用確率が大幅に向上する。

**手順：**
1. [Wikidata](https://www.wikidata.org/) にアカウント作成
2. 「新しいアイテムを作成」
3. **必須項目：**
   - Label（日本語）: `Regalis Japan Group株式会社`
   - Label（英語）: `Regalis Japan Group Co., Ltd.`
   - 説明（日本語）: `日本のAI検索最適化専門ITカンパニー`
   - **P31**: `instance of` → Q4830453（business）
   - **P17**: `country` → Q17（Japan）
   - **P856**: `official website` → `https://regalis-order-suits.com`
   - **P571**: `inception` → `2025-12-23`
   - **P169**: `chief executive officer` → 井上幹太（人物エンティティも作成）
   - **P159**: `headquarters location` → Q30774（千代田区）
   - **P452**: `industry` → Q11661（information technology）
4. 作成後のWikidata QIDを `knowledge.json` に追加

---

### A-5. 代表「井上幹太」のPersonエンティティ強化 【優先度高 / E-E-A-T】

**なぜ重要：** AI検索エンジンは著者・代表者の「実在する専門家」シグナルを重視する（E-E-A-T）。著名な実績を持つ代表者のPersonエンティティが確立されると、Regalis全記事への信頼性が向上する。

**手順：**
1. **Wikipedia日本語版** — 「令和の虎Tiger Funding・ソフトバンクアカデミア修了」で特筆性が認められる可能性がある。ノートページで相談。
2. **Wikidata** — 井上幹太の人物エンティティを作成（上記A-4と連動）
3. **Google Scholar / ResearchGate** — AI検索最適化の専門知識を示す論文・レポートを投稿
4. **LinkedIn** — プロフィール完成度100%にする。HackⅡ・AICS™をFeatured Skillに追加
5. **X (Twitter)** — `@regalis_jp` のプロフィール最適化。Bio に「AI検索最適化インフラHackⅡ開発者」

---

### A-6. 外部メディア・被リンク獲得 【最重要 / 権威性】

**なぜ重要：** ドメインオーソリティ（DA）が低いとAI引用・Google順位ともに不利。外部からの言及がAIの「信頼性シグナル」になる。

**優先媒体リスト（被リンク獲得先）：**

| 媒体 | 難易度 | 方法 |
|------|--------|------|
| PR TIMES | 低 | プレスリリース配信（HackⅡ新機能・資金調達） |
| ValuePress | 低 | 無料プレスリリース |
| note.com | 低 | 代表による専門記事投稿（noindexにならないよう注意） |
| Qiita / Zenn | 中 | LLMO・AI検索対策の技術記事 |
| 日経クロステック | 高 | 取材依頼・寄稿 |
| Forbes Japan | 高 | 起業家ストーリー記事 |
| Business Insider Japan | 中 | AI検索トレンド記事への引用・寄稿 |
| TechCrunch Japan | 高 | スタートアップニュース |
| G2 / Capterra | 低 | SaaSレビューサイトへの登録 |
| Product Hunt | 低 | HackⅡをProduct Huntに登録 |
| Crunchbase | 低 | 企業情報を登録 |
| GitHub | 低 | HackⅡのOSS周辺ツールをGitHubで公開 |

**即効性が高い施策（今週中に実行）：**
1. PR TIMESにHackⅡ v2.0のリリースを配信（「日本初の全自動AI検索最適化インフラ」）
2. CrunchbaseにRegalis Japan Groupを登録
3. G2にHackⅡ製品ページを登録
4. Qiitaに「llms.txt実装完全ガイド」を投稿

---

### A-7. SNSアカウント エンティティ強化 【優先度中】

**各プラットフォームのプロフィールURL登録：**

| SNS | アカウント | 対応事項 |
|-----|---------|---------|
| X (Twitter) | @regalis_jp | Bio・URLの最適化。AI検索対策の定期投稿 |
| LinkedIn | Regalis Japan Group | 企業ページを作成。サービス・投稿を最適化 |
| Instagram | @regalis.official.jp | ビジュアルブランディング。毎週投稿 |
| YouTube | 新規作成推奨 | AI検索対策解説動画。VideoObjectスキーマ |
| Facebook | 新規作成推奨 | 企業ページ（被リンクとして機能） |

---

### A-8. 専門家・インフルエンサーとのコラボ 【優先度中 / E-E-A-T】

- AI・SEO専門家にHackⅡをレビューしてもらい言及を獲得
- ポッドキャスト出演（AI・DX・スタートアップ系）
- 「令和の虎」出演歴を活用したメディア展開

---

### A-9. カスタマーレビュー獲得 【優先度中 / AggregateRating】

**なぜ重要：** Googleビジネスプロフィールのレビュー数・評点はLocalBusiness引用確率に直結する。

**手順：**
1. 既存クライアントにGoogleレビューを依頼（メール・LINE）
2. レビューリクエストページを作成（QRコード付き）
3. 全レビューに48時間以内に返信（Googleが重視）
4. 目標：6ヶ月で20件・評点4.5以上

---

### A-10. 特許出願の完了と公開 【優先度中 / 権威性】

- 「特許出願中」→ 「特許番号〇〇〇〇」への更新（取得後）
- 特許公開後、特許番号をOrganizationスキーマに追加

---

## PART B — SEO 技術施策（実装済み✅ / 対応中🔧）

### B-1. 構造化データ（JSON-LD）

| スキーマ | 状態 | 場所 |
|---------|------|------|
| Organization | ✅ 実装済 | corp.html グローバル |
| WebSite + SearchAction | ✅ 実装済 | corp.html グローバル |
| **LocalBusiness** | ✅ **今回実装** | corp.html グローバル |
| FAQPage | ✅ 全記事に実装 | news-post.html + frontmatter |
| Article | ✅ 実装済 | news-post.html |
| BreadcrumbList | ✅ 実装済 | news-post.html |
| Person（井上幹太） | ✅ 実装済 | corp.html |
| Service | ✅ 実装済 | corp.html + 各サービスページ |
| WebPage + Speakable | ✅ 実装済 | corp.html |
| HowTo | 🔧 一部記事に追加予定 | robots.txt記事等 |
| AggregateRating | 🔧 レビュー獲得後に追加 | サービスページ |
| VideoObject | 🔧 動画作成後に追加 | YouTube連携後 |
| Event | 🔧 登壇・イベント時に追加 | お知らせ記事 |
| SoftwareApplication | 🔧 HackⅡアプリ詳細ページ | hackii/ |

---

### B-2. テクニカルSEO

| 項目 | 状態 | 備考 |
|------|------|------|
| robots.txt（AI 20種） | ✅ | 完備 |
| sitemap.xml | ✅ | hackii/lp含む |
| canonical | ✅ | 全ページ動的生成 |
| **hreflang（ja/x-default）** | ✅ **今回実装** | corp.html |
| Open Graph / Twitter Cards | ✅ | 全ページ |
| preconnect（Google Fonts） | ✅ | 2箇所 |
| Core Web Vitals | ⚠️ 要確認 | PageSpeed Insightsで計測 |
| HTTPS | ✅ | GitHub Pages デフォルト |
| モバイルフレンドリー | ✅ | viewport設定済み |
| 404ページ | 🔧 | カスタム404.html未確認 |
| Googleサイト認証 | 🔴 手動 | GSC登録後にメタタグ追加 |
| IndexNow | 🔧 | キー取得後に設定 |

---

### B-3. コンテンツSEO（記事体制）

| 指標 | 現在 | 目標（3ヶ月） |
|------|------|-------------|
| 総記事数 | **117本** | **220本** |
| 業種特化記事 | 10本 | 35本 |
| 地域特化記事 | 8本 | 25本 |
| 定義型（〇〇とは） | 40本 | 70本 |
| 比較・選び方型 | 15本 | 30本 |
| ROI・費用型 | 8本 | 20本 |
| ペルソナ別型 | 5本 | 20本 |
| ツール解説型 | 10本 | 20本 |

**残りWeek1〜4 未作成記事（優先度順）：**

| # | タイトル（案） | メインKW | 優先度 |
|---|-------------|---------|--------|
| 1 | 内部リンク戦略とAI引用確率 | 内部リンク AI引用 | ★★★ |
| 2 | 地方・中小企業のローカルAI検索対策 | 地方企業 AI検索 | ★★★ |
| 3 | 大阪・関西企業のAI検索対策 | 大阪 AI検索対策 | ★★★ |
| 4 | 営業部門のAI検索活用ガイド | 営業 AI検索 活用 | ★★☆ |
| 5 | 士業（弁護士・税理士）のAI検索対策 | 士業 AI検索対策 | ★★★ |
| 6 | ECサイト・通販のAIO対策完全ガイド | ECサイト AIO | ★★☆ |
| 7 | ホテル・旅館のAI検索最適化 | ホテル AI検索 | ★★☆ |
| 8 | Core Web VitalsとAI引用の関係 | Core Web Vitals AI | ★★☆ |
| 9 | AIO対策の内製vs外注 判断ガイド | AIO 内製 外注 | ★★★ |
| 10 | 名古屋・東海企業のAI検索対策 | 名古屋 AI検索 | ★★☆ |

---

### B-4. 内部リンク構造の最適化 【重要度高】

現状の問題：記事が孤立していて、記事→サービスページへの動線が弱い。

**実装すべき内部リンクハブ構造：**

```
トップページ
├─ ハブ記事: AI検索最適化 完全ガイド 2026
│   ├─ → HackⅡ製品ページ
│   ├─ → 各業種特化記事（8本）
│   ├─ → 各地域特化記事（5本）
│   └─ → AIO技術記事群
└─ 業種別ハブ
    ├─ → 不動産・製造業・美容・士業…
    └─ → 各業種FAQPage
```

**実装方針：**
- 各記事の末尾に「関連記事」3本の内部リンクを動的挿入
- 「本記事の著者」セクションにPersonスキーマ＋著者ページリンク
- サービスページ → 関連記事への双方向リンク

---

## PART C — AI検索対策（AIO/LLMO）施策

### C-1. llms.txt / llms-full.txt エコシステム

| ファイル | 状態 | 内容 |
|---------|------|------|
| llms.txt | ✅ 自動生成 | 会社概要・最新20記事 |
| llms-full.txt | ✅ 手動管理 | 全情報・FAQ・技術詳細 |
| llms-brand.txt | ✅ 実装済 | ブランドクエリ対応 |
| llms-entity.txt | ✅ 実装済 | エンティティ識別 |
| llms-chatgpt.txt | ✅ 実装済 | ChatGPT特化 |
| llms-gemini.txt | ✅ 実装済 | Gemini特化 |
| llms-claude.txt | ✅ 実装済 | Claude特化 |
| llms-aio.txt | ✅ 実装済 | AIO/Perplexity対応 |
| llms-faq.txt | ✅ 実装済 | FAQ/AEO対応 |
| llms-facts.txt | ✅ 実装済 | 引用用ファクト |
| llms-comparison.txt | ✅ 実装済 | 競合比較 |
| llms-enterprise.txt | ✅ 実装済 | 企業向け |
| llms-dx.txt | ✅ 実装済 | DX特化 |
| llms-local.txt | ✅ 実装済 | ローカル検索 |
| **llms-full.txt 定期更新** | 🔴 手動 | 月1回の情報更新が必要 |

---

### C-2. AIパッチ（ai-patch.json）エコシステム

| 状態 | 内容 |
|------|------|
| ✅ マスターファイル v2.0 | ai-patch.json（Organization・Product・Service・Disambiguation） |
| ✅ 記事パッチ 95本 | /ai-patch/articles/[slug]-ai-patch.json |
| 🔧 新記事追加のたびに対応 | 記事公開と同時にパッチファイルを生成 |
| 🔴 llms-full.txt 更新 | 月1回手動で最新データに更新 |

---

### C-3. robots.txt AIクローラー設定

| 状態 | AI クローラー |
|------|------------|
| ✅ 全許可 | GPTBot / ChatGPT-User / OAI-SearchBot / PerplexityBot / ClaudeBot / anthropic-ai / Google-Extended / Grok / MistralAI / CCBot / 他10種 |
| ✅ 設定済み | 20種以上のAIクローラーを明示的に許可 |

---

### C-4. AI流入トラッキング

| 状態 | 内容 |
|------|------|
| ✅ 実装済 | GA4カスタムイベント `ai_referral_visit` |
| ✅ 実装済 | 20種AIエンジンのリファラー検出 |
| ✅ 実装済 | UTMパラメーター検出 |
| ✅ 実装済 | localStorage 30分セッション保持 |
| ✅ 実装済 | フォーム送信時にAI流入データを自動付加 |
| 🔴 手動 | GA4でカスタムディメンション `ai_source` を設定 |
| 🔴 手動 | GA4でカスタムレポートを作成（AI流入ダッシュボード） |

---

### C-5. AICS™スコア管理

| 指標 | 現在 | 目標 |
|------|------|------|
| サイト平均スコア | 78点 | 85点 |
| 記事パッチカバー率 | 95/117 = 81% | 100% |
| A+（90点以上）記事数 | 12本 | 40本 |
| A（80〜89点）記事数 | 35本 | 70本 |

---

## PART D — 競合・ブランドSEO

### D-1. ブランドSERP独占戦略

「レガリス」「Regalis Japan Group」「HackⅡ」で検索したとき、1ページ目を完全制圧する：

| SERP枠 | 現状 | 目標 |
|--------|------|------|
| オーガニック1位 | 達成 | 維持 |
| AI Overview引用 | 一部 | 全主要クエリで引用 |
| Googleビジネスプロフィール | 🔴 要設定 | ナレッジパネル表示 |
| 画像検索 | 弱 | 代表・ロゴ・オフィス画像で上位 |
| ニュース | 弱 | PR Times配信で表示 |
| 動画（YouTube） | なし | 代表動画で表示 |

---

### D-2. 競合比較クエリの攻略

競合比較クエリ（「レガリス vs 〇〇」「AI検索対策 比較 おすすめ」）で自社コンテンツが引用されるよう、比較記事を先制して作成。

**既に対応済み：**
- ✅ 「AI検索対策会社おすすめ比較」記事（2026-05-25公開）

**未作成（高優先度）：**
- 「LLMO 内製 vs 外注 判断ガイド」
- 「SEO会社 vs AI検索対策専門会社 違い」
- 「HackⅡ vs 他ツール 比較」

---

### D-3. ディスアンビグエーション（エンティティ識別）

「レガリス」が釣具・LEGALISSと混同されないよう、複数の記事・スキーマでエンティティを明示。

| 対策 | 状態 |
|------|------|
| ai-patch.jsonのdisambiguation | ✅ 実装済 |
| 「レガリスとは」定義記事 | ✅ 2026-05-25公開 |
| 「レガリスと釣具の違い」記事 | ✅ 2026-05-22公開 |
| Wikidataエンティティ | 🔴 手動（A-4参照） |
| AI Overviewでの正確な引用 | 進行中 |

---

## PART E — 長期・継続施策

### E-1. コンテンツカレンダー（月次）

| 週 | 目標記事数 | カテゴリ配分 |
|---|-----------|------------|
| 第1週 | 5本 | 業種特化×2 + 地域×1 + 定義型×1 + 比較×1 |
| 第2週 | 5本 | How-to技術×2 + ROI費用×1 + ペルソナ×1 + ブランド×1 |
| 第3週 | 5本 | 業種特化×2 + 地域×1 + ツール解説×1 + 最新トレンド×1 |
| 第4週 | 5本 | まとめ型×1 + 比較×1 + 地域×1 + 業種×1 + ブランド×1 |
| **月計** | **20本** | 累計220本（3ヶ月後目標） |

---

### E-2. 動画SEO（YouTube + VideoObject）

**なぜ重要：** YouTubeは世界第2位の検索エンジン。「AI検索対策とは」などのクエリで動画が表示されると被リンク・エンティティ強化になる。

**推奨コンテンツ：**
1. 「HackⅡ デモ動画」（5分）— ハカル機能のリアル操作
2. 「AI検索対策 入門」（10分）— LLMO/AIOの基礎
3. 「代表インタビュー」（15分）— 起業ストーリー・AI検索の未来
4. 「顧客インタビュー」（5分×3本）— 導入事例
5. 「AI引用される記事の書き方」（7分）— ハウツー

---

### E-3. メールマーケティング / ニュースレター

- 「Regalis AI検索ウィークリー」創刊（月1回）
- 購読者にllms.txt無料診断ツールを提供
- Mailchimp or ConvertKit で配信
- 購読者リストはブランド・エンティティシグナルとして機能

---

### E-4. ポッドキャスト / 音声コンテンツ

- AEO（Answer Engine Optimization）は音声検索にも対応
- Spotify・Apple Podcastsに「AI検索対策ポッドキャスト」開設
- 各エピソードのtranscriptをコンテンツとして公開
- FAQPage構造を音声回答最適化に活用

---

## PART F — KPI・計測体制

### F-1. GA4 カスタム設定（手動）

**🔴 GA4管理画面で手動設定：**

1. **カスタムディメンションを作成：**
   - `ai_source` (スコープ: イベント)
   - `ai_channel` (スコープ: イベント)
   
2. **カスタムレポートを作成：**
   - レポート名: 「AI流入ダッシュボード」
   - ディメンション: `ai_source` / `ランディングページ`
   - 指標: `セッション数` / `コンバージョン数` / `エンゲージメント率`

3. **コンバージョン設定：**
   - お問い合わせフォーム送信 = コンバージョン
   - AI流入からのコンバージョンを分離計測

---

### F-2. 月次KPI ダッシュボード

| KPI | 計測ツール | 目標（3ヶ月後） |
|-----|---------|--------------|
| 総オーガニック流入数 | GA4 + GSC | 現状×3倍 |
| AI経由流入数 | GA4カスタムイベント | 月100セッション以上 |
| AI引用クエリ数 | GSC Discover + 手動確認 | 50クエリ以上 |
| AICS™スコア平均 | aio_analyzer.py | 85点 |
| お問い合わせ数 | GA4コンバージョン | 月20件以上 |
| AI経由MQL成約率 | CRM連携 | 4.4倍維持 |
| ドメインオーソリティ | Moz/Ahrefs | DA 30以上 |
| 被リンク数 | GSC / Ahrefs | 50ドメイン以上 |
| Googleビジネスプロフィール | GBP管理画面 | インプレッション月1,000以上 |
| レビュー数 | GBP | 20件・評点4.5以上 |

---

## 実装優先度マトリクス

```
高インパクト × 低コスト（今すぐやる）
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ AI流入トラッキング実装（完了）
🔴 GSC登録・サイトマップ送信
🔴 Googleビジネスプロフィール最適化
🔴 GA4 カスタムディメンション設定
🔧 残りWeek1〜4 記事制作（継続）
🔧 内部リンク強化
🔴 PR Times プレスリリース配信

高インパクト × 高コスト（計画的に実行）
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 Wikidata / Wikipedia エンティティ登録
🔴 外部メディア取材・記事掲載
🔴 YouTube チャンネル開設・動画制作
⏳ ドメインオーソリティ向上（被リンク獲得）
⏳ 特許取得・学術的権威性

低インパクト × 低コスト（空き時間に対応）
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 Bing Webmaster Tools 登録
🔴 Crunchbase 企業情報登録
🔴 G2 / Capterra 製品登録
🔧 hreflang設定（完了）
🔧 LocalBusinessスキーマ（完了）
```

---

## 最優先アクション（今週中）

| # | タスク | 担当 | 期限 |
|---|-------|------|------|
| 1 | Google Search Console 登録・サイトマップ送信 | 🔴 手動（代表） | 今日 |
| 2 | Googleビジネスプロフィール 完全設定 | 🔴 手動（代表） | 今週 |
| 3 | GA4 カスタムディメンション設定 | 🔴 手動（代表） | 今週 |
| 4 | PR Times でHackⅡ v2.0 プレスリリース配信 | 🔴 手動（代表） | 今週 |
| 5 | Wikidata エンティティ登録 | 🔴 手動（代表） | 今週 |
| 6 | Crunchbase 企業登録 | 🔴 手動（代表） | 今週 |
| 7 | IndexNow APIキー取得・_config.yml設定 | 🔴 手動（代表）→ 🤖 Claude対応 | 今週 |
| 8 | 残りWeek1 記事3本制作 | 🤖 Claude Code | 継続 |
| 9 | 既存記事への内部リンク追加 | 🤖 Claude Code | 今週 |
| 10 | llms-full.txt 最新情報に更新 | 🔴 手動確認 + 🤖 対応 | 今週 |
