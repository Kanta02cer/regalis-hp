#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

PREVIEW_DIR=".preview"
PID_FILE="$PREVIEW_DIR/jekyll.pid"
LOG_FILE="$PREVIEW_DIR/jekyll.log"
PREVIEW_PATH="/lp/hack2/founding-monitor/"
PREVIEW_URL="http://127.0.0.1:4000${PREVIEW_PATH}"

mkdir -p "$PREVIEW_DIR"

if curl -fsS "$PREVIEW_URL" >/dev/null 2>&1; then
  echo "Hack II LP preview is already running: $PREVIEW_URL"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" >/dev/null 2>&1; then
    kill "$OLD_PID" >/dev/null 2>&1 || true
    sleep 1
  fi
  rm -f "$PID_FILE"
fi

: > "$LOG_FILE"

JEKYLL_ENV=development nohup bundle exec jekyll serve \
  --host 0.0.0.0 \
  --port 4000 \
  --livereload \
  --force_polling \
  > "$LOG_FILE" 2>&1 &

SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"

echo "Starting Hack II LP preview (PID: $SERVER_PID)..."

for _ in $(seq 1 120); do
  if curl -fsS "$PREVIEW_URL" >/dev/null 2>&1; then
    echo "Preview ready: $PREVIEW_URL"
    echo "Log: $ROOT_DIR/$LOG_FILE"
    exit 0
  fi

  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "Jekyll preview stopped before becoming ready." >&2
    tail -n 120 "$LOG_FILE" >&2 || true
    exit 1
  fi

  sleep 1
done

echo "Timed out while waiting for the Jekyll preview." >&2
tail -n 120 "$LOG_FILE" >&2 || true
exit 1
