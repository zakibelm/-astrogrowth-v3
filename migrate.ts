import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb } from "./server/db";

async function runMigration() {
    console.log("Starting migration...");
    const db = await getDb();
    if (!db) {
        console.error("Failed to connect to database");
        process.exit(1);
    }

    try {
        // This assumes migrations are in the "drizzle" folder relative to execution
        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

runMigration();
