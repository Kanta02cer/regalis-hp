#!/usr/bin/env node
/**
 * ブログ下書き自動生成パイプライン。
 *
 *   ネタ選定 → AIによる執筆 → 安全チェック → MDX生成 → 下書きブランチへコミット（→PR）
 *
 * 使い方:
 *   node scripts/auto_blog.js --topic "AIエージェントの業務活用"
 *   node scripts/auto_blog.js --topic "..." --push        # 下書きブランチをpushしPRを作成
 *
 * 重要な設計方針:
 *   - 生成物は必ず draft:true / reviewStatus:pending（人間レビュー前は本番公開されない）
 *   - main には直接コミットしない。blog-draft/<slug> ブランチにのみコミットする
 *   - 公開禁止キーワード（content_safety_rules.yaml）を検出したら生成を中止する
 *
 * 環境変数:
 *   ANTHROPIC_API_KEY … 設定時はClaude APIで本文生成。未設定時はテンプレートのスタブ生成
 *   BLOG_MODEL        … 生成に使うモデル（既定: claude-sonnet-5）
 *   GITHUB_TOKEN      … --push 時にPRを作成する場合に使用
 *   GITHUB_REPO       … "owner/repo"（--push でPR作成時に使用）
 */
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(root, 'src/content/blog');
const MODEL = process.env.BLOG_MODEL ?? 'claude-sonnet-5';

// ── 引数パース ─────────────────────────────────────────────
function getArg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}
const doPush = process.argv.includes('--push');

// ── ネタ選定（--topic 指定 or 候補から先頭を採用） ──────────
const topicCandidates = [
  'AIエージェントの業務活用と導入ステップ',
  '中小企業のためのAIガバナンス入門',
  '生成AIの社内利用ルールの作り方',
  'RAGとは何か — 社内文書をAIに活用させる仕組み',
];
const topic = getArg('topic') ?? topicCandidates[0];

// ── slug生成（日本語→簡易ローマ字ではなく日付+連番ベース） ──
function toSlug(input) {
  const ascii = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return ascii || `post-${Date.now()}`;
}
const slug = getArg('slug') ?? toSlug(topic);

// ── 本文生成 ───────────────────────────────────────────────
async function generateArticle(topic) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const guardrail = `
制約（必ず守ること）:
- 断定・誇張表現を使わない（「必ず」「100%」「保証」など）
- 未確認の実績・顧客名・数値を書かない
- 会社の登記・増資・資本政策・役員・契約・API仕様には一切触れない
- 一般的なAI導入・研修・DXの実務知見のみを扱う
- 見出しは ## / ### のMarkdownでH2/H3を使う`;

  if (!apiKey) {
    console.log('（ANTHROPIC_API_KEY 未設定 → テンプレートのスタブを生成します）');
    return [
      `## ${topic}とは`,
      '',
      `本記事では「${topic}」について、法人での実務活用の観点から整理します。`,
      '',
      '## なぜ今注目されるのか',
      '',
      '（ここにAIが生成した本文が入ります。公開前に必ず人手で編集・確認してください。）',
      '',
      '## 導入の進め方',
      '',
      '- 現状の業務とデータを診断する',
      '- 効果の出やすい領域からPoCを行う',
      '- 効果測定のうえで展開範囲を広げる',
      '',
      '## まとめ',
      '',
      'AI導入は診断から始めるのが定石です。ご相談は無料診断からお気軽にどうぞ。',
    ].join('\n');
  }

  const prompt = `あなたは法人向けAI導入支援企業のブログ編集者です。次のテーマで、日本語の記事本文（Markdown、1000〜1400字程度）を書いてください。${guardrail}\n\nテーマ: ${topic}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.content.map((c) => c.text).join('');
}

// ── フロントマター付きMDXを組み立て ───────────────────────
function buildMdx({ title, description, body, sourceUrl, sourceName }) {
  // pubDateは呼び出し側でISO文字列を渡す（Date.now系はCI外で固定するため引数化）
  const today = new Date().toISOString().slice(0, 10);
  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${today}`,
    'category: "AI活用"',
    'draft: true',
    'reviewStatus: pending',
    'aiGenerated: true',
    ...(sourceUrl ? [`sourceUrl: ${JSON.stringify(sourceUrl)}`] : []),
    ...(sourceName ? [`sourceName: ${JSON.stringify(sourceName)}`] : []),
    '---',
    '',
  ].join('\n');
  return fm + body + '\n';
}

// ── git操作（main を汚さない） ─────────────────────────────
function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

async function main() {
  console.log(`テーマ: ${topic}`);
  console.log(`slug:   ${slug}`);

  const body = await generateArticle(topic);
  const title = topic;
  const description = `${topic}について、法人での実務活用の観点から解説します。`;
  const mdx = buildMdx({
    title,
    description,
    body,
    sourceUrl: getArg('source-url'),
    sourceName: getArg('source-name'),
  });

  if (!existsSync(BLOG_DIR)) mkdirSync(BLOG_DIR, { recursive: true });
  const filePath = join(BLOG_DIR, `${slug}.mdx`);
  writeFileSync(filePath, mdx, 'utf8');
  console.log(`生成: ${filePath}`);

  // ── 安全チェック（公開禁止キーワードがあれば中止して削除） ──
  try {
    execFileSync('node', [join(root, 'scripts/check-content-safety.mjs'), filePath], {
      cwd: root,
      stdio: 'inherit',
    });
  } catch {
    rmSync(filePath);
    console.error('安全チェックに失敗したため下書きを削除しました。');
    process.exit(1);
  }

  // ── 下書きブランチへコミット（main へは触れない） ──────────
  const branch = `blog-draft/${slug}`;
  const current = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  git(['checkout', '-B', branch]);
  git(['add', filePath]);
  git(['commit', '-m', `draft(blog): ${title}`]);
  console.log(`コミット完了: ブランチ ${branch}`);

  if (doPush) {
    git(['push', '-u', 'origin', branch]);
    console.log(`push完了: origin/${branch}`);
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    if (repo && token) {
      const pr = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({
          title: `draft(blog): ${title}`,
          head: branch,
          base: current,
          body: '自動生成されたブログ下書きです。**公開前に必ず人手でレビューし、`draft: true` を外してください。**',
        }),
      });
      if (pr.ok) {
        const { html_url } = await pr.json();
        console.log(`PR作成: ${html_url}`);
      } else {
        console.error(`PR作成に失敗: ${pr.status} ${await pr.text()}`);
      }
    } else {
      console.log('GITHUB_REPO / GITHUB_TOKEN 未設定のためPRは手動で作成してください。');
    }
  } else {
    console.log('--push 未指定のためローカルのみ。確認後、手動でpush/PRしてください。');
  }

  console.log(
    `\n次の手順:\n  1) ${filePath} を編集・ファクトチェック\n  2) フロントマターの draft を false、reviewStatus を reviewed に\n  3) PRをレビュー・マージ`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
