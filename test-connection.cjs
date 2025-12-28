const { Pool } = require('pg');

// Credentials for 'appuser' (Solution 1)
const connectionString = "postgresql://appuser:appuser_secure_pwd_123@ep-plain-term-a4jyxpbs.us-east-1.aws.neon.tech:5432/neondb?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000
});

async function testConnection() {
    console.log(`Testing Connection with appuser: ${connectionString.split('@')[1]}`);
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ CONNECTION SUCCESSFUL WITH appuser');
        console.log('Current time:', result.rows[0]);
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ CONNECTION FAILED');
        console.error('Error:', error.message);
        if (error.code) console.error('Code:', error.code);
        process.exit(1);
    }
}

testConnection();
