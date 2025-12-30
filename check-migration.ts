
import { db } from "./server/db";
import { users } from "./drizzle/schema";
import { sql } from "drizzle-orm";

async function checkSchema() {
    try {
        // Check if users table exists and has password column
        const result = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password';
    `);

        console.log("Password column Check:", result.rows);

        if (result.rows.length > 0) {
            console.log("SUCCESS: Password column exists.");
        } else {
            console.log("FAILURE: Password column MISSING.");
        }
    } catch (error) {
        console.error("DB Check Failed:", error);
    }
    process.exit(0);
}

checkSchema();
