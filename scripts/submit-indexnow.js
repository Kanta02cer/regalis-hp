#!/usr/bin/env node
/**
 * IndexNow 一括URL送信スクリプト
 * Google / Bing / Yandex / Naver に全ページのインデックスをリクエスト
 *
 * 使い方:
 *   node scripts/submit-indexnow.js          # 全URL送信
 *   node scripts/submit-indexnow.js --dry    # URLリスト確認のみ
 */
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── 設定 ──────────────────────────────────────────────────────
const SITE_URL = 'https://trillion-bank.jp';
const INDEXNOW_KEY = 'b8f3e2d1c4a57690';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// ── 静的ページ一覧 ───────────────────────────────────────────
const STATIC_PAGES = [
  // ルート
  '/',

  // 実績・LP
  '/results/',
  '/lp/hack2/founding-monitor/',
  '/download/',

  // 法務（実コンテンツのみ）
  '/tokushoho.html',

  // トリリオンバンク セクション
  '/trillionbank/business/',
  '/trillionbank/business/hack2/',
  '/trillionbank/business/pay-per-crawl/',
  '/trillionbank/business/media-operation/',
  '/trillionbank/business/dx-consulting/',
  '/trillionbank/business/web-development/',
  '/trillionbank/business/sales-promotion/',
  '/trillionbank/business/ai-coupon/',
  '/trillionbank/business/student-ambassador/',
  '/trillionbank/mission/',
  '/trillionbank/company/',
  '/trillionbank/ceo/',
  '/trillionbank/media/',
  '/trillionbank/media/archive/',
  '/trillionbank/contact/',
  '/trillionbank/meeting/',
  '/trillionbank/guide/inhouse-or-outsource/',
  '/trillionbank/guide/agency-co-proposal/',
  '/trillionbank/guide/hackii-geo-service-manual/',
  '/trillionbank/privacy/',
  '/trillionbank/terms/',
  '/trillionbank/security/',

  // AI最適化ファイル
  '/llms.txt',
  '/llms-full.txt',
  '/knowledge.json',
  '/ai-patch.json',
  '/site-structure.json',

  // フィード
  '/feed.xml',
  '/sitemap.xml',
  '/sitemap-news.xml',
  '/sitemap-index.xml',
];

// ── _tbnews 記事URLを収集（現在の正規記事）─────────────────────
function collectArticleUrls() {
  const urls = [];
  const tbnewsDir = path.join(__dirname, '..', '_tbnews');

  // _tbnews → /trillionbank/news/:slug/
  if (fs.existsSync(tbnewsDir)) {
    for (const file of fs.readdirSync(tbnewsDir)) {
      if (!file.endsWith('.md') || file.startsWith('_')) continue;
      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      urls.push(`/trillionbank/news/${slug}/`);
    }
  }

  return urls;
}

// ── IndexNow API送信 ─────────────────────────────────────────
function submitToIndexNow(engine, urlList) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: 'trillion-bank.jp',
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList,
    });

    const options = {
      hostname: engine,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ engine, status: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      resolve({ engine, status: 'ERROR', body: err.message });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ engine, status: 'TIMEOUT', body: 'Request timed out' });
    });

    req.write(body);
    req.end();
  });
}

// ── メイン ────────────────────────────────────────────────────
async function main() {
  const isDry = process.argv.includes('--dry');
  const articleUrls = collectArticleUrls();
  const allPaths = [...STATIC_PAGES, ...articleUrls];
  const allUrls = allPaths.map((p) => `${SITE_URL}${p}`);

  console.log(`\n📊 URL統計:`);
  console.log(`   静的ページ:  ${STATIC_PAGES.length}`);
  console.log(`   記事ページ:  ${articleUrls.length}`);
  console.log(`   合計:        ${allUrls.length}\n`);

  if (isDry) {
    console.log('── URL一覧（--dry モード）──────────────────');
    allUrls.forEach((u, i) => console.log(`  ${String(i + 1).padStart(3)}. ${u}`));
    console.log(`\n✅ ${allUrls.length} URLs を送信予定（実行するには --dry を外す）`);
    return;
  }

  // IndexNow は1リクエスト最大10,000 URLだが、念のため500件ずつ分割
  const BATCH_SIZE = 500;
  const engines = ['api.indexnow.org', 'www.bing.com', 'yandex.com'];

  console.log('🚀 IndexNow 送信開始...\n');

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`── バッチ ${batchNum} (${batch.length} URLs) ──`);

    const results = await Promise.all(
      engines.map((engine) => submitToIndexNow(engine, batch))
    );

    for (const r of results) {
      const icon = r.status === 200 || r.status === 202 ? '✅' : '⚠️';
      console.log(`  ${icon} ${r.engine.padEnd(20)} → ${r.status}`);
    }
    console.log('');
  }

  console.log(`✅ 完了: ${allUrls.length} URLs を ${engines.length} エンジンに送信しました`);
  console.log(`\n📋 次のステップ:`);
  console.log(`   1. GSC (search.google.com/search-console) でサイトマップ送信を確認`);
  console.log(`   2. URL検査ツールで主要ページのインデックス状態を確認`);
  console.log(`   3. 数日後にカバレッジレポートを確認\n`);
}

main().catch(console.error);
