const { Pool } = require('pg');
require('dotenv').config(); //.env okur ve process.env içine yukler

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'istanbul_gezi',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

async function testDbConnection() {
  const result = await pool.query('SELECT NOW() as now, current_database() as database_name');
  return result.rows[0];
}

module.exports = { //pool ve testDbConnection fonksiyonunu export ediyoruz
  pool,
  testDbConnection,
};
