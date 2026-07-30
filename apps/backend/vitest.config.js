import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

config({ path: '.env.development'});

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
    testTimeout: 10000, // DB-hitting integration tests can be slower than pure unit tests
  },
});