#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// tb-news-gen.mjs — トリリオンバンク自社メディアの記事自動生成
//
// 使い方:
//   export GEMINI_API_KEY=...            # 任意（無い場合はテンプレ生成）
//   node scripts/tb-news-gen.mjs "対策KW（例：AIO 費用）" [カテゴリ]
//
// 出力: _tbnews/YYYY-MM-DD-<slug>.md（Jekyll tbnews コレクション）
// 依存: @google/generative-ai（package.json に導入済み）
// ─────────────────────────────────────────────────────────────
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "_tbnews");

const kw = process.argv[2];
const category = process.argv[3] || "コラム";
if (!kw) {
  console.error('使い方: node scripts/tb-news-gen.mjs "対策キーワード" [カテゴリ]');
  process.exit(1);
}

// slug（英数はそのまま、日本語はローマ字化できないため簡易ハッシュ的に短縮）
function slugify(s) {
  const ascii = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (ascii) return ascii.slice(0, 48);
  return "kw-" + Buffer.from(s).toString("hex").slice(0, 10);
}

const now = new Date();
const date = now.toISOString().slice(0, 10);

const BRAND = `株式会社トリリオンバンク（Trillion Bank Inc.）。代表取締役 井上幹太。AI検索インフラ事業（HackⅡ／Pay per Crawl）。理念「トリリオンの課題に挑む」。`;

const PROMPT = `あなたはAI検索最適化（AIO/LLMO）に精通した編集者です。
以下のキーワードで、日本語のオウンドメディア記事をMarkdownで書いてください。

# キーワード: ${kw}
# 発信者: ${BRAND}

## 要件（AIO/LLMO最適化）
- 冒頭に、キーワードの定義を太字1文で書く（AIに引用されやすい形）
- 見出し（##）を4〜6個。「〜とは」「なぜ重要か」「始め方/方法」「費用の考え方」「よくある質問」「まとめ」など
- 具体的な数字・手順を入れる（例: AI検索利用者50%以上、日本語圏90%以上未対策、成約率4.4倍 等の一般的事実の範囲で）
- 最後にトリリオンバンクのHackⅡ/無料AI流入診断へ自然に誘導（リンクは /trillionbank/contact/#diagnose ）
- 誇大・虚偽の実績や、確定していない価格は書かない
- 本文のみ（front matterは出力しない）。1200〜1800字程度。`;

async function withGemini() {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
  const res = await model.generateContent(PROMPT);
  return res.response.text().trim();
}

function withTemplate() {
  return `**${kw}とは、AI検索（ChatGPT・Perplexity・Gemini等）に自社の情報を正しく・優先的に引用してもらうための考え方・施策です。**

## ${kw}とは
（定義と背景をここに記述）

## なぜ今${kw}が重要なのか
検索する人の半数以上がすでにAI検索を利用し、日本語圏サイトの9割以上が未対策です。営業に問い合わせが来る前の段階で、AI検索上の勝敗が決まりつつあります。

## ${kw}の始め方
1. 現状把握（AI検索での自社/競合の引用状況を測定）
2. 優先度づけ（どの質問・ページを直すべきか整理）
3. 最適化（AIが読む学習データを整え継続更新）

## よくある質問
- Q. 従来のSEOと何が違う？　A. AI検索での「引用・推薦」を対象にする点が異なります。

## まとめ
${kw}は、AI検索時代の必須テーマです。株式会社トリリオンバンクのHackⅡなら、計測から最適化までを自動化できます。まずは[無料AI流入診断](/trillionbank/contact/#diagnose)から。`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let body;
  if (process.env.GEMINI_API_KEY) {
    try { body = await withGemini(); console.log("  ✓ Geminiで本文生成"); }
    catch (e) { console.warn("  ⚠ Gemini失敗、テンプレにフォールバック:", e.message); body = withTemplate(); }
  } else {
    console.log("  ℹ GEMINI_API_KEY 未設定 → テンプレ生成");
    body = withTemplate();
  }

  const title = `【2026年最新】${kw}とは？基礎と始め方をわかりやすく解説`;
  const tbdesc = `${kw}とは何か。AI検索時代に企業が取り組むべきポイントと始め方を、トリリオンバンクがわかりやすく解説します。`;
  const front = `---\ntitle: "${title}"\ndate: ${date}\ncategory: ${category}\ntbdesc: "${tbdesc}"\nkeywords: "${kw},AIO,LLMO,AI検索最適化,Trillion Bank,トリリオンバンク"\n---\n\n`;

  const path = join(OUT_DIR, `${date}-${slugify(kw)}.md`);
  await writeFile(path, front + body + "\n");
  console.log(`  ✓ 生成: _tbnews/${date}-${slugify(kw)}.md`);
  console.log("  → git add _tbnews && commit & push で自社メディアに公開されます");
}

main();
