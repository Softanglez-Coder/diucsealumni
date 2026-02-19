import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';

/** Shared import/order rule config used across all workspaces. */
const importOrderRule = [
  'error',
  {
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    pathGroups: [{ pattern: '@csediualumni/**', group: 'internal', position: 'before' }],
    pathGroupsExcludedImportTypes: ['builtin'],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

export default [
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      'packages/prisma/generated/**',
      'pnpm-lock.yaml',
      // Auto-generated Next.js type declaration — not lintable
      'apps/web/next-env.d.ts',
    ],
  },

  // ── Base JS rules ───────────────────────────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript recommended (non-type-checked) ───────────────────────────────
  // Covers **/*.{ts,tsx,mts,cts} — sets up the TS parser & base rules.
  ...tsPlugin.configs['flat/recommended'],

  // ── Unicorn recommended ─────────────────────────────────────────────────────
  unicornPlugin.configs['flat/recommended'],

  // ── Project-wide overrides & import ordering ────────────────────────────────
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: { import: importPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    settings: {
      'import/resolver': { node: true },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import ordering
      'import/order': importOrderRule,
      'import/no-duplicates': 'error',

      // Unicorn — disable rules that conflict with project conventions
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      // Next.js / NestJS patterns that unicorn doesn't like
      'unicorn/no-process-exit': 'off',
      // NestJS bootstrap uses async function bootstrap() {} — not top-level await
      'unicorn/prefer-top-level-await': 'off',
      // NestJS/Next.js commonly use forEach, Array.from, etc.
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-push-push': 'off',
      // Decorator-heavy NestJS code often uses class patterns unicorn dislikes
      'unicorn/no-static-only-class': 'off',
      // Allow common abbreviations used throughout NestJS/Next.js ecosystems
      'unicorn/prefer-string-slice': 'warn',
      // Named imports from node: builtins (e.g. import { dirname } from 'node:path') are fine
      'unicorn/import-style': 'off',
    },
  },
];
