# トリリオンバンク — 生成用プロンプト集

コーポレートサイトの（再）生成と、画像生成に使うプロンプトをまとめています。
**画像生成はAPIキー不要の「Codex（GPT Image 2）」方式**です。

---

## A. 画像生成（Codex × GPT Image 2 ／ APIキー不要）

### 事前準備（1回だけ・ローカルPC推奨）
Codex CLI をブラウザ認証がある環境で用意します。

```bash
npm i -g @openai/codex     # 未インストール時のみ
codex login                # ChatGPTアカウントでログイン（APIキー不要）
```

> ChatGPTアカウントでログインすれば**追加課金なし・APIキー不要**でGPT Image 2が使えます。
> ヘッドレス/リモート環境では `codex login --device-auth`（デバイスコード方式）も利用可。

### Claude Code への頼み方（これをそのまま貼るだけ）
> **「codex exec を使って GPT Image 2 で、以下の画像を `trillionbank/assets/img/` に生成して。」**
> …と伝え、下の各プロンプトを渡すだけ。コマンドや英語プロンプトはClaude Codeが組み立てます。

### 共通スタイル指定（全画像に付与）
```
Modern premium Japanese corporate tech aesthetic for an "AI search security vendor".
Deep navy / near-black background (#070A14) with an electric-blue (#2563EB) to
cyan (#22D3EE) gradient as the signature accent, plus subtle gold hairlines.
Sharp, trustworthy, high-end, minimal. Sense of security and scale ("trillion").
No text, no letters, no logos, no watermarks. Generous negative space.
```

### 画像プロンプト（ファイル名 → プロンプト）

| ファイル | 用途 | プロンプト（共通スタイルに続けて） |
|---------|------|-----------------|
| `hero.png` (1536×1024) | ヒーロー背景 | Abstract shield / secure-lattice motif protecting flowing data streams that feed into an AI core. Sense of “brand truth being defended” in the AI-search era. Cinematic, spacious. |
| `ogp.png` (1536×1024) | OGP/SNS | Balanced key visual: a glowing gradient shield over a subtle world/data grid, space on the left for an overlaid headline. |
| `biz-crawl.png` (1024×1024) | Pay per Crawl | Crawler bots approaching a gated portal, converting into coin/value flows — “monetized, controlled crawling”. Icon-illustration style. |
| `biz-hackii.png` (1024×1024) | HackⅡ | Radar/dashboard motif tracking brand mentions across multiple AI answers, signal waves and monitored nodes. Icon-illustration style. |
| `ceo.png` (1024×1024) | 代表イメージ（※実写がなければ抽象イメージ） | Abstract portrait-frame visual with gradient light — NOT a real face. Placeholder until an actual photo is provided. |
| `origin.png` (1024×1536) | 社名の由来 | A single glowing “T” monolith rising like a tower/bank vault, gradient light, conveying dream + scale. |

### 複数枚まとめ生成の頼み方
> 「この6枚をまとめてGPT Image 2で生成して。保存先は `trillionbank/assets/img/`。」

### スキル化（次回から「画像生成して」で呼べる）
うまく生成できたら Claude Code に:
> **「今のやり方をスキル化して」**
と頼めば、`skill-creator` を使ってスキルを自動作成。以降は「画像生成して」の一言で同じ手順が動きます。
テイスト（上記“共通スタイル”）もスキルに記録すれば、揃った素材が安定して出ます。

---

## B. コーポレートサイト（再）生成プロンプト（Claude Code 用）

サイトを作り直す・拡張するときに、Claude Code へ渡すマスタープロンプト。

```
株式会社トリリオンバンクのコーポレートサイトを作成/更新してください。

【前提資料】docs/trillionbank/company-overview.md を正とする。
【出力先】trillionbank/index.html（自己完結の静的HTML、インラインCSS、ビルド不要）
【デザイン方針】
- テーマ: ダーク&プレミアム。背景 #070A14、青#2563EB→シアン#22D3EE のグラデを基調、
  ゴールド#C9A24B を極細のアクセントに。「AI検索セキュリティ」らしい信頼感・鋭さ。
- 日本語見出しは Noto Serif JP、本文は Inter / Noto Sans JP、ラベルは Space Grotesk(mono)。
- スクロールリビール、レスポンシブ、可読性重視。webデザイナー視点で余白・階層・対比を丁寧に。
【必須セクション】
Hero / Trust(株主) / What we do(3列) / 事業(Pay per Crawl・HackⅡ) /
理念(トリリオンの課題に挑む) / 社名の由来 / 代表 / メディア掲載 / 会社概要 / CTA / Footer
【厳守】
- 未確定情報（設立日・資本金・連絡先等）は捏造せず「［要記入］」で表示。
- メディア掲載の「掲載予定」は必ずラベルで区別（誇大表示の防止）。
- 画像は trillionbank/assets/img/ を参照。未配置でも崩れないプレースホルダを用意。
```

---

## C. 運用メモ
- サイトの正データは `docs/trillionbank/company-overview.md`。内容更新はまずこちらを直す。
- 画像は `trillionbank/assets/img/` に集約。
- ローカル確認: `python3 -m http.server` などで `trillionbank/index.html` を開く。
