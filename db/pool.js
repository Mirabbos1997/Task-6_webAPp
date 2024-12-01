const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for hosted databases like Render
  },
});

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    await pool.query(`
          CREATE TABLE IF NOT EXISTS presentations (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              creator VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      `);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

// Call the initialization function
initializeDatabase();

module.exports = pool;
