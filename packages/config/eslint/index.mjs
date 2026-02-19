/**
 * Shared ESLint flat-config helpers for the CSE DIU Alumni monorepo.
 *
 * Each app imports these and composes its own eslint.config.mjs — see
 * apps/api/eslint.config.mjs and apps/web/eslint.config.mjs for examples.
 *
 * ESLint v9 flat config — NOT the legacy .eslintrc format.
 */
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';

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

const commonRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  'import/order': importOrderRule,
  'import/no-duplicates': 'error',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/no-null': 'off',
  'unicorn/prefer-module': 'off',
  'unicorn/filename-case': ['error', { case: 'kebabCase' }],
  'unicorn/no-process-exit': 'off',
};

/**
 * Non-type-checked flat config entries for TypeScript files.
 * Suitable for use in root eslint.config.mjs (lint-staged) or app configs.
 */
const base = [
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  unicornPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: { import: importPlugin },
    languageOptions: { parser: tsParser },
    settings: { 'import/resolver': { node: true } },
    rules: commonRules,
  },
];

/**
 * Type-checked flat config entries.
 * @param {string} tsconfigRootDir - Absolute path to the app directory.
 */
function typeChecked(tsconfigRootDir) {
  return [
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended-type-checked'],
    unicornPlugin.configs['flat/recommended'],
    {
      files: ['**/*.{ts,tsx}'],
      plugins: { import: importPlugin },
      languageOptions: {
        parser: tsParser,
        parserOptions: { projectService: true, tsconfigRootDir },
      },
      settings: { 'import/resolver': { node: true } },
      rules: {
        ...commonRules,
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
      },
    },
  ];
}

export { base, typeChecked, importOrderRule, commonRules };
