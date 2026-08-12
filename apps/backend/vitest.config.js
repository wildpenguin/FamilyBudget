import { config } from "dotenv";
import { defineConfig } from "vitest/config";

config({ path: ".env.development" });

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		setupFiles: ["./src/tests/setup.ts"],
		silent: false,
		fileParallelism: false, // integration tests share one real DB; parallel files truncate each other's data
		env: {
			NODE_ENV: "test",
			DATABASE_URL: process.env.TEST_DATABASE_URL,
		},
		testTimeout: 10000, // DB-hitting integration tests can be slower than pure unit tests
	},
});
