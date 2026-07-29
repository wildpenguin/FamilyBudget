import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';

// manage migrations only from dev environment
config({ path: '.env.development'});

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MIGRATIONS_DATABASE_URL!,
  },
});
