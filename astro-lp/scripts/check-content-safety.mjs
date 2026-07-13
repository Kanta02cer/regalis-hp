#!/usr/bin/env node
/**
 * 公開前コンテンツ安全チェック。
 *
 *   node scripts/check-content-safety.mjs [path ...]
 *
 * 引数なしの場合は src/content 以下を再帰スキャンする。
 * content_safety_rules.yaml の hard_block / needs_legal_review / risky_claim を
 * タイトル・本文・フロントマターすべてに対して検査する。
 *
 * 終了コード:
 *   0 … hard_block なし（needs_legal_review / risky_claim は警告のみ）
 *   1 … hard_block を検出（公開不可）
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rules = parseYaml(readFileSync(join(root, 'content_safety_rules.yaml'), 'utf8'));

const targets = process.argv.slice(2);
const scanRoots = targets.length > 0 ? targets : [join(root, 'src/content')];

function collectFiles(path) {
  if (!existsSync(path)) return [];
  const st = statSync(path);
  if (st.isFile()) return /\.(md|mdx)$/.test(path) ? [path] : [];
  return readdirSync(path).flatMap((entry) => collectFiles(join(path, entry)));
}

/** 本文中でキーワードが登場する最初の行番号を返す（見つからなければ0） */
function findLine(text, keyword) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(keyword)) return i + 1;
  }
  return 0;
}

const files = scanRoots.flatMap(collectFiles);
let hardBlockCount = 0;
let warnCount = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const rel = file.replace(`${root}/`, '');

  const scan = (list, severity) => {
    for (const keyword of list ?? []) {
      if (text.includes(keyword)) {
        const line = findLine(text, keyword);
        const mark =
          severity === 'hard_block' ? '⛔ [公開不可]' :
          severity === 'needs_legal_review' ? '⚠️  [要法務確認]' :
          '✏️  [要書き換え]';
        console.log(`${mark} ${rel}:${line}  「${keyword}」`);
        if (severity === 'hard_block') hardBlockCount++;
        else warnCount++;
      }
    }
  };

  scan(rules.hard_block, 'hard_block');
  scan(rules.needs_legal_review, 'needs_legal_review');
  scan(rules.risky_claim, 'risky_claim');
}

console.log(
  `\nスキャン ${files.length} ファイル — 公開不可 ${hardBlockCount}件 / 要確認 ${warnCount}件`
);

if (hardBlockCount > 0) {
  console.error('\n公開禁止キーワードを検出しました。公開できません。');
  process.exit(1);
}
process.exit(0);
