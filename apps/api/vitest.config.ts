import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.module.ts',
        'src/main.ts',
        'src/**/*.dto.ts',
        '**/__mocks__/**',
        '**/*.spec.ts',
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 70,
        'src/modules/**': {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  },
});
