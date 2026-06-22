// scripts/wait-for-db.js
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log('No DATABASE_URL provided. Skipping database readiness check.');
  process.exit(0);
}

const client = new Client({
  connectionString,
});

async function checkConnection() {
  try {
    await client.connect();
    console.log('✅ Database is ready and reachable.');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.log('⏳ Waiting for PostgreSQL database to start up...');
    setTimeout(checkConnection, 2000);
  }
}

checkConnection();
