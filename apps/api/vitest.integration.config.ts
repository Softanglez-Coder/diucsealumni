import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Integration tests live in apps/api/test/ and match *.integration-spec.ts
    include: ['test/**/*.integration-spec.ts'],
    // Longer timeout for real DB/Redis round-trips
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Run integration suites serially so DB state is predictable
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
