#!/usr/bin/env node
/**
 * Case Study Generator — Regalis Japan Group
 * ============================================================
 * 使い方:
 *   node scripts/case-study-gen.js                  # 全ケーススタディを生成
 *   node scripts/case-study-gen.js example           # 特定のslugのみ生成
 *   npm run case-study                               # package.json経由
 *
 * データ入力:
 *   scripts/case-studies/[slug].json に before/after データを記入
 *
 * 出力:
 *   docs/case-studies/[slug].html  ← ブラウザで開いてPDF印刷可能
 *   docs/case-studies/index.html   ← 一覧ページ
 * ============================================================
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DATA_DIR   = path.join(__dirname, 'case-studies');
const OUT_DIR    = path.join(__dirname, '..', 'docs', 'case-studies');
const targetSlug = process.argv[2] || null;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── ユーティリティ ────────────────────────────────────────────
function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (typeof n !== 'number') return n;
  return n >= 10000 ? (n / 10000).toFixed(1) + '万' : n.toLocaleString('ja-JP');
}

function calcGrowth(before, after, direction) {
  if (before === 0 && after === 0) return { label: '変化なし', cls: 'neutral' };
  if (before === 0) return { label: `+${fmt(after)}`, cls: 'up' };
  const ratio = (after - before) / before;
  const pct   = Math.round(ratio * 100);
  if (direction === 'down') {
    // 小さいほど良い（順位など）
    return ratio < 0
      ? { label: `▲${Math.abs(pct)}% 改善`, cls: 'up' }
      : { label: `▼${pct}% 悪化`,           cls: 'down' };
  }
  return ratio >= 0
    ? { label: `+${pct}%`,  cls: 'up' }
    : { label: `${pct}%`,   cls: 'down' };
}

function calcMultiplier(before, after) {
  if (before === 0) return after > 0 ? '∞' : '—';
  const x = (after / before);
  return x >= 2 ? x.toFixed(1) + 'x' : null;
}

function barWidth(before, after, direction) {
  // CSS bar width % for the "after" bar relative to max
  if (direction === 'down') {
    // lower is better: invert the bar
    const improvement = Math.min(before > 0 ? ((before - after) / before) * 100 : 0, 100);
    return Math.max(improvement, 5).toFixed(0);
  }
  const max = Math.max(before, after, 1);
  return Math.min((after / max) * 100, 100).toFixed(0);
}

// ── HTMLテンプレート ──────────────────────────────────────────
function buildHTML(d) {
  const heroMetrics = Object.entries(d.metrics).filter(([, m]) => m.hero);
  const allMetrics  = Object.entries(d.metrics);

  const heroCards = heroMetrics.map(([key, m]) => {
    const g   = calcGrowth(m.before, m.after, m.direction);
    const mul = calcMultiplier(m.before, m.after);
    const big = mul || g.label;
    return `
      <div class="hero-card">
        <div class="hero-label">${m.label}</div>
        <div class="hero-big ${g.cls}">${big}</div>
        <div class="hero-vals">
          <span class="before-val">${fmt(m.before)}${m.unit}</span>
          <span class="arrow">→</span>
          <span class="after-val">${fmt(m.after)}${m.unit}</span>
        </div>
      </div>`;
  }).join('');

  const metricRows = allMetrics.map(([key, m]) => {
    const g    = calcGrowth(m.before, m.after, m.direction);
    const bw   = barWidth(m.before, m.after, m.direction);
    const maxV = Math.max(m.before, m.after, 1);
    const bBar = Math.min((m.before / maxV) * 100, 100).toFixed(0);
    return `
      <div class="metric-row">
        <div class="metric-label">${m.label}</div>
        <div class="metric-compare">
          <div class="metric-before">
            <span class="val-label">導入前</span>
            <div class="bar-wrap">
              <div class="bar bar-before" style="width:${bBar}%"></div>
            </div>
            <span class="val-num">${fmt(m.before)}${m.unit}</span>
          </div>
          <div class="metric-after">
            <span class="val-label">導入後</span>
            <div class="bar-wrap">
              <div class="bar bar-after" style="width:${bw}%"></div>
            </div>
            <span class="val-num">${fmt(m.after)}${m.unit}</span>
          </div>
        </div>
        <div class="metric-growth ${g.cls}">${g.label}</div>
      </div>`;
  }).join('');

  const highlights = (d.highlights || []).map(h =>
    `<li>${h}</li>`
  ).join('');

  const serviceChips = (d.services || []).map(s =>
    `<span class="chip">${s}</span>`
  ).join('');

  // タイムラインチャート（純CSS + SVG-likeな折れ線）
  const timeline = d.timeline || [];
  const timelineSection = timeline.length > 0 ? buildTimeline(timeline) : '';

  const periodLabel = `${d.contract_start?.substring(0, 7)} 〜 ${d.report_date?.substring(0, 7)}（${d.period_months}ヶ月）`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.client_name} — 導入事例 | Regalis Japan Group</title>
<style>
/* ── Reset & Base ─────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --gold:    #C5A059;
  --gold-dim:#9C7A3C;
  --bg:      #060606;
  --bg2:     #0f0f0f;
  --bg3:     #1a1a1a;
  --border:  #2a2a2a;
  --text:    #e8e8e8;
  --muted:   #888;
  --green:   #4ade80;
  --red:     #f87171;
  --blue:    #60a5fa;
}
body {
  font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── Layout ──────────────────────────────────── */
.page { max-width: 900px; margin: 0 auto; padding: 48px 32px; }

/* ── Header ──────────────────────────────────── */
.case-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 32px;
  margin-bottom: 40px;
}
.brand-badge {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px; color: var(--gold); letter-spacing: .12em;
  text-transform: uppercase; margin-bottom: 20px;
}
.brand-badge::before {
  content: ''; display: block;
  width: 28px; height: 1px; background: var(--gold);
}
.case-headline {
  font-family: 'Noto Serif JP', serif;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 700; line-height: 1.35;
  margin-bottom: 10px;
}
.case-subheadline { font-size: 14px; color: var(--muted); margin-bottom: 20px; }
.meta-row { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: var(--muted); }
.meta-item strong { color: var(--text); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.chip {
  padding: 4px 12px; border: 1px solid var(--gold-dim);
  border-radius: 20px; font-size: 12px; color: var(--gold);
}

/* ── Hero KPIs ───────────────────────────────── */
.hero-section { margin-bottom: 48px; }
.section-title {
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 20px;
}
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.hero-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px 20px;
  text-align: center;
}
.hero-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
.hero-big {
  font-size: 42px; font-weight: 800; line-height: 1;
  margin-bottom: 12px; letter-spacing: -.02em;
}
.hero-big.up   { color: var(--gold); }
.hero-big.down { color: var(--red); }
.hero-vals { font-size: 13px; color: var(--muted); display: flex; justify-content: center; gap: 8px; align-items: center; }
.after-val { color: var(--text); font-weight: 600; }
.arrow { color: var(--gold); }

/* ── Highlights ──────────────────────────────── */
.highlights-section { margin-bottom: 48px; }
.highlights-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.highlights-list li {
  padding: 12px 16px 12px 40px;
  background: var(--bg2); border-radius: 6px;
  border-left: 3px solid var(--gold);
  position: relative; font-size: 14px;
}
.highlights-list li::before {
  content: '✓'; position: absolute; left: 14px;
  color: var(--gold); font-weight: 700;
}

/* ── Metrics Table ───────────────────────────── */
.metrics-section { margin-bottom: 48px; }
.metrics-grid { display: flex; flex-direction: column; gap: 12px; }
.metric-row {
  background: var(--bg2); border-radius: 8px;
  padding: 16px 20px; border: 1px solid var(--border);
  display: grid;
  grid-template-columns: 160px 1fr 90px;
  gap: 16px; align-items: center;
}
.metric-label { font-size: 13px; font-weight: 600; }
.metric-compare { display: flex; flex-direction: column; gap: 6px; }
.metric-before, .metric-after {
  display: grid; grid-template-columns: 48px 1fr 72px;
  gap: 8px; align-items: center; font-size: 12px;
}
.val-label { color: var(--muted); font-size: 11px; }
.val-num   { text-align: right; font-weight: 600; font-size: 13px; }
.metric-before .val-num { color: var(--muted); }
.metric-after  .val-num { color: var(--text); }
.bar-wrap {
  height: 6px; background: var(--bg3);
  border-radius: 3px; overflow: hidden;
}
.bar { height: 100%; border-radius: 3px; }
.bar-before { background: var(--border); }
.bar-after  { background: var(--gold); }
.metric-growth {
  font-size: 13px; font-weight: 700; text-align: right;
  white-space: nowrap;
}
.metric-growth.up   { color: var(--green); }
.metric-growth.down { color: var(--red); }
.metric-growth.neutral { color: var(--muted); }

/* ── Timeline ────────────────────────────────── */
.timeline-section { margin-bottom: 48px; }
.timeline-chart { background: var(--bg2); border-radius: 8px; padding: 24px; border: 1px solid var(--border); }
.timeline-chart canvas { width: 100%; }
.tl-grid { display: grid; gap: 8px; }
.tl-row  { display: grid; gap: 8px; align-items: center; }
.tl-label { font-size: 12px; color: var(--muted); width: 64px; }
.tl-bar-wrap { height: 8px; background: var(--bg3); border-radius: 4px; overflow: hidden; position: relative; }
.tl-bar { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--gold-dim), var(--gold)); transition: width .6s ease; }
.tl-val { font-size: 12px; font-weight: 600; width: 60px; text-align: right; }
.tl-legend { display: flex; gap: 24px; margin-bottom: 12px; }
.tl-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-gold  { background: var(--gold); }
.dot-blue  { background: var(--blue); }
.dot-green { background: var(--green); }

/* ── Footer ──────────────────────────────────── */
.case-footer {
  border-top: 1px solid var(--border); padding-top: 24px;
  margin-top: 16px; font-size: 12px; color: var(--muted);
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 12px;
}
.footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--gold); }
.note-text { font-size: 11px; color: var(--border); }

/* ── Print ───────────────────────────────────── */
@media print {
  body { background: white !important; color: #111 !important; }
  :root {
    --bg: white; --bg2: #f8f8f8; --bg3: #eee;
    --text: #111; --muted: #666; --border: #ddd;
    --gold: #9C7A3C;
  }
  .page { padding: 24px 20px; }
  .case-header { border-color: #ddd; }
  .hero-card, .metric-row, .timeline-chart { border-color: #ddd !important; }
  .highlights-list li { border-left-color: #9C7A3C; }
  @page { margin: 1.5cm; }
}
</style>
</head>
<body>
<div class="page">

  <!-- ヘッダー -->
  <header class="case-header">
    <div class="brand-badge">Regalis Japan Group — 導入事例</div>
    <h1 class="case-headline">${d.headline}</h1>
    <p class="case-subheadline">${d.subheadline || ''}</p>
    <div class="meta-row">
      <span><strong>クライアント:</strong> ${d.client_name}</span>
      <span><strong>業種:</strong> ${d.client_industry || '—'}</span>
      <span><strong>期間:</strong> ${periodLabel}</span>
    </div>
    <div class="chips">${serviceChips}</div>
  </header>

  <!-- Hero KPIs -->
  <section class="hero-section">
    <div class="section-title">Key Results</div>
    <div class="hero-grid">${heroCards}</div>
  </section>

  <!-- ハイライト -->
  ${highlights ? `
  <section class="highlights-section">
    <div class="section-title">Achievements</div>
    <ul class="highlights-list">${highlights}</ul>
  </section>` : ''}

  <!-- 全指標 -->
  <section class="metrics-section">
    <div class="section-title">Before / After — 全指標</div>
    <div class="metrics-grid">${metricRows}</div>
  </section>

  <!-- タイムライン -->
  ${timelineSection}

  <!-- フッター -->
  <footer class="case-footer">
    <div>
      <div class="footer-logo">Regalis Japan Group</div>
      <div style="font-size:11px; margin-top:4px;">regalis-order-suits.com</div>
    </div>
    <div style="text-align:right">
      <div>レポート生成: ${new Date().toLocaleDateString('ja-JP')}</div>
      ${d.note ? `<div class="note-text" style="margin-top:4px;">${d.note}</div>` : ''}
    </div>
  </footer>

</div>
</body>
</html>`;
}

function buildTimeline(timeline) {
  const maxSessions  = Math.max(...timeline.map(t => t.sessions  || 0), 1);
  const maxInquiries = Math.max(...timeline.map(t => t.inquiries || 0), 1);
  const maxAics      = Math.max(...timeline.map(t => t.aics      || 0), 100);

  const rows = timeline.map(t => {
    const sw = ((t.sessions  || 0) / maxSessions  * 100).toFixed(0);
    const iw = ((t.inquiries || 0) / maxInquiries * 100).toFixed(0);
    const aw = ((t.aics      || 0) / maxAics      * 100).toFixed(0);
    return `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px; color:#888; margin-bottom:4px;">${t.label}</div>
      <div style="display:grid; grid-template-columns:1fr; gap:4px;">
        <div style="display:grid; grid-template-columns:80px 1fr 70px; gap:8px; align-items:center; font-size:11px;">
          <span style="color:#888;">AICS™スコア</span>
          <div style="height:6px; background:#1a1a1a; border-radius:3px; overflow:hidden;">
            <div style="width:${aw}%; height:100%; background:#C5A059; border-radius:3px;"></div>
          </div>
          <span style="text-align:right; font-weight:600;">${t.aics}pt</span>
        </div>
        <div style="display:grid; grid-template-columns:80px 1fr 70px; gap:8px; align-items:center; font-size:11px;">
          <span style="color:#888;">月間流入</span>
          <div style="height:6px; background:#1a1a1a; border-radius:3px; overflow:hidden;">
            <div style="width:${sw}%; height:100%; background:#60a5fa; border-radius:3px;"></div>
          </div>
          <span style="text-align:right; font-weight:600;">${fmt(t.sessions)}件</span>
        </div>
        <div style="display:grid; grid-template-columns:80px 1fr 70px; gap:8px; align-items:center; font-size:11px;">
          <span style="color:#888;">問い合わせ</span>
          <div style="height:6px; background:#1a1a1a; border-radius:3px; overflow:hidden;">
            <div style="width:${iw}%; height:100%; background:#4ade80; border-radius:3px;"></div>
          </div>
          <span style="text-align:right; font-weight:600;">${t.inquiries}件</span>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <section class="timeline-section">
    <div class="section-title">月次推移</div>
    <div class="timeline-chart">
      <div style="display:flex; gap:20px; margin-bottom:16px; font-size:12px; color:#888;">
        <span><span style="display:inline-block;width:8px;height:8px;background:#C5A059;border-radius:50%;margin-right:4px;"></span>AICS™スコア</span>
        <span><span style="display:inline-block;width:8px;height:8px;background:#60a5fa;border-radius:50%;margin-right:4px;"></span>月間流入</span>
        <span><span style="display:inline-block;width:8px;height:8px;background:#4ade80;border-radius:50%;margin-right:4px;"></span>問い合わせ</span>
      </div>
      ${rows}
    </div>
  </section>`;
}

// ── インデックスページ生成 ──────────────────────────────────────
function buildIndex(caseStudies) {
  const cards = caseStudies.map(d => {
    const heroMetrics = Object.entries(d.metrics).filter(([, m]) => m.hero).slice(0, 3);
    const kpiHtml = heroMetrics.map(([, m]) => {
      const g = calcGrowth(m.before, m.after, m.direction);
      const mul = calcMultiplier(m.before, m.after);
      return `<div style="text-align:center;">
        <div style="font-size:11px;color:#888;margin-bottom:2px;">${m.label}</div>
        <div style="font-size:20px;font-weight:800;color:#C5A059;">${mul || g.label}</div>
      </div>`;
    }).join('');

    return `
    <a href="${d.slug}.html" style="text-decoration:none; color:inherit; display:block; background:#0f0f0f; border:1px solid #2a2a2a; border-radius:8px; padding:24px; transition:border-color .2s;">
      <div style="font-size:11px;color:#C5A059;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">${d.client_industry || 'ケーススタディ'}</div>
      <div style="font-weight:700;font-size:16px;margin-bottom:8px;line-height:1.4;">${d.headline}</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px;">${d.contract_start?.substring(0,7)} 〜 ${d.report_date?.substring(0,7)} / ${d.period_months}ヶ月</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">${kpiHtml}</div>
    </a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>導入事例一覧 | Regalis Japan Group</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif;background:#060606;color:#e8e8e8;line-height:1.6}
.page{max-width:900px;margin:0 auto;padding:48px 32px}
h1{font-family:'Noto Serif JP',serif;font-size:28px;margin-bottom:8px}
.grid{display:grid;gap:16px;margin-top:32px}
</style>
</head>
<body>
<div class="page">
  <div style="font-size:11px;color:#C5A059;letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;">Regalis Japan Group</div>
  <h1>導入事例</h1>
  <p style="color:#888;font-size:14px;margin-top:8px;">AI検索最適化・SEO・DXコンサルティングの実績</p>
  <div class="grid">${cards}</div>
  <div style="margin-top:48px;padding-top:24px;border-top:1px solid #2a2a2a;font-size:12px;color:#555;">
    Generated by Regalis Case Study Generator — ${new Date().toLocaleDateString('ja-JP')}
  </div>
</div>
</body>
</html>`;
}

// ── メイン処理 ────────────────────────────────────────────────
function main() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));

  if (files.length === 0) {
    console.log('⚠ case-studies/ にJSONファイルがありません。example.jsonをコピーして編集してください。');
    return;
  }

  const generated = [];

  for (const file of files) {
    const slug = file.replace('.json', '');
    if (targetSlug && slug !== targetSlug) continue;

    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    if (data._comment) {
      // テンプレートファイルはスキップしない（exampleは生成する）
    }

    // slugをデータに付与
    data.slug = data.slug || slug;

    const html    = buildHTML(data);
    const outPath = path.join(OUT_DIR, `${data.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');

    console.log(`✅ 生成: docs/case-studies/${data.slug}.html`);
    console.log(`   → ブラウザで開いて確認 → 印刷 → PDFとして保存`);
    generated.push(data);
  }

  // インデックスページを生成
  if (generated.length > 0) {
    const indexHtml = buildIndex(generated);
    fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml, 'utf8');
    console.log(`✅ 生成: docs/case-studies/index.html`);
  }

  console.log('\n完了。以下のコマンドでプレビューできます:');
  console.log(`  open docs/case-studies/${generated[0]?.slug || 'index'}.html`);
}

main();
