# Codex CLI セットアップ & 画像生成ガイド

Regalis Japan Group コーポレートサイト用の Codex CLI 導入・運用手順。

## 1. インストール

```bash
bash scripts/setup-codex.sh
```

上記スクリプトが以下を自動実行します。

- `@openai/codex`（Codex CLI）のグローバルインストール／更新
- `~/.codex/config.toml` の雛形作成（未存在時のみ）
- 認証状態のチェック

手動で入れる場合:

```bash
npm install -g @openai/codex
codex --version   # => codex-cli 0.145.0 以上
```

## 2. 認証（ChatGPTアカウント）

```bash
codex login
```

- ブラウザが開き、ChatGPT アカウントでログインします。
- **ブラウザ認証が必要なため、ローカルPC（デスクトップ環境）で実行してください。**
  リモート／ヘッドレス環境ではブラウザを開けないためログインできません。
- ログイン後、認証情報は `~/.codex/` に保存されます。

確認:

```bash
codex doctor   # auth が ✓ になっていればOK
```

> API キーで動かす場合は `export OPENAI_API_KEY=sk-...` でも可。

## 3. 使い方

```bash
codex                       # 対話モードで起動（リポジトリ直下で）
codex exec "index.html のヒーローを改善して"   # 非対話でタスク実行
codex review                # コードレビュー
```

プロジェクトのガイドラインは `AGENTS.md` に定義済み。Codex は起動時にこれを読み込みます。

## 4. 画像生成（gpt-image-1）

Codex CLI 自体は画像生成機能を持たないため、OpenAI 画像API を使うスクリプトを同梱しています。

```bash
export OPENAI_API_KEY=sk-...       # 画像APIには API キーが必要
node scripts/gen-images.mjs        # 全プリセット生成
node scripts/gen-images.mjs hero   # 特定のプリセットのみ
```

- 出力先: `images/generated/<key>.png`
- プリセット（プロンプト・サイズ）は `scripts/gen-images.mjs` の `PRESETS` を編集して調整可能。
- ブランドスタイル（青→シアングラデ・白基調・テキストなし）は `BRAND_STYLE` に定義。

### 現在のプリセット

| キー | 用途 | サイズ |
|------|------|--------|
| `hero` | トップページ ヒーロー背景 | 1536x1024 |
| `ogp` | OGP / SNSシェア画像 | 1536x1024 |
| `service-aio-media` | SEO・AIOメディア運営 | 1024x1024 |
| `service-hackii` | HackⅡ AI引用モニタリング | 1024x1024 |
| `service-crawler` | AIクローラー収益化 | 1024x1024 |
| `service-dx` | AI・DX戦略コンサル | 1024x1024 |

## 5. Figma 連携（任意）

`~/.codex/config.toml` の Figma MCP 設定をコメント解除し、`FIGMA_ACCESS_TOKEN` を設定すると
Figma デザインを Codex から参照できます。
