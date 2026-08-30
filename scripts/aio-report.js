#!/usr/bin/env node
/**
 * AIO Daily Report Generator — Trillion Bank
 * ============================================================
 * Usage:
 *   npm run aio-report                  # Standard run
 *   node scripts/aio-report.js          # Direct
 *   node scripts/aio-report.js --json   # JSON output only
 *
 * Data levels (automatic, based on what's configured):
 *   Lv1  Always:         aio-scores.json + site health checks
 *   Lv2  GSC key:        Google Search Console performance
 *   Lv3  GA4 key:        AI referral traffic breakdown (AIモデル別)
 *   Lv4  Gemini API key: AI citation check + sentiment + misinformation detection
 *                        (無料: https://ai.google.dev/ で取得)
 *
 * Setup: scripts/aio-config.json を編集して API キーを入力。
 *        Google サービスアカウント: scripts/google-service-account.json に配置済み。
 * ============================================================
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ── paths ────────────────────────────────────────────────────
const ROOT        = path.join(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'aio-config.json');
const REPORTS_DIR = path.join(ROOT, 'reports');
const SCORES_PATH = path.join(ROOT, 'aio-scores.json');

// ── cli args ─────────────────────────────────────────────────
const args = process.argv.slice(2);
const FLAG_JSON = args.includes('--json');
const FLAG_QUIET = args.includes('--quiet');

// ── ansi colors (degrades gracefully in non-tty) ─────────────
const isTTY = process.stdout.isTTY;
const c = {
  reset:   isTTY ? '\x1b[0m'  : '',
  bold:    isTTY ? '\x1b[1m'  : '',
  dim:     isTTY ? '\x1b[2m'  : '',
  red:     isTTY ? '\x1b[31m' : '',
  green:   isTTY ? '\x1b[32m' : '',
  yellow:  isTTY ? '\x1b[33m' : '',
  blue:    isTTY ? '\x1b[34m' : '',
  cyan:    isTTY ? '\x1b[36m' : '',
  gray:    isTTY ? '\x1b[90m' : '',
};
const col  = (t, k) => `${c[k] || ''}${t}${c.reset}`;
const bold = (t)    => col(t, 'bold');

function scoreColor(n) {
  return n >= 80 ? 'green' : n >= 60 ? 'yellow' : 'red';
}
function scoreEmoji(n) {
  return n >= 80 ? '✅' : n >= 60 ? '⚠️ ' : '❌';
}
function pct(n, d) {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}
function bar(score, len = 20) {
  const f = Math.round((score / 100) * len);
  return '█'.repeat(f) + '░'.repeat(len - f);
}
function today() {
  return new Date().toISOString().split('T')[0];
}
function httpGet(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    const req = mod.get(url, { timeout: timeoutMs }, (res) => {
      let body = '';
      res.on('data', d => { body += d; });
      res.on('end',  () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error',   reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── config ───────────────────────────────────────────────────
function loadConfig() {
  const defaults = {
    site: {
      url:  'https://trillion-bank.jp',
      name: '株式会社トリリオンバンク',
    },
    google: {
      serviceAccountKeyFile: null,
      gscSiteUrl:  'https://trillion-bank.jp/',
      ga4PropertyId: null,
    },
    perplexity: { apiKey: null },
    targetQueries: [
      'DXコンサルティング 中小企業 おすすめ',
      'SEO AIOメディア運営 外注 費用',
      'LLMO対策 会社 選び方',
      'AI検索最適化 とは',
      '株式会社トリリオンバンク',
    ],
    output: {
      dir:     path.join(ROOT, 'reports'),
      formats: ['md', 'console'],
    },
  };

  if (!fs.existsSync(CONFIG_PATH)) return defaults;
  try {
    const user = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    // Deep merge
    return {
      ...defaults,
      ...user,
      google:     { ...defaults.google,     ...(user.google     || {}) },
      perplexity: { ...defaults.perplexity, ...(user.perplexity || {}) },
      output:     { ...defaults.output,     ...(user.output     || {}) },
      targetQueries: user.targetQueries || defaults.targetQueries,
    };
  } catch {
    return defaults;
  }
}

// ════════════════════════════════════════════════════════════════
// MODULE 1 — AICS™ スコアデータ読み込み & 分析
// ════════════════════════════════════════════════════════════════
function loadScoreData() {
  if (!fs.existsSync(SCORES_PATH)) {
    return { status: 'missing', note: 'aio-scores.json が見つかりません' };
  }
  const data = JSON.parse(fs.readFileSync(SCORES_PATH, 'utf8'));

  const articles = data.articles || [];
  const now      = new Date();
  const cutoff30 = new Date(now - 30 * 86400000);
  const cutoff7  = new Date(now - 7  * 86400000);

  const recent30 = articles.filter(a => new Date(a.date) >= cutoff30);
  const recent7  = articles.filter(a => new Date(a.date) >= cutoff7);

  // Dimension weakness analysis
  const dims = {
    D1: { label: 'AI引用確率',   max: 25, avg: data.dimension_averages?.D1_ai_citation      || 0 },
    D2: { label: 'エンティティ強度', max: 20, avg: data.dimension_averages?.D2_entity_strength  || 0 },
    D3: { label: '成約導線',     max: 25, avg: data.dimension_averages?.D3_conversion_path   || 0 },
    D4: { label: '信頼性・権威性', max: 15, avg: data.dimension_averages?.D4_trust_authority   || 0 },
    D5: { label: 'コンテンツ構造', max: 10, avg: data.dimension_averages?.D5_content_structure || 0 },
    D6: { label: '鮮度・具体性',  max: 5,  avg: data.dimension_averages?.D6_freshness         || 0 },
  };

  // Articles needing attention (grade C or below)
  const lowScoreArticles = articles
    .filter(a => a.score < 75)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  // Previous report delta (compare with last saved report)
  let delta = null;
  const prevPath = getMostRecentReport();
  if (prevPath) {
    try {
      const prevContent = fs.readFileSync(prevPath, 'utf8');
      const prevMatch   = prevContent.match(/総合スコア.*?(\d+)\s*\/\s*100/);
      if (prevMatch) {
        const prevScore = parseInt(prevMatch[1]);
        delta = data.site_score.total - prevScore;
      }
    } catch { /* skip */ }
  }

  return {
    status:   'ok',
    generated_at: data.generated_at,
    siteScore:    data.site_score,
    articleCount: data.article_count || articles.length,
    articleAvg:   data.article_average,
    topArticle:   data.top_article,
    lowestArticle: data.lowest_article,
    gradeDistribution: data.grade_distribution,
    dims,
    recent30Count: recent30.length,
    recent7Count:  recent7.length,
    lowScoreArticles,
    delta,
  };
}

function getMostRecentReport() {
  if (!fs.existsSync(REPORTS_DIR)) return null;
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(f => f.endsWith('-aio-report.md'))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(REPORTS_DIR, files[0]) : null;
}

// ════════════════════════════════════════════════════════════════
// MODULE 2 — サイトヘルスチェック（ライブ確認）
// ════════════════════════════════════════════════════════════════
async function runSiteHealthCheck(config) {
  const checks = [];

  const endpoints = [
    { path: '/',              label: 'トップページ',      critical: true  },
    { path: '/llms.txt',      label: 'llms.txt',          critical: true  },
    { path: '/llms-full.txt', label: 'llms-full.txt',     critical: false },
    { path: '/robots.txt',    label: 'robots.txt',        critical: true  },
    { path: '/sitemap.xml',   label: 'sitemap.xml',       critical: false },
    { path: '/ai-patch.json', label: 'ai-patch.json',     critical: false },
    { path: '/knowledge.json','label': 'knowledge.json',  critical: false },
    { path: '/feed.xml',      label: 'feed.xml',          critical: false },
  ];

  await Promise.all(endpoints.map(async (ep) => {
    const url = config.site.url + ep.path;
    try {
      const res = await httpGet(url, 6000);
      const ok  = res.status >= 200 && res.status < 400;
      checks.push({
        label:    ep.path,
        name:     ep.label,
        status:   ok ? 'ok' : 'error',
        httpCode: res.status,
        critical: ep.critical,
        note:     ok ? null : `HTTP ${res.status}`,
      });
    } catch (e) {
      checks.push({
        label:    ep.path,
        name:     ep.label,
        status:   'error',
        httpCode: null,
        critical: ep.critical,
        note:     e.message,
      });
    }
  }));

  // Check llms.txt for merge conflict residue
  const llmsLocal = path.join(ROOT, 'llms.txt');
  if (fs.existsSync(llmsLocal)) {
    const content = fs.readFileSync(llmsLocal, 'utf8');
    if (content.includes('<<<<<<<') || content.includes('>>>>>>>')) {
      checks.push({
        label: 'llms.txt (ローカル)',
        name: 'llms.txt マージコンフリクト',
        status: 'warn',
        httpCode: null,
        critical: true,
        note: 'マージコンフリクトマーカーが残っています',
      });
    }
  }

  const allOk    = checks.filter(c => c.status === 'ok').length;
  const critFail = checks.filter(c => c.status !== 'ok' && c.critical).length;

  return { status: critFail === 0 ? 'ok' : 'error', checks, allOk, total: checks.length };
}

// ════════════════════════════════════════════════════════════════
// MODULE 3 — Google Search Console
//   認証: OAuth2 (scripts/gsc-tokens.json) — gsc-auth-setup.js で生成
//   ※ GSCはサービスアカウントをUIから追加できないためOAuth2必須
// ════════════════════════════════════════════════════════════════
async function runGSC(config) {
  if (!config.google.gscSiteUrl) {
    return { status: 'skipped', reason: 'gscSiteUrl未設定' };
  }

  let google;
  try { ({ google } = require('googleapis')); }
  catch { return { status: 'skipped', reason: 'googleapis未インストール — npm install googleapis' }; }

  const TOKENS_PATH  = path.join(__dirname, 'gsc-tokens.json');
  const clientId     = config.google.oauth2ClientId;
  const clientSecret = config.google.oauth2ClientSecret;

  // OAuth2トークンが未生成の場合はセットアップ案内
  if (!fs.existsSync(TOKENS_PATH)) {
    return {
      status: 'skipped',
      reason: 'GSC認証未完了',
      howto:  'node scripts/gsc-auth-setup.js を実行して一度だけ認証してください',
    };
  }

  if (!clientId || !clientSecret) {
    return {
      status: 'skipped',
      reason: 'OAuth2クライアントID未設定',
      howto:  'GCP Console で OAuth2 クライアントIDを作成し aio-config.json に設定してください',
    };
  }

  try {
    const tokens       = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:4829');
    oauth2Client.setCredentials(tokens);

    // アクセストークン自動更新
    oauth2Client.on('tokens', (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      fs.writeFileSync(TOKENS_PATH, JSON.stringify(merged, null, 2), 'utf8');
    });

    const sc = google.searchconsole({ version: 'v1', auth: oauth2Client });

    // 利用可能なサイト一覧を取得して正しいURLを自動解決
    let siteUrl = config.google.gscSiteUrl;
    try {
      const sitesRes = await sc.sites.list();
      const sites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl);
      const host  = siteUrl.replace(/https?:\/\//, '').replace(/\/$/, '');
      const match = sites.find(s =>
        s.replace(/https?:\/\//, '').replace(/\/$/, '') === host ||
        s === `sc-domain:${host}` ||
        s === siteUrl
      );
      if (match) siteUrl = match;
    } catch { /* サイト一覧取得失敗時は設定値をそのまま使用 */ }

    const end   = new Date();
    const start = new Date(end - 30 * 86400000);
    const fmt   = (d) => d.toISOString().split('T')[0];

    const [perfRes, queryRes, pageRes] = await Promise.all([
      sc.searchanalytics.query({
        siteUrl,
        requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: ['date'], rowLimit: 30 },
      }),
      sc.searchanalytics.query({
        siteUrl,
        requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: ['query'], rowLimit: 20 },
      }),
      sc.searchanalytics.query({
        siteUrl,
        requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: ['page'], rowLimit: 10 },
      }),
    ]);

    const rows      = perfRes.data.rows || [];
    const clicks    = rows.reduce((s, r) => s + (r.clicks      || 0), 0);
    const impress   = rows.reduce((s, r) => s + (r.impressions || 0), 0);
    const avgCtr    = impress > 0 ? (clicks / impress * 100).toFixed(2) : '0.00';
    const avgPos    = rows.length > 0
      ? (rows.reduce((s, r) => s + (r.position || 0), 0) / rows.length).toFixed(1)
      : 'N/A';

    const rows7      = rows.slice(-7);
    const rowsPrev7  = rows.slice(-14, -7);
    const clicks7    = rows7.reduce((s, r)     => s + (r.clicks || 0), 0);
    const clicksPrev = rowsPrev7.reduce((s, r) => s + (r.clicks || 0), 0);
    const clicksDelta = clicksPrev > 0 ? Math.round((clicks7 - clicksPrev) / clicksPrev * 100) : null;

    return {
      status: 'ok',
      authMethod: 'OAuth2',
      period: `${fmt(start)} 〜 ${fmt(end)}`,
      clicks, impress,
      avgCtr:   avgCtr + '%',
      avgPos,
      clicks7,
      clicksDelta,
      topQueries: (queryRes.data.rows || []).slice(0, 10).map(r => ({
        query:       r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
        ctr:         (r.ctr * 100).toFixed(1) + '%',
        position:    r.position.toFixed(1),
      })),
      topPages: (pageRes.data.rows || []).slice(0, 5).map(r => ({
        page:    r.keys[0].replace(config.google.gscSiteUrl, '/'),
        clicks:  r.clicks,
        impress: r.impressions,
      })),
    };
  } catch (e) {
    // トークン期限切れの場合はセットアップ案内
    if (e.message?.includes('invalid_grant') || e.message?.includes('Token has been expired')) {
      return { status: 'error', reason: 'OAuth2トークン期限切れ — node scripts/gsc-auth-setup.js を再実行してください' };
    }
    if (e.message?.includes('permission') || e.message?.includes('Permission')) {
      // 利用可能なサイト一覧を取得して診断情報を付加
      try {
        const tokens2       = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
        const oa2           = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:4829');
        oa2.setCredentials(tokens2);
        const sc2           = google.searchconsole({ version: 'v1', auth: oa2 });
        const sitesRes      = await sc2.sites.list();
        const available     = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).join(', ') || '(なし)';
        return { status: 'error', reason: `権限エラー。利用可能なプロパティ: ${available} — aio-config.json の gscSiteUrl を合わせてください` };
      } catch { /* ignore */ }
    }
    return { status: 'error', reason: e.message };
  }
}

// ════════════════════════════════════════════════════════════════
// MODULE 4 — Google Analytics 4 AI流入解析 (optional)
// ════════════════════════════════════════════════════════════════

// リファラーでAIプラットフォームを判定するルール
const AI_SOURCE_RULES = [
  { pattern: /chatgpt\.com|chat\.openai\.com/i,   label: 'ChatGPT',     model: 'OpenAI'    },
  { pattern: /perplexity\.ai/i,                   label: 'Perplexity',  model: 'Perplexity'},
  { pattern: /claude\.ai/i,                       label: 'Claude',      model: 'Anthropic' },
  { pattern: /gemini\.google\.com|bard\.google/i, label: 'Gemini',      model: 'Google'    },
  { pattern: /bing\.com.*copilot|copilot\./i,     label: 'Copilot',     model: 'Microsoft' },
  { pattern: /you\.com/i,                         label: 'You.com',     model: 'You.com'   },
  { pattern: /phind\.com/i,                       label: 'Phind',       model: 'Phind'     },
  { pattern: /kagi\.com/i,                        label: 'Kagi',        model: 'Kagi'      },
  { pattern: /utm_source=chatgpt/i,               label: 'ChatGPT (UTM)', model: 'OpenAI'  },
];

async function runGA4(config) {
  if (!config.google.ga4PropertyId) {
    return { status: 'skipped', reason: 'ga4PropertyId未設定' };
  }

  let google;
  try { ({ google } = require('googleapis')); }
  catch { return { status: 'skipped', reason: 'googleapis未インストール' }; }

  // OAuth2トークンで認証（gsc-auth-setup.js で取得済み）
  const TOKENS_PATH  = path.join(__dirname, 'gsc-tokens.json');
  const clientId     = config.google.oauth2ClientId;
  const clientSecret = config.google.oauth2ClientSecret;

  if (!fs.existsSync(TOKENS_PATH)) {
    return {
      status: 'skipped',
      reason: 'OAuth2認証未完了 — node scripts/gsc-auth-setup.js を実行してください',
    };
  }
  if (!clientId || !clientSecret) {
    return { status: 'skipped', reason: 'OAuth2クライアントID未設定' };
  }

  try {
    const tokens       = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:4829');
    oauth2Client.setCredentials(tokens);
    oauth2Client.on('tokens', (newTokens) => {
      fs.writeFileSync(TOKENS_PATH, JSON.stringify({ ...tokens, ...newTokens }, null, 2));
    });

    const ga = google.analyticsdata({ version: 'v1beta', auth: oauth2Client });

    const [trafficRes, landingRes] = await Promise.all([
      // AI流入元別セッション
      ga.properties.runReport({
        property: `properties/${config.google.ga4PropertyId}`,
        requestBody: {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
          metrics: [
            { name: 'sessions' },
            { name: 'conversions' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 100,
        },
      }),
      // AIランディングページ
      ga.properties.runReport({
        property: `properties/${config.google.ga4PropertyId}`,
        requestBody: {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionSource' }, { name: 'landingPagePlusQueryString' }],
          metrics: [{ name: 'sessions' }, { name: 'conversions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 50,
        },
      }),
    ]);

    // Filter AI rows
    const allRows = trafficRes.data.rows || [];
    const aiRows  = allRows.filter(r => {
      const src = (r.dimensionValues[0].value || '').toLowerCase();
      const med = (r.dimensionValues[1].value || '').toLowerCase();
      return AI_SOURCE_RULES.some(rule => rule.pattern.test(src + ' ' + med));
    });

    const totalAiSessions     = aiRows.reduce((s, r) => s + Number(r.metricValues[0].value || 0), 0);
    const totalAiConversions  = aiRows.reduce((s, r) => s + Number(r.metricValues[1].value || 0), 0);
    const aiCvr               = totalAiSessions > 0
      ? (totalAiConversions / totalAiSessions * 100).toFixed(2) + '%' : 'N/A';

    // Model breakdown
    const modelBreakdown = {};
    for (const row of aiRows) {
      const src   = row.dimensionValues[0].value || '';
      const rule  = AI_SOURCE_RULES.find(r => r.pattern.test(src));
      const label = rule ? rule.label : src;
      const sess  = Number(row.metricValues[0].value || 0);
      const cvs   = Number(row.metricValues[1].value || 0);
      if (!modelBreakdown[label]) modelBreakdown[label] = { sessions: 0, conversions: 0 };
      modelBreakdown[label].sessions    += sess;
      modelBreakdown[label].conversions += cvs;
    }

    // AI landing pages
    const aiLandingRows = (landingRes.data.rows || []).filter(r => {
      const src = (r.dimensionValues[0].value || '').toLowerCase();
      return AI_SOURCE_RULES.some(rule => rule.pattern.test(src));
    });
    const topLandingPages = aiLandingRows
      .slice(0, 5)
      .map(r => ({
        page:    r.dimensionValues[1].value,
        sessions: Number(r.metricValues[0].value || 0),
        cvs:     Number(r.metricValues[1].value || 0),
      }));

    return {
      status: 'ok',
      period: '過去30日',
      totalAiSessions,
      totalAiConversions,
      aiCvr,
      modelBreakdown: Object.entries(modelBreakdown)
        .map(([label, d]) => ({ label, ...d }))
        .sort((a, b) => b.sessions - a.sessions),
      topLandingPages,
    };
  } catch (e) {
    if (e.message?.includes('invalid_grant') || e.message?.includes('Invalid Credentials') || e.message?.includes('Token has been expired')) {
      return { status: 'error', reason: 'Invalid Credentials — OAuth2トークン期限切れ' };
    }
    return { status: 'error', reason: e.message };
  }
}

// ════════════════════════════════════════════════════════════════
// MODULE 5 — Gemini AI 引用チェック + センチメント + 誤情報検知
//            無料: https://ai.google.dev/ で API キー取得
// ════════════════════════════════════════════════════════════════
async function runCitationCheck(config) {
  if (!config.gemini?.apiKey) {
    return {
      status:  'skipped',
      reason:  'Gemini APIキー未設定',
      howto:   'https://ai.google.dev/ → 「Get API key」で無料取得 → aio-config.json の gemini.apiKey に設定',
    };
  }

  let GoogleGenerativeAI;
  try {
    ({ GoogleGenerativeAI } = require('@google/generative-ai'));
  } catch {
    return { status: 'error', reason: '@google/generative-ai 未インストール (npm install)' };
  }

  const genAI    = new GoogleGenerativeAI(config.gemini.apiKey);
  const model    = config.gemini.model || 'gemini-2.0-flash';
  const siteHost = config.site.url.replace(/https?:\/\//, '').replace(/\/$/, '');
  const results  = [];
  let cited = 0;

  // ── 5クエリ：Google Search Grounding で引用チェック ────────
  const totalQ = Math.min(config.targetQueries.length, 5);
  for (const [qi, query] of config.targetQueries.slice(0, 5).entries()) {
    if (!FLAG_QUIET) process.stdout.write(col(`\r      クエリ ${qi+1}/${totalQ}: ${query.substring(0,30)}…`, 'gray') + '    ');
    try {
      const searchModel = genAI.getGenerativeModel({
        model,
        tools: [{ googleSearch: {} }],
      });

      const result   = await searchModel.generateContent(query);
      const response = result.response;
      const text     = response.text();
      const candidate = response.candidates?.[0] || {};
      const gMeta    = candidate.groundingMetadata || {};

      // 引用URL一覧（Google Search Grounding のソース）
      const citations = (gMeta.groundingChunks || [])
        .map(chunk => chunk.web?.uri || '')
        .filter(Boolean);

      // Gemini が実際に行った検索クエリ
      const searchQueries = gMeta.webSearchQueries || [];

      const isC  = citations.some(u => u.includes(siteHost));
      const pos  = isC ? citations.findIndex(u => u.includes(siteHost)) + 1 : null;

      results.push({
        query,
        cited:         isC,
        position:      pos,
        citationCount: citations.length,
        searchQueries,
        snippet:       text.substring(0, 160) + (text.length > 160 ? '…' : ''),
        citations:     citations.slice(0, 6),
        brandMentioned: text.includes('トリリオンバンク') || text.includes('Trillion Bank') || text.includes('HackⅡ'),
      });

      if (isC) cited++;
      await sleep(5000); // free tier: 15 RPM → 5秒間隔で安全マージン確保
    } catch (e) {
      // 429レート制限の場合は10秒待ってリトライ
      if (e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('RESOURCE_EXHAUSTED')) {
        if (!FLAG_QUIET) process.stdout.write(col('\r      ⏳ レート制限 — 10秒待機中…                    ', 'yellow'));
        await sleep(10000);
        try {
          const retryModel  = genAI.getGenerativeModel({ model, tools: [{ googleSearch: {} }] });
          const retryResult = await retryModel.generateContent(query);
          const retryResp   = retryResult.response;
          const retryText   = retryResp.text();
          const retryCand   = retryResp.candidates?.[0] || {};
          const retryMeta   = retryCand.groundingMetadata || {};
          const retryCites  = (retryMeta.groundingChunks || []).map(c => c.web?.uri || '').filter(Boolean);
          const retryIsC    = retryCites.some(u => u.includes(siteHost));
          results.push({
            query, cited: retryIsC,
            position:      retryIsC ? retryCites.findIndex(u => u.includes(siteHost)) + 1 : null,
            citationCount: retryCites.length,
            searchQueries: retryMeta.webSearchQueries || [],
            snippet:       retryText.substring(0, 160) + (retryText.length > 160 ? '…' : ''),
            citations:     retryCites.slice(0, 6),
            brandMentioned: retryText.includes('トリリオンバンク') || retryText.includes('Trillion Bank') || retryText.includes('HackⅡ'),
          });
          if (retryIsC) cited++;
          await sleep(5000);
        } catch (e2) {
          results.push({ query, error: e2.message });
        }
      } else {
        results.push({ query, error: e.message });
      }
    }
  }
  if (!FLAG_QUIET) process.stdout.write('\r' + ' '.repeat(60) + '\r'); // 進捗行をクリア

  // ── センチメント分析：Gemini がブランドをどう認識しているか ─
  let sentiment = null;
  try {
    const sentModel = genAI.getGenerativeModel({ model });
    // ブランドをDX/AI会社として正しく認識させるクエリ
    const sentQuery  = config.brandSentimentQuery ||
      `株式会社トリリオンバンク（trillion-bank.jp）のHackⅡ、AI検索計測、AEO/GEO/SEO実装支援について教えてください。同社はAI検索時代の情報流通を測る・守る・正規化するIT企業です。`;

    const sentResult = await sentModel.generateContent(sentQuery);
    const sentText   = sentResult.response.text();

    const positiveWords = ['優れ', '高い', '信頼', '実績', '専門', '強み', '評価', '優秀', '先進', 'リーダー', '注目', '革新'];
    const negativeWords = ['問題', '批判', '不満', '懸念', '課題', '低い', 'スキャム', '詐欺', '怪しい', '不明'];

    const posCount = positiveWords.filter(w => sentText.includes(w)).length;
    const negCount = negativeWords.filter(w => sentText.includes(w)).length;
    const tone = posCount > negCount + 1 ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    // ── 誤情報検知 ────────────────────────────────────────────
    const misinfoWarnings = [];
    const factCheck = config.brandFactCheck?.forbidden_false_claims || [];
    for (const claim of factCheck) {
      if (sentText.includes(claim)) {
        misinfoWarnings.push(`⚠ 誤情報候補: 「${claim}」が含まれています`);
      }
    }

    // 正しい情報が含まれているか確認
    const correctFacts = config.brandFactCheck?.correct || {};
    const factHits = {};
    for (const [key, val] of Object.entries(correctFacts)) {
      factHits[key] = sentText.includes(val);
    }

    sentiment = {
      tone,
      toneLabel:       tone === 'positive' ? 'ポジティブ' : tone === 'negative' ? 'ネガティブ' : 'ニュートラル',
      posCount,
      negCount,
      snippet:         sentText.substring(0, 250) + (sentText.length > 250 ? '…' : ''),
      misinfoWarnings,
      factHits,
      hasWarning:      misinfoWarnings.length > 0,
    };

    await sleep(1500);
  } catch (e) {
    sentiment = { error: e.message };
  }

  const valid        = results.filter(r => !r.error).length;
  const citationRate = valid > 0 ? Math.round(cited / valid * 100) : 0;

  return {
    status:        'ok',
    engine:        `Gemini ${model} + Google Search Grounding`,
    results,
    citationRate:  citationRate + '%',
    citationScore: citationRate,
    cited,
    valid,
    sentiment,
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ════════════════════════════════════════════════════════════════
// MODULE 6 — 改善施策レコメンデーション
// ════════════════════════════════════════════════════════════════
function generateSuggestions(scoreData, health, ga4, citation) {
  const sugg = [];

  // Dimension weaknesses (from AICS score data)
  if (scoreData.status === 'ok') {
    const { dims } = scoreData;
    for (const [key, dim] of Object.entries(dims)) {
      const achievement = pct(dim.avg, dim.max);
      if (achievement < 70) {
        if (key === 'D1') sugg.push({
          priority: 'HIGH',
          category: 'AI引用確率向上',
          action:   '「〜とは」の定義文をH2直下に太字で追記し、FAQPageスキーマ（最低3Q&A）を実装する',
          detail:   `D1平均 ${dim.avg}/${dim.max}pt (${achievement}%) — 主要ページに具体的数値・社名・料金を含むQ&Aを追加`,
          effort:   '中',
        });
        if (key === 'D4') sugg.push({
          priority: 'HIGH',
          category: '信頼性・権威性強化',
          action:   'author スキーマ（Person）+ 代表プロフィールへの内部リンクを全記事に追加。外部メディア掲載リンクを実績として記載する',
          detail:   `D4平均 ${dim.avg}/${dim.max}pt (${achievement}%)`,
          effort:   '中',
        });
        if (key === 'D5') sugg.push({
          priority: 'MED',
          category: 'コンテンツ構造改善',
          action:   'H2→H3の階層構造を整理し、数字リスト・比較表・手順ステップを増やす。TL;DRサマリーをH1直下に追記',
          detail:   `D5平均 ${dim.avg}/${dim.max}pt (${achievement}%)`,
          effort:   '低',
        });
        if (key === 'D6') sugg.push({
          priority: 'MED',
          category: '記事鮮度・具体性',
          action:   '記事冒頭に「最終更新：YYYY-MM-DD」を明記。統計・調査データに発行年を付与。月1回以上の記事リフレッシュを運用に組み込む',
          detail:   `D6平均 ${dim.avg}/${dim.max}pt (${achievement}%)`,
          effort:   '低',
        });
      }
    }

    // Low-score articles
    if (scoreData.lowScoreArticles?.length > 0) {
      const slugs = scoreData.lowScoreArticles.map(a => a.slug).join(', ');
      sugg.push({
        priority: 'HIGH',
        category: 'スコア底上げ（要対応記事）',
        action:   `以下の低スコア記事をAIパッチ再適用: ${slugs}`,
        detail:   `${scoreData.lowScoreArticles.length}件がCグレード以下 — 引用確率・成約導線が主な弱点`,
        effort:   '中',
      });
    }
  }

  // Site health issues
  const critFails = health.checks?.filter(c => c.status !== 'ok' && c.critical) || [];
  for (const fail of critFails) {
    sugg.push({
      priority: 'HIGH',
      category: 'サイトヘルス（緊急）',
      action:   `${fail.name}（${fail.label}）が ${fail.note || '応答エラー'} — 即時確認・修正が必要`,
      detail:   'AIクローラーがアクセスできない場合、クローリングが停止します',
      effort:   '低',
    });
  }

  // Citation opportunities
  if (citation?.status === 'ok' && citation.citationScore < 40) {
    sugg.push({
      priority: 'HIGH',
      category: 'AI引用率改善 (Google Search)',
      action:   '引用されなかったクエリのランディングページにEntity-Based Content（社名+数値+比較表）を追加する',
      detail:   `現在の引用率 ${citation.citationRate} — 競合比較コンテンツとFAQPageスキーマが特に有効`,
      effort:   '中',
    });
  }

  // Misinformation alerts
  if (citation?.sentiment?.hasWarning) {
    for (const warn of citation.sentiment.misinfoWarnings) {
      sugg.push({
        priority: 'HIGH',
        category: '誤情報・ハルシネーション対策',
        action:   `${warn} — llms.txt と knowledge.json を即時修正し、正確な情報を上書き供給する`,
        detail:   'AIが誤情報を学習している場合、ブランドイメージに悪影響。AI情報供給インフラの更新が必要',
        effort:   '低',
      });
    }
  }

  // Sentiment improvement
  if (citation?.sentiment?.tone === 'negative') {
    sugg.push({
      priority: 'HIGH',
      category: 'ブランドセンチメント改善',
      action:   'Gemini のブランド認識がネガティブです。実績・受賞歴・具体的な成果数値を llms-brand.txt と主要記事に追加する',
      detail:   `センチメント: ネガティブワード ${citation.sentiment.negCount} > ポジティブワード ${citation.sentiment.posCount}`,
      effort:   '中',
    });
  }

  // GA4 AI traffic
  if (ga4?.status === 'ok' && ga4.totalAiSessions < 50) {
    sugg.push({
      priority: 'MED',
      category: 'AI経由流入の増加',
      action:   'llms.txtのサービス定義文をより具体的に（価格・事例・実績数値を追加）。knowledge.jsonのエンティティ説明を月次更新する',
      detail:   `AI経由セッション ${ga4.totalAiSessions}件/月 — 認知度向上施策が必要`,
      effort:   '低',
    });
  }

  // Always include standard suggestions
  sugg.push(
    {
      priority: 'MED',
      category: 'Hack II ポストバック設定',
      action:   '自社サービスサイトにHack II ハカル計測タグを実装。ai_model・query・landing_page_urlのポストバックデータを収集する',
      detail:   'AI検索CVRの正確な計測には専用計測が必要',
      effort:   '高',
    },
    {
      priority: 'LOW',
      category: 'AIクローラー監視',
      action:   'Cloudflare Analyticsを有効化してGPTBot・PerplexityBot等のクロール頻度を可視化する（GitHub PagesはCDN経由でのログ取得を推奨）',
      detail:   'クロール頻度がスコアの鮮度ディメンションと相関',
      effort:   '低',
    },
    {
      priority: 'LOW',
      category: 'ブランドエンティティ強化',
      action:   'Google Business Profile、Wikidata Q番号登録、日経・PR TIMESなど外部メディアのNAP情報を統一する',
      detail:   'D2（エンティティ強度）は既に高いが、外部引用増加でさらなるスコアアップが見込める',
      effort:   '中',
    }
  );

  const order = { HIGH: 0, MED: 1, LOW: 2 };
  return sugg.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 12);
}

// ════════════════════════════════════════════════════════════════
// REPORT GENERATORS
// ════════════════════════════════════════════════════════════════
function renderConsole(date, config, scoreData, health, gsc, ga4, citation, sugg) {
  if (FLAG_QUIET) return;

  const score = scoreData.status === 'ok' ? scoreData.siteScore.total : null;
  const lines = [];

  lines.push('');
  lines.push(col('╔══════════════════════════════════════════════════════════╗', 'cyan'));
  lines.push(col('║  ', 'cyan') + bold('AIO DAILY REPORT — Trillion Bank') + col('              ║', 'cyan'));
  lines.push(col('║  ', 'cyan') + col(date + ' | AICS™ v2.0                              ║', 'gray'));
  lines.push(col('╚══════════════════════════════════════════════════════════╝', 'cyan'));
  lines.push('');

  // Score
  if (score !== null) {
    const sc = scoreColor(score);
    const delta = scoreData.delta;
    const deltaStr = delta !== null
      ? (delta > 0 ? col(` (+${delta})`, 'green') : delta < 0 ? col(` (${delta})`, 'red') : col(' (±0)', 'gray'))
      : '';
    lines.push(col('  AICS™ 総合スコア', 'bold') + `  ${col(score + '/100', sc)}${deltaStr}  ${scoreData.siteScore.grade} ${scoreData.siteScore.stars}`);
    lines.push(`  ${col(bar(score), sc)}`);
    lines.push('');

    // Dimension table
    lines.push(col('  ディメンション別スコア', 'bold'));
    for (const [key, dim] of Object.entries(scoreData.dims)) {
      const ach = pct(dim.avg, dim.max);
      const c2  = scoreColor(ach);
      const b2  = bar(ach, 10);
      lines.push(`  ${col(key, 'gray')} ${dim.label.padEnd(12)} ${col(dim.avg.toFixed(1).padStart(4), c2)}/${dim.max}  ${col(b2, c2)}  ${col(ach + '%', c2)}`);
    }
    lines.push('');

    // Grade distribution
    const gd = scoreData.gradeDistribution;
    lines.push(col('  グレード分布', 'bold'));
    lines.push(`  S+:${gd['S+'] || 0}件  S:${gd['S'] || 0}件  A:${gd['A'] || 0}件  B:${gd['B'] || 0}件  C:${gd['C'] || 0}件  D:${gd['D'] || 0}件  記事計:${scoreData.articleCount}件`);
    lines.push(col(`  (直近7日: ${scoreData.recent7Count}件公開 / 直近30日: ${scoreData.recent30Count}件公開)`, 'gray'));
    lines.push('');
  }

  // Site health
  lines.push(col('  ── サイトヘルスチェック ──────────────────────────', 'gray'));
  for (const ck of health.checks || []) {
    const icon = ck.status === 'ok' ? col('✓', 'green') : col('✗', 'red');
    const note = ck.note ? col('  ' + ck.note, 'yellow') : '';
    lines.push(`  ${icon} ${ck.label.padEnd(25)} HTTP ${ck.httpCode || '---'}${note}`);
  }
  lines.push('');

  // Optional modules
  if (gsc.status === 'ok') {
    lines.push(col('  ── GSC 検索パフォーマンス (30日) ────────────────', 'gray'));
    const dt = gsc.clicksDelta !== null
      ? (gsc.clicksDelta > 0 ? col(` ▲${gsc.clicksDelta}%`, 'green') : col(` ▼${Math.abs(gsc.clicksDelta)}%`, 'red'))
      : '';
    lines.push(`  クリック:${gsc.clicks.toLocaleString()}  表示:${gsc.impress.toLocaleString()}  CTR:${gsc.avgCtr}  平均順位:${gsc.avgPos}位  直近7日${dt}`);
    lines.push('');
  } else if (gsc.status === 'skipped') {
    lines.push(col('  ── GSC: 未設定 ─────────────────────────────────', 'gray'));
    lines.push(col(`     ${gsc.howto || gsc.reason}`, 'gray'));
    lines.push('');
  } else if (gsc.status === 'error') {
    lines.push(col('  ── GSC: エラー ──────────────────────────────────', 'gray'));
    lines.push(col(`     ✗ ${gsc.reason}`, 'red'));
    if (gsc.reason?.includes('permission') || gsc.reason?.includes('Permission')) {
      lines.push(col('     → Search Console にアカウントを追加してください:', 'yellow'));
      lines.push(col('       https://search.google.com/search-console/users?resource_id=https%3A%2F%2Ftrillion-bank.jp%2F', 'yellow'));
    }
    lines.push('');
  }

  if (ga4.status === 'ok') {
    lines.push(col('  ── GA4 AI経由流入 (30日) ────────────────────────', 'gray'));
    lines.push(`  AI総セッション:${col(String(ga4.totalAiSessions), 'cyan')}  AI CV:${ga4.totalAiConversions}  CVR:${ga4.aiCvr}`);
    for (const m of (ga4.modelBreakdown || []).slice(0, 4)) {
      lines.push(`    ${m.label.padEnd(14)} ${m.sessions}セッション  CV:${m.conversions}`);
    }
    lines.push('');
  } else if (ga4.status === 'skipped') {
    lines.push(col('  ── GA4: 未設定 ─────────────────────────────────', 'gray'));
    lines.push(col(`     ${ga4.reason}`, 'gray'));
    lines.push('');
  } else if (ga4.status === 'error') {
    lines.push(col('  ── GA4: エラー ──────────────────────────────────', 'gray'));
    lines.push(col(`     ✗ ${ga4.reason}`, 'red'));
    if (ga4.reason?.includes('Invalid Credentials') || ga4.reason?.includes('invalid_grant')) {
      lines.push(col('     → OAuth2トークン期限切れ。次のコマンドで再認証してください:', 'yellow'));
      lines.push(col('       node scripts/gsc-auth-setup.js', 'yellow'));
    }
    lines.push('');
  }

  if (citation.status === 'ok') {
    lines.push(col('  ── Gemini AI 引用チェック (Google Search Grounding) ─', 'gray'));
    lines.push(`  引用率: ${col(citation.citationRate, scoreColor(citation.citationScore))}  (${citation.cited}/${citation.valid} クエリ)  エンジン: ${col(citation.engine || '', 'gray')}`);
    for (const r of citation.results || []) {
      if (r.error) {
        const errMsg = r.error.includes('429') || r.error.includes('quota') || r.error.includes('limit')
        ? r.error.substring(0, 80) + col('  → APIキーの無料クォータ超過。aistudio.google.com で新規キーを取得してください', 'yellow')
        : r.error.substring(0, 100);
      lines.push(`  ${col('⚠', 'yellow')} ${r.query.substring(0, 40).padEnd(40)}${col(' エラー: ' + errMsg, 'red')}`);
        continue;
      }
      const icon = r.cited ? col('✓', 'green') : col('✗', 'red');
      const cnt  = r.citationCount ?? 0;
      const posStr = r.cited
        ? col(` (${r.position}番目/${cnt}件中)`, 'green')
        : col(` (${cnt}件中に未掲載)`, 'red');
      lines.push(`  ${icon} ${r.query.substring(0, 40).padEnd(40)}${posStr}`);
      if (r.searchQueries?.length > 0) {
        lines.push(col(`      └ Gemini検索クエリ: ${r.searchQueries.join(' / ')}`, 'gray'));
      }
    }
    // Sentiment
    if (citation.sentiment && !citation.sentiment.error) {
      const s = citation.sentiment;
      const toneColor = s.tone === 'positive' ? 'green' : s.tone === 'negative' ? 'red' : 'yellow';
      lines.push('');
      lines.push(`  センチメント: ${col(s.toneLabel, toneColor)}  (ポジ:${s.posCount} / ネガ:${s.negCount})`);
      if (s.hasWarning) {
        for (const w of s.misinfoWarnings) {
          lines.push(`  ${col('⚠ ' + w, 'red')}`);
        }
      }
      lines.push(col(`  AI評価スニペット: 「${s.snippet.substring(0, 80)}」`, 'gray'));
    }
    lines.push('');
  } else if (citation.status === 'skipped') {
    lines.push(col('  ── Gemini AI 引用チェック: 未設定 ─────────────────', 'gray'));
    lines.push(col(`     ${citation.howto || citation.reason}`, 'gray'));
    lines.push('');
  }

  // Suggestions
  lines.push(col('  ── 改善施策 Top ' + Math.min(sugg.length, 5) + ' ────────────────────────────', 'gray'));
  for (const s of sugg.slice(0, 5)) {
    const pIcon = s.priority === 'HIGH' ? col('● 高', 'red') : s.priority === 'MED' ? col('● 中', 'yellow') : col('● 低', 'green');
    lines.push(`  ${pIcon}  ${col('[' + s.category + ']', 'bold')}`);
    lines.push(`      ${s.action.substring(0, 80)}`);
    lines.push(col(`      工数:${s.effort}  ${s.detail ? s.detail.substring(0, 60) : ''}`, 'gray'));
  }
  lines.push('');
  lines.push(col('══════════════════════════════════════════════════════════', 'cyan'));

  console.log(lines.join('\n'));
}

function renderMarkdown(date, config, scoreData, health, gsc, ga4, citation, sugg) {
  const score = scoreData.status === 'ok' ? scoreData.siteScore.total : 'N/A';
  const delta = scoreData.delta;
  const deltaStr = delta !== null
    ? (delta > 0 ? ` (+${delta})` : delta < 0 ? ` (${delta})` : ' (±0)')
    : '';

  let md = `# AIOレポート — ${config.site.name}
**生成日:** ${date} | **スコア:** ${score}/100${deltaStr} | **エンジン:** AICS™ v2.0

---

## 総合スコア

`;

  if (scoreData.status === 'ok') {
    const s = scoreData.siteScore;
    md += `| 指標 | 値 |
|------|-----|
| **AICS™ 総合スコア** | **${s.total} / 100** ${s.grade} ${s.stars} |
| 記事平均スコア | ${scoreData.articleAvg} pt |
| 対象記事数 | ${scoreData.articleCount} 件 |
| 最高スコア記事 | ${scoreData.topArticle?.score}pt — ${scoreData.topArticle?.title?.substring(0, 40)}… |
| 最低スコア記事 | ${scoreData.lowestArticle?.score}pt — ${scoreData.lowestArticle?.title?.substring(0, 40)}… |

### ディメンション別スコア

| ディメンション | 平均 | 満点 | 達成率 |
|--------------|------|------|------|
`;
    for (const [key, dim] of Object.entries(scoreData.dims)) {
      const ach = pct(dim.avg, dim.max);
      const bStr = '█'.repeat(Math.round(ach/10)) + '░'.repeat(10-Math.round(ach/10));
      md += `| ${key} ${dim.label} | ${dim.avg.toFixed(1)} | ${dim.max} | ${bStr} ${ach}% |\n`;
    }

    const gd = scoreData.gradeDistribution;
    md += `
### グレード分布

| S+ | S | A | B | C | D |
|---|---|---|---|---|---|
| ${gd['S+']||0}件 | ${gd['S']||0}件 | ${gd['A']||0}件 | ${gd['B']||0}件 | ${gd['C']||0}件 | ${gd['D']||0}件 |

> 直近7日: **${scoreData.recent7Count}件**公開 / 直近30日: **${scoreData.recent30Count}件**公開

`;
  }

  // Site health
  md += `---\n\n## サイトヘルスチェック\n\n| エンドポイント | ステータス | HTTP | 備考 |\n|-------------|----------|------|------|\n`;
  for (const ck of health.checks || []) {
    const icon = ck.status === 'ok' ? '✅' : '❌';
    md += `| ${ck.label} | ${icon} | ${ck.httpCode || '-'} | ${ck.note || '-'} |\n`;
  }
  md += '\n';

  // GSC
  if (gsc.status === 'ok') {
    md += `---\n\n## Google Search Console (${gsc.period})\n\n`;
    md += `| 指標 | 値 |\n|------|-----|\n`;
    md += `| 総クリック | ${gsc.clicks.toLocaleString()} |\n`;
    md += `| 総表示回数 | ${gsc.impress.toLocaleString()} |\n`;
    md += `| 平均CTR | ${gsc.avgCtr} |\n`;
    md += `| 平均掲載順位 | ${gsc.avgPos}位 |\n`;
    if (gsc.clicksDelta !== null) {
      md += `| 直近7日クリック前週比 | ${gsc.clicksDelta > 0 ? '+' : ''}${gsc.clicksDelta}% |\n`;
    }

    if (gsc.topQueries?.length > 0) {
      md += `\n### 上位クエリ (Top 10)\n\n| クエリ | クリック | 表示 | CTR | 順位 |\n|-------|---------|------|-----|------|\n`;
      for (const q of gsc.topQueries) {
        md += `| ${q.query} | ${q.clicks} | ${q.impressions} | ${q.ctr} | ${q.position} |\n`;
      }
    }
    md += '\n';
  } else {
    md += `---\n\n## Google Search Console\n\n⚙️ 未設定 (${gsc.reason})\n\n設定方法: \`scripts/aio-config.json\` の \`google.serviceAccountKeyFile\` と \`google.gscSiteUrl\` を入力してください。\n\n`;
  }

  // GA4
  if (ga4.status === 'ok') {
    md += `---\n\n## AI経由流入 — Google Analytics 4 (過去30日)\n\n`;
    md += `| 指標 | 値 |\n|------|-----|\n`;
    md += `| AI経由総セッション | **${ga4.totalAiSessions}** |\n`;
    md += `| AI経由コンバージョン | ${ga4.totalAiConversions} |\n`;
    md += `| AI経由CVR | ${ga4.aiCvr} |\n\n`;

    if (ga4.modelBreakdown?.length > 0) {
      md += `### AIモデル別流入内訳\n\n| AIモデル | セッション | CV |\n|---------|-----------|----|\n`;
      for (const m of ga4.modelBreakdown) {
        md += `| ${m.label} | ${m.sessions} | ${m.conversions} |\n`;
      }
      md += '\n';
    }

    if (ga4.topLandingPages?.length > 0) {
      md += `### AI経由ランディングページ Top5\n\n| ページ | セッション | CV |\n|-------|-----------|----|\n`;
      for (const p of ga4.topLandingPages) {
        md += `| ${p.page} | ${p.sessions} | ${p.cvs} |\n`;
      }
      md += '\n';
    }
  } else {
    md += `---\n\n## AI経由流入 (GA4)\n\n⚙️ 未設定 (${ga4.reason})\n\n設定方法: \`google.ga4PropertyId\` を \`aio-config.json\` に入力してください。\n\n`;
  }

  // Citation (Gemini)
  if (citation.status === 'ok') {
    md += `---\n\n## AI引用チェック — ${citation.engine || 'Gemini + Google Search'}\n\n`;
    md += `| 指標 | 値 |\n|------|-----|\n`;
    md += `| 引用率 | **${citation.citationRate}** |\n`;
    md += `| 引用スコア | ${citation.citationScore}/100 |\n`;
    md += `| チェック済みクエリ | ${citation.valid}件 |\n\n`;

    md += `### クエリ別引用状況\n\n| クエリ | 引用 | 順位 | 総引用数 | Gemini検索クエリ |\n|-------|------|------|---------|----------------|\n`;
    for (const r of citation.results || []) {
      if (r.error) {
        md += `| ${r.query} | ⚠️ エラー | - | - | ${r.error} |\n`;
        continue;
      }
      const icon = r.cited ? '✅' : '❌';
      const pos  = r.position ? `${r.position}番目` : '-';
      const sq   = (r.searchQueries || []).join(', ').substring(0, 40) || '-';
      md += `| ${r.query} | ${icon} | ${pos} | ${r.citationCount}件 | ${sq} |\n`;
    }

    // Cited pages detail
    const citedResults = (citation.results || []).filter(r => r.cited);
    if (citedResults.length > 0) {
      md += `\n### 引用された際のAI回答（スニペット）\n\n`;
      for (const r of citedResults) {
        md += `**「${r.query}」**\n> ${r.snippet}\n\n`;
      }
    }

    // Sentiment
    if (citation.sentiment && !citation.sentiment.error) {
      const s = citation.sentiment;
      const toneIcon = s.tone === 'positive' ? '😊' : s.tone === 'negative' ? '😟' : '😐';
      md += `### ブランドセンチメント分析\n\n`;
      md += `| 指標 | 値 |\n|------|-----|\n`;
      md += `| センチメント | ${toneIcon} **${s.toneLabel}** |\n`;
      md += `| ポジティブワード数 | ${s.posCount} |\n`;
      md += `| ネガティブワード数 | ${s.negCount} |\n`;
      if (s.hasWarning) {
        md += `| **⚠ 誤情報アラート** | ${s.misinfoWarnings.length}件 |\n`;
      }
      md += `\n**Gemini のブランド評価:**\n> ${s.snippet}\n\n`;

      if (s.hasWarning) {
        md += `#### ⚠ 誤情報・ハルシネーション アラート\n\n`;
        for (const w of s.misinfoWarnings) {
          md += `- ${w}\n`;
        }
        md += '\n**対応:** `llms.txt` と `knowledge.json` を即時更新し、AIへの正確な情報供給を行ってください。\n\n';
      }

      if (Object.keys(s.factHits || {}).length > 0) {
        md += `#### ファクトチェック (正しい情報がAI回答に含まれているか)\n\n| 項目 | 含有 |\n|------|------|\n`;
        for (const [key, hit] of Object.entries(s.factHits)) {
          md += `| ${key} | ${hit ? '✅' : '❌'} |\n`;
        }
        md += '\n';
      }
    }
  } else {
    md += `---\n\n## AI引用チェック (Gemini)\n\n⚙️ 未設定 — ${citation.reason}\n\n`;
    if (citation.howto) md += `> **設定方法:** ${citation.howto}\n\n`;
  }

  // Suggestions
  md += `---\n\n## 改善施策レコメンデーション\n\n`;
  const byPri = { HIGH: [], MED: [], LOW: [] };
  for (const s of sugg) byPri[s.priority]?.push(s);

  const priLabel = { HIGH: '🔴 優先度:高', MED: '🟡 優先度:中', LOW: '🟢 優先度:低' };
  for (const [pri, items] of Object.entries(byPri)) {
    if (!items.length) continue;
    md += `### ${priLabel[pri]}\n\n`;
    for (const s of items) {
      md += `**[${s.category}]** ${s.action}\n`;
      md += `- 詳細: ${s.detail}\n`;
      md += `- 工数: ${s.effort}\n\n`;
    }
  }

  md += `---\n\n*Generated by Trillion Bank AIO Report Generator v1.0 — ${date}*\n`;
  return md;
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
async function main() {
  const config   = loadConfig();
  const dateStr  = today();

  if (!FLAG_QUIET) {
    console.log(col('\n🔍 AIO Report Generator 起動中…', 'cyan'));
    console.log(col('  ステップ 1/4  スコアデータ + サイトヘルスチェック…', 'gray'));
  }

  // Step 1: local data + health (fast)
  const scoreData = loadScoreData();
  const health    = await runSiteHealthCheck(config);

  if (!FLAG_QUIET) console.log(col('  ステップ 2/4  GSC + GA4 データ取得中…', 'gray'));

  // Step 2: GSC + GA4 in parallel
  const [gsc, ga4] = await Promise.all([
    runGSC(config),
    runGA4(config),
  ]);

  if (!FLAG_QUIET) console.log(col('  ステップ 3/4  AI引用チェック中（各クエリ1.5秒待機）…', 'gray'));

  // Step 3: Gemini (sequential, rate-limited)
  const citation  = await runCitationCheck(config);

  if (!FLAG_QUIET) console.log(col('  ステップ 4/4  レポート生成中…', 'gray'));

  const sugg = generateSuggestions(scoreData, health, ga4, citation);

  // Console output
  renderConsole(dateStr, config, scoreData, health, gsc, ga4, citation, sugg);

  // Build report data object
  const report = {
    date: dateStr,
    site: config.site,
    scores: scoreData,
    health,
    gsc,
    ga4,
    citation,
    suggestions: sugg,
  };

  // Ensure reports dir
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // Save markdown report
  const mdPath = path.join(REPORTS_DIR, `${dateStr}-aio-report.md`);
  fs.writeFileSync(mdPath, renderMarkdown(dateStr, config, scoreData, health, gsc, ga4, citation, sugg), 'utf8');

  // Also update docs/aio-report.md (canonical report)
  const canonicalPath = path.join(ROOT, 'docs', 'aio-report.md');
  if (fs.existsSync(path.join(ROOT, 'docs'))) {
    fs.writeFileSync(canonicalPath, renderMarkdown(dateStr, config, scoreData, health, gsc, ga4, citation, sugg), 'utf8');
  }

  // JSON export
  if (FLAG_JSON || (config.output?.formats || []).includes('json')) {
    const jsonPath = path.join(REPORTS_DIR, `${dateStr}-aio-report.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    if (!FLAG_QUIET) console.log(col(`📊 JSON: ${jsonPath}`, 'gray'));
  }

  if (!FLAG_QUIET) {
    console.log(col(`📄 レポート保存: ${mdPath}`, 'green'));
    console.log(col(`📄 カノニカル更新: ${canonicalPath}`, 'green'));
    console.log('');
  }
}

main().catch(e => {
  console.error(col('❌ エラー: ' + e.message, 'red'));
  if (process.env.DEBUG) console.error(e.stack);
  process.exit(1);
});
