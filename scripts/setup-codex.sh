#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# setup-codex.sh — Codex CLI インストール & セットアップ
# Regalis Japan Group コーポレートサイト用
#
# 使い方:
#   bash scripts/setup-codex.sh
#
# 前提: Node.js 18+ / npm が利用可能なこと
# ─────────────────────────────────────────────────────────────
set -euo pipefail

echo "▶ Codex CLI セットアップを開始します"

# 1) Node / npm チェック
if ! command -v npm >/dev/null 2>&1; then
  echo "✗ npm が見つかりません。Node.js 18+ をインストールしてください。" >&2
  exit 1
fi
echo "  node: $(node --version)  /  npm: $(npm --version)"

# 2) Codex CLI インストール（未導入 or 更新）
if command -v codex >/dev/null 2>&1; then
  echo "  codex は既に導入済み: $(codex --version)"
  echo "  更新を確認します..."
  npm install -g @openai/codex
else
  echo "  Codex CLI をインストールします..."
  npm install -g @openai/codex
fi
echo "  ✓ $(codex --version)"

# 3) CODEX_HOME 設定ファイルの用意（存在しなければ雛形を作成）
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
mkdir -p "$CODEX_HOME"
if [ ! -f "$CODEX_HOME/config.toml" ]; then
  cat > "$CODEX_HOME/config.toml" << 'TOML'
# Codex CLI 基本設定 — Regalis Japan Group
# 認証は `codex login`（ChatGPTアカウント）または OPENAI_API_KEY で行う

approval_policy = "on-request"
sandbox_mode   = "workspace-write"

# Figma 連携を使う場合は FIGMA_ACCESS_TOKEN を設定してコメント解除
# [mcp_servers.figma]
# command = "npx"
# args = ["-y", "figma-developer-mcp", "--stdio"]
# [mcp_servers.figma.env]
# FIGMA_ACCESS_TOKEN = "<your-token>"
TOML
  echo "  ✓ $CODEX_HOME/config.toml を作成しました"
else
  echo "  $CODEX_HOME/config.toml は既に存在します（変更しません）"
fi

# 4) 認証状態チェック
echo ""
echo "▶ 認証状態:"
if codex doctor 2>&1 | grep -q "no Codex credentials"; then
  echo "  ✗ 未認証です。次のいずれかで認証してください:"
  echo "      A) codex login                （ChatGPTアカウントでログイン）"
  echo "      B) export OPENAI_API_KEY=sk-… （APIキーを環境変数で指定）"
else
  echo "  ✓ 認証済み"
fi

echo ""
echo "▶ 動作確認: codex doctor で全体を確認できます"
echo "✓ セットアップ完了"
