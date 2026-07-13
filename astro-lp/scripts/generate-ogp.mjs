/**
 * OGP画像（public/ogp.png, 1200x630）を生成する。
 * コピーやカラーを変えたらこのスクリプトを再実行する:
 *   node scripts/generate-ogp.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/ogp.png', import.meta.url));

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fbf6ec"/>
  <circle cx="1080" cy="-40" r="260" fill="#fce3c8"/>
  <circle cx="60" cy="640" r="220" fill="#f4ead6"/>
  <rect x="80" y="130" width="300" height="56" rx="28" fill="#fef3e7" stroke="#f5ad6b" stroke-width="2"/>
  <text x="230" y="168" font-family="sans-serif" font-size="26" font-weight="bold" fill="#b45211" text-anchor="middle">法人向けAI導入支援</text>
  <!-- ブランドマーク（Trillion Bank） -->
  <g transform="translate(980,110)">
    <rect x="0"  y="60" width="20" height="60" rx="5" fill="#f5ad6b"/>
    <rect x="30" y="30" width="20" height="90" rx="5" fill="#ea7a2b"/>
    <rect x="60" y="0"  width="20" height="120" rx="5" fill="#d96716"/>
  </g>
  <text x="80" y="290" font-family="sans-serif" font-size="76" font-weight="900" fill="#142740">そのAI活用、</text>
  <text x="80" y="390" font-family="sans-serif" font-size="76" font-weight="900" fill="#142740"><tspan fill="#d96716">「診断」</tspan>から始めませんか。</text>
  <rect x="80" y="460" width="440" height="84" rx="42" fill="#ea7a2b"/>
  <text x="300" y="514" font-family="sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">1分で無料AI診断 →</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`generated: ${out}`);
