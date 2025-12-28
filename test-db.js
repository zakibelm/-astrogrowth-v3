import pg from 'pg';
const { Client } = pg;

// New credentials provided by user
const connectionString = "postgresql://neondb_owner:npg_R8HoU03dYrHz@ep-plain-term-a4jyxpbs-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require";

async function test() {
    console.log(`Testing connection to: ${connectionString.split('@')[1]}`);
    const client = new Client({
        connectionString,
        connectionTimeoutMillis: 10000,
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully!');
        const res = await client.query('SELECT version();');
        console.log('Version:', res.rows[0].version);
        await client.end();
    } catch (err) {
        console.error('❌ Failed:', err.message);
        if (err.code) console.error('Code:', err.code);

        // Fallback test: Try without channel_binding if the first one fails (common issue with poolers)
        if (connectionString.includes('channel_binding=require')) {
            console.log('\nRetrying without channel_binding...');
            const client2 = new Client({
                connectionString: connectionString.replace('&channel_binding=require', ''),
                connectionTimeoutMillis: 10000,
            });
            try {
                await client2.connect();
                console.log('✅ Connected successfully (without channel_binding)!');
                await client2.end();
            } catch (err2) {
                console.error('❌ Failed again:', err2.message);
            }
        }
    }
}

test();
