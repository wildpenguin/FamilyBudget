import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Migrations run as the superuser, not the app role, so that ALTER DEFAULT
// PRIVILEGES from db-init applies to the tables they create.
const connectionString = process.env.MIGRATIONS_DATABASE_URL;
if (!connectionString) {
	throw new Error("MIGRATIONS_DATABASE_URL is not set");
}

async function main() {
	const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });
	try {
		await migrate(drizzle({ client: pool }), {
			// Resolved from this file so the cwd of the caller does not matter.
			migrationsFolder: join(__dirname, "..", "migrations"),
		});
		console.log("Migrations applied.");
	} finally {
		await pool.end();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
