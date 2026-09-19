import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default ts.config(
  { ignores: ['dist/**', '.astro/**', '.wrangler/**', 'node_modules/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs['flat/recommended'],
  { files: ['**/*.{js,mjs,ts,tsx,astro}'], languageOptions: { globals: { URL: 'readonly', URLSearchParams: 'readonly', Response: 'readonly', Request: 'readonly', FormData: 'readonly', fetch: 'readonly', console: 'readonly', process: 'readonly', document: 'readonly', window: 'readonly', HTMLElement: 'readonly', HTMLImageElement: 'readonly', HTMLFormElement: 'readonly', HTMLInputElement: 'readonly', HTMLButtonElement: 'readonly', IntersectionObserver: 'readonly', AbortSignal: 'readonly', crypto: 'readonly', setTimeout: 'readonly' } } },
);
