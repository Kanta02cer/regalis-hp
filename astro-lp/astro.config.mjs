// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // 本番ドメイン確定後に差し替え
  vite: {
    plugins: [tailwindcss()],
  },
});
