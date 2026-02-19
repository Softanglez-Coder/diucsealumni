import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,

  // Type-checked TypeScript rules — projectService auto-discovers tsconfig.json
  ...tsPlugin.configs['flat/recommended-type-checked'],

  unicornPlugin.configs['flat/recommended'],

  {
    files: ['src/**/*.ts'],
    plugins: { import: importPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
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
      // Downgrade noisy type-checked rules to warnings during migration
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Prisma-generated types aren't resolvable by ESLint's project service
      '@typescript-eslint/no-redundant-type-constituents': 'warn',

      // Import ordering
      'import/order': importOrderRule,
      'import/no-duplicates': 'error',

      // Unicorn
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/no-process-exit': 'off',
      // CommonJS module system — top-level await is not available
      'unicorn/prefer-top-level-await': 'off',
    },
  },

  // Test files — relax some rules
  {
    files: ['src/**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
];
