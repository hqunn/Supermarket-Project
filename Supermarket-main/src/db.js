const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to initialize tables
const initDB = async () => {
  try { 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(100)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        task TEXT
      );
    `);

    console.log('Tables created or verified!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

// Immediately initialize tables when the app starts
initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};

