const { Client } = require('pg');

async function testConnection() {
  console.log('Testing PostgreSQL connection to 127.0.0.1:5432 / whatsapp_dev...');

  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'whatsapp',
    password: 'whatsapp',
    database: 'whatsapp_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to PostgreSQL database!');

    const resNow = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('   Server Time:', resNow.rows[0].current_time);
    console.log('   PG Version:', resNow.rows[0].pg_version.split('\n')[0]);

    // Check existing tables in whatsapp_dev
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📋 Found ${resTables.rows.length} tables in database "whatsapp_dev":`);
    resTables.rows.forEach(r => console.log('   - ' + r.table_name));

    await client.end();
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    if (err.code) console.error('   Error Code:', err.code);
  }
}

testConnection();
