import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * ブログ記事コレクション（MDX）。
 * scripts/auto_blog.js が生成する自動ドラフトも同じスキーマに従う。
 * draft: true の記事は本番ビルド（import.meta.env.PROD）では一覧・詳細に出さない。
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default('AI活用'),
    tags: z.array(z.string()).default([]),
    /** 下書き（人間レビュー前）。本番では非公開 */
    draft: z.boolean().default(false),
    /** 自動生成の出典（AIドラフト時に必須） */
    sourceUrl: z.string().url().optional(),
    sourceName: z.string().optional(),
    /** レビュー状態: pending / reviewed */
    reviewStatus: z.enum(['pending', 'reviewed']).default('reviewed'),
    /** AIが下書きを生成した記事かどうか */
    aiGenerated: z.boolean().default(false),
  }),
});

export const collections = { blog };
