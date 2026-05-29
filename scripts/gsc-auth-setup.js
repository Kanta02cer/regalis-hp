#!/usr/bin/env node
/**
 * GSC OAuth2 初回認証セットアップ
 * ============================================================
 * 使い方:
 *   node scripts/gsc-auth-setup.js
 *
 * 必要なもの (事前に取得):
 *   GCP Console → 「APIとサービス」→「認証情報」→「+ 認証情報を作成」
 *   → OAuth 2.0 クライアント ID → 種類: ウェブアプリケーション
 *   → 承認済みリダイレクトURI: http://localhost:4829/oauth2callback
 *   → クライアントID と クライアントシークレット を aio-config.json に設定
 *
 * 実行結果:
 *   scripts/gsc-tokens.json が生成される → 以後 npm run aio-report で自動使用
 * ============================================================
 */

'use strict';

const fs      = require('fs');
const path    = require('path');
const http    = require('http');
const https   = require('https');
const { exec } = require('child_process');

const CONFIG_PATH = path.join(__dirname, 'aio-config.json');
const TOKENS_PATH = path.join(__dirname, 'gsc-tokens.json');
const PORT        = 4829;
const REDIRECT    = `http://localhost:${PORT}`;

// ANSI colors
const g = (t) => `\x1b[32m${t}\x1b[0m`;
const r = (t) => `\x1b[31m${t}\x1b[0m`;
const y = (t) => `\x1b[33m${t}\x1b[0m`;
const b = (t) => `\x1b[1m${t}\x1b[0m`;
const dim = (t) => `\x1b[90m${t}\x1b[0m`;

// ── Config ────────────────────────────────────────────────────
if (!fs.existsSync(CONFIG_PATH)) {
  console.error(r('✗ scripts/aio-config.json が見つかりません'));
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const clientId     = config.google?.oauth2ClientId;
const clientSecret = config.google?.oauth2ClientSecret;

if (!clientId || !clientSecret) {
  console.log('');
  console.log(b('GSC OAuth2 セットアップ — クライアントIDが未設定'));
  console.log('');
  console.log('以下の手順で GCP Console から取得してください：');
  console.log('');
  console.log(b('① GCP Console にアクセス'));
  console.log('   https://console.cloud.google.com/apis/credentials?project=regalis-erp');
  console.log('');
  console.log(b('② 「+ 認証情報を作成」→「OAuth 2.0 クライアント ID」'));
  console.log('   種類: ウェブ アプリケーション');
  console.log('   名前: AIO Report (任意)');
  console.log('   承認済みリダイレクト URI に追加:');
  console.log(y(`   → http://localhost:${PORT}/oauth2callback`));
  console.log('');
  console.log(b('③ 取得したIDを aio-config.json に設定:'));
  console.log(dim('   "google": {'));
  console.log(dim('     "oauth2ClientId":     "YOUR_CLIENT_ID.apps.googleusercontent.com",'));
  console.log(dim('     "oauth2ClientSecret": "YOUR_CLIENT_SECRET",'));
  console.log(dim('     ...'));
  console.log(dim('   }'));
  console.log('');
  console.log('設定後、もう一度このスクリプトを実行してください。');
  console.log('');
  process.exit(1);
}

// ── OAuth2 flow ───────────────────────────────────────────────
const SCOPE = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
].join(' ');

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id:     clientId,
  redirect_uri:  REDIRECT,
  response_type: 'code',
  scope:         SCOPE,
  access_type:   'offline',
  prompt:        'consent',
}).toString();

console.log('');
console.log(b('╔═══════════════════════════════════════════════════╗'));
console.log(b('║  GSC OAuth2 認証セットアップ                      ║'));
console.log(b('╚═══════════════════════════════════════════════════╝'));
console.log('');
console.log('ブラウザで以下のURLを開いて、GSCアクセス権限のあるGoogleアカウントで');
console.log('ログインして「許可」をクリックしてください。');
console.log('');
console.log(y('認証URL:'));
console.log(authUrl);
console.log('');

// Auto-open browser
const openBrowser = (url) => {
  const cmd = process.platform === 'darwin' ? `open "${url}"`
    : process.platform === 'win32' ? `start "" "${url}"`
    : `xdg-open "${url}"`;
  exec(cmd, (err) => { if (err) console.log(dim('(ブラウザを手動で開いてください)')); });
};
openBrowser(authUrl);

// Start local server to catch OAuth2 callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  // Desktop app: Google redirects to http://localhost:PORT (no path)
  if (url.pathname !== '/' && url.pathname !== '/oauth2callback') {
    res.end('Not found'); return;
  }

  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>認証エラー: ${error}</h2>`);
    console.error(r('✗ 認証がキャンセルされました: ' + error));
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.end('No code'); return;
  }

  // Exchange code for tokens
  try {
    const tokens = await exchangeCodeForTokens(clientId, clientSecret, code, REDIRECT);

    fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:sans-serif;padding:40px;background:#0a0a0a;color:#fff">
        <h2 style="color:#4ade80">✅ 認証完了</h2>
        <p>GSC への接続が完了しました。このタブを閉じてください。</p>
        <p style="color:#666">トークン保存先: scripts/gsc-tokens.json</p>
      </body></html>
    `);

    console.log('');
    console.log(g('✅ 認証完了！'));
    console.log(g('   トークン保存: scripts/gsc-tokens.json'));
    console.log('');
    console.log('以後は npm run aio-report で GSC データが自動取得されます。');
    console.log('');

    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h2>エラー: ${e.message}</h2>`);
    console.error(r('✗ トークン取得エラー: ' + e.message));
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(dim(`ローカルサーバー待機中: http://localhost:${PORT} ...`));
  console.log(dim('(ブラウザで認証後、このウィンドウに自動で結果が表示されます)'));
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(r(`✗ ポート ${PORT} が使用中です。他のプロセスを終了してください。`));
  } else {
    console.error(r('✗ サーバーエラー: ' + e.message));
  }
  process.exit(1);
});

// ── Token exchange ────────────────────────────────────────────
function exchangeCodeForTokens(clientId, clientSecret, code, redirectUri) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      code,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path:     '/token',
      method:   'POST',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
    }, (res) => {
      let data = '';
      res.on('data', d => { data += d; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error_description || parsed.error));
          else resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
