#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// gen-images.mjs — OpenAI 画像API (gpt-image-1) による画像生成
// Regalis Japan Group コーポレートサイト用
//
// 使い方:
//   export OPENAI_API_KEY=sk-...
//   node scripts/gen-images.mjs                # 全プリセットを生成
//   node scripts/gen-images.mjs hero ogp       # 指定キーのみ生成
//
// 出力先: images/generated/<key>.png
// 依存: なし（Node 18+ の fetch を使用。追加パッケージ不要）
// ─────────────────────────────────────────────────────────────
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "images", "generated");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("✗ OPENAI_API_KEY が未設定です。 export OPENAI_API_KEY=sk-... を実行してください。");
  process.exit(1);
}

// ブランド共通スタイル（青→シアンのグラデ・白基調・AI検索テーマ）
const BRAND_STYLE =
  "Modern, premium Japanese corporate tech aesthetic. Clean white background with " +
  "subtle blue (#2563EB) to cyan (#06B6D4) gradient accents. Minimal, high-end, " +
  "professional. No text, no letters, no logos, no watermarks. Elegant negative space.";

// 生成プリセット（key: {prompt, size}）
// size は gpt-image-1 対応値: 1024x1024 / 1536x1024(横) / 1024x1536(縦)
const PRESETS = {
  hero: {
    size: "1536x1024",
    prompt:
      `${BRAND_STYLE} Abstract visualization of AI search intelligence: flowing ` +
      `data streams and neural network nodes forming an elegant wave, conveying ` +
      `"being chosen by AI". Cinematic, spacious, suitable as a website hero background.`,
  },
  ogp: {
    size: "1536x1024",
    prompt:
      `${BRAND_STYLE} Social share (OGP) key visual representing an AI-search ` +
      `optimization and digital PR group. Geometric gradient forms suggesting ` +
      `structured data and quantified brand value. Balanced composition with space ` +
      `on the left for an overlaid headline.`,
  },
  "service-aio-media": {
    size: "1024x1024",
    prompt:
      `${BRAND_STYLE} Icon-style illustration for "SEO/AIO media operation": ` +
      `stylized documents and articles flowing into a glowing AI core, representing ` +
      `content optimized for generative AI recommendation.`,
  },
  "service-hackii": {
    size: "1024x1024",
    prompt:
      `${BRAND_STYLE} Icon-style illustration for an "AI citation monitoring tool": ` +
      `a radar/dashboard motif tracking brand mentions across AI answers, with ` +
      `signal waves and data points.`,
  },
  "service-crawler": {
    size: "1024x1024",
    prompt:
      `${BRAND_STYLE} Icon-style illustration for "AI crawler monetization": ` +
      `abstract crawler bots and value/coin flows converging, representing ` +
      `pay-per-crawl revenue from AI search.`,
  },
  "service-dx": {
    size: "1024x1024",
    prompt:
      `${BRAND_STYLE} Icon-style illustration for "AI/DX strategy consulting": ` +
      `a blueprint and gears transforming into an intelligent network, representing ` +
      `design-first digital transformation.`,
  },
};

async function generate(key, preset) {
  console.log(`▶ 生成中: ${key} (${preset.size})`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: preset.prompt,
      size: preset.size,
      n: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("画像データが返りませんでした");

  const outPath = join(OUT_DIR, `${key}.png`);
  await writeFile(outPath, Buffer.from(b64, "base64"));
  console.log(`  ✓ 保存: images/generated/${key}.png`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const args = process.argv.slice(2);
  const keys = args.length ? args : Object.keys(PRESETS);

  for (const key of keys) {
    const preset = PRESETS[key];
    if (!preset) {
      console.warn(`⚠ 未知のプリセット: ${key}（スキップ）`);
      continue;
    }
    try {
      await generate(key, preset);
    } catch (e) {
      console.error(`✗ ${key} の生成に失敗: ${e.message}`);
    }
  }
  console.log("✓ 完了");
}

main();
