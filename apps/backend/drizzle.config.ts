import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';

// manage migrations only from dev environment
config({ path: '.env.development'});
const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: isTest 
      ? process.env.TEST_DATABASE_URL! 
      : process.env.MIGRATIONS_DATABASE_URL!,
  },
});
