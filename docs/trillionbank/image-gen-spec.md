# トリリオンバンク — 画像生成要件・プロンプト仕様（GPT Image 2 / Codex）

現行サイト（kokuyo recruit風・白基調・タイポグラフィ主導）に馴染む画像素材を、
**Codex（`codex exec`）＋GPT Image 2（`gpt-image-1`）** で生成するための要件書。
※ (b)方式＝ご自身のPCで `codex login`（ChatGPTアカウント／APIキー不要）後に実行。

---

## 0. 生成の前提（1回だけ）
```bash
npm i -g @openai/codex        # 未導入時のみ
codex login                   # ChatGPTアカウントでログイン
```

Claude Code もしくはターミナルでの頼み方（基本形）:
> **「codex exec を使って GPT Image 2 で、次のプロンプトの画像を生成して。
>  保存先は `trillionbank/assets/img/<ファイル名>`。サイズは `<W×H>`、背景は `<透過 or オフホワイト>`。」**

---

## 1. 共通仕様（全画像に適用）

### カラー（ブランドトークン）
| 役割 | HEX |
|------|-----|
| 背景（オフホワイト）| `#FBFBF9` |
| インク（ニアブラック）| `#14161A` |
| ネイビー（主）| `#12315F` / 最暗 `#0B213F` |
| ゴールド（アクセント）| `#B8901E` / 明 `#C9A227` |
| ロイヤルブルー（副・Power Angels）| `#2F5FE6` |

### トーン & デザインイメージ
- **ミニマル・エディトリアル／日本的な端正さ**（kokuyoリクルート系）
- **フラット＆線画主体**。光沢3D・グラスモーフィズム・過度なグラデは**禁止**
- 余白を大きく取り、**タイポグラフィのグリッドに調和**するモチーフ
- **文字・数字・ロゴ・透かしは一切入れない**（No text / letters / logo / watermark）
- マット、上質、控えめ。彩度は抑えめ（ネイビー＋ゴールドを主、ロイヤルブルーは1点のみ差し色）

### フォーマット & サイズの考え方
- **生成サイズは gpt-image-1 の対応値のみ**：`1024×1024`（正方形）/ `1536×1024`（横長）/ `1024×1536`（縦長）
- Webの最終サイズが違う場合は、生成後にトリミング／リサイズ（下表「Web最終」参照）
- **アイコン・アクセント＝PNG透過**、**背景・OGP＝PNG（→軽量化はJPG/WebP変換）**
- 公開用は **WebP変換推奨**（写真系）／透過アイコンはPNG維持

### Web視点の原則
1. **可読性優先**：テキストが乗る面（ヒーロー背景・OGP左側）は必ず“静かな余白”を残す
2. **軽量**：OGPは<300KB、背景は<500KBを目安（変換で調整）
3. **一貫性**：全素材で同一の線幅感・余白・配色に揃える（バラバラ厳禁）
4. **@2x想定**：Retina対応のため実表示の2倍解像度で生成→縮小配置

---

## 2. 生成画像 一覧リスト

| # | ファイル名 | 用途・配置 | 生成サイズ | Web最終 | 形式 | 背景 | 優先度 |
|---|-----------|-----------|-----------|---------|------|------|--------|
| 1 | `ogp.png` | OGP/SNSシェア（`og:image`）| 1536×1024 | 1200×630にトリミング | PNG→JPG | オフホワイト | ★必須 |
| 2 | `icon-512.png` | PWA/タッチアイコン | 1024×1024 | 512/192 | PNG | 透過 | ★必須 |
| 3 | `svc-hackii.png` | HackⅡ 事業アクセント | 1024×1024 | 正方形 | PNG | 透過 | ◎推奨 |
| 4 | `svc-crawl.png` | Pay per Crawl アクセント | 1024×1024 | 正方形 | PNG | 透過 | ◎推奨 |
| 5 | `svc-web.png` | Web制作・学生支援 アクセント | 1024×1024 | 正方形 | PNG | 透過 | ◎推奨 |
| 6 | `credo-visual.png` | 「探す→AIに聞く」キービジュアル | 1536×1024 | 横長フル幅 | PNG→WebP | オフホワイト | ○任意 |
| 7 | `hero-texture.png` | ヒーロー背景の極薄テクスチャ | 1536×1024 | フル幅 | PNG→WebP | オフホワイト | ○任意 |

> 保存先はすべて `trillionbank/assets/img/`。生成後に配置いただければ、サイトHTMLへの組み込み（サービス行への差し込み等）は私が行います。

---

## 3. プロンプト（英語本文＋日本語の頼み方）

各プロンプトの**冒頭に必ず以下の共通スタイル文を付けて**ください。

### 共通スタイル文（STYLE PREAMBLE）
```
Minimalist editorial Japanese corporate aesthetic. Off-white background (#FBFBF9).
Restrained palette: deep navy (#12315F) and muted gold (#B8901E) accents, with a
single royal-blue (#2F5FE6) highlight allowed. Flat, thin-line based, matte — no
glossy 3D, no glassmorphism, no heavy gradients. Sophisticated, generous negative
space, aligned to a clean typographic grid. Absolutely NO text, letters, numbers,
logos, or watermarks. High-end and understated.
```

### ① `ogp.png`（1536×1024・オフホワイト背景）
```
[STYLE PREAMBLE] Wide social-share key visual for an "AI search infrastructure"
company. A single elegant abstract motif in the upper-right: thin navy lines forming
a subtle search/query flow that converges into one small gold node. Leave the entire
left half as calm empty off-white space for an overlaid headline. Horizontal, premium,
quiet.
```
> 生成後：中央〜右を活かして **1200×630** にトリミング、JPG保存（<300KB）。

### ② `icon-512.png`（1024×1024・透過PNG）
```
[STYLE PREAMBLE] A single centered abstract mark: a minimal sprout / plumb-line
"growth" symbol — two thin navy strokes rising and splitting from a small open ring
at the bottom, topped with a small gold leaf accent. Transparent background. Iconic,
legible at tiny sizes, balanced padding around the mark.
```
> 既存ロゴSVGと世界観を揃える（葉＝ゴールド、軸＝ネイビー）。透過必須。

### ③ `svc-hackii.png`（1024×1024・透過PNG）
```
[STYLE PREAMBLE] Minimal thin-line icon for "AI search monitoring". A radar / scan
motif: concentric thin navy arcs with a few small detected nodes, exactly one node
highlighted in gold. Transparent background, centered, generous padding.
```

### ④ `svc-crawl.png`（1024×1024・透過PNG）
```
[STYLE PREAMBLE] Minimal thin-line icon for "AI crawler monetization". Stylized
crawler/bot paths drawn as thin navy lines flowing toward a single small gold
coin/value node. Transparent background, centered, generous padding.
```

### ⑤ `svc-web.png`（1024×1024・透過PNG）
```
[STYLE PREAMBLE] Minimal thin-line icon for "web building & student career support".
An ascending scaffold / sprout motif: thin navy lines rising as a structure or plant,
with a small gold accent at the apex. Transparent background, centered.
```

### ⑥ `credo-visual.png`（1536×1024・オフホワイト背景）
```
[STYLE PREAMBLE] Wide abstract editorial visual expressing the shift from "typing a
search" to "asking an AI". On the left: a few sparse thin navy horizontal lines like
an empty search field. They flow to the right and converge into one soft focal point
with a single gold highlight. Mostly empty off-white, horizontal, calm and premium.
```

### ⑦ `hero-texture.png`（1536×1024・オフホワイト背景）
```
[STYLE PREAMBLE] An extremely subtle, near-invisible background texture: faint thin
navy grid lines and a few sparse dot-nodes at very low contrast on off-white, fading
out toward all edges. It must read as almost white and quiet so that black headline
text placed on top stays fully readable. No focal object, no strong shapes.
```

---

## 4. 生成後の流れ
1. 生成物を `trillionbank/assets/img/` に保存（ファイル名は上表どおり）
2. 必要な変換（OGPは1200×630/JPG、背景系はWebP、アイコンは透過PNG維持）
3. 「生成した」と共有 → **HTMLへの組み込み（サービス行への差し込み・背景適用・OGP差し替え）は私が対応**します

## 5. 注意
- gpt-image-1 の**生成サイズは3種のみ**。表の「Web最終」は生成後の加工で合わせます。
- 透過が要るアイコンは、プロンプトに "transparent background" を明記（PNG出力）。
- 現状デザインはタイポ主体のため、**①②が必須、③〜⑤が推奨、⑥⑦は任意**。入れ過ぎるとkokuyo流の“静けさ”が損なわれるので、まずは①〜⑤を推奨します。
