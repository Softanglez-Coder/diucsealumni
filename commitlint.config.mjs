export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    'subject-full-stop': [2, 'never', '.'],
    'body-max-line-length': [2, 'always', 120],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert'],
    ],
  },
};
