/** Files that ESLint ignores but lint-staged globs would still pass to it. */
const ESLINT_IGNORED = [/apps\/web\/next-env\.d\.ts$/];

export default {
  // TypeScript and JavaScript source files — format then lint.
  // Filter out files that ESLint explicitly ignores to avoid the
  // "File ignored because of a matching ignore pattern" warning that would
  // fail --max-warnings=0.
  '**/*.{ts,tsx,js,jsx,mjs,cjs}': [
    'prettier --write',
    (files) => {
      const lintable = files.filter((f) => !ESLINT_IGNORED.some((re) => re.test(f)));
      if (lintable.length === 0) return [];
      return [`eslint --fix --max-warnings=0 ${lintable.join(' ')}`];
    },
  ],

  // JSON, Markdown, YAML, CSS — format only
  '**/*.{json,md,yaml,yml,css}': ['prettier --write'],
};
