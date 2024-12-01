const { Pool } = require("pg");

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // For hosted databases like Render
});

const initializeDatabase = async () => {
  try {
    console.log("Initializing database...");

    // Create `presentations` table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS presentations (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                creator VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Create `users` table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                presentation_id INTEGER NOT NULL,
                nickname VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'Viewer',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (presentation_id) REFERENCES presentations (id) ON DELETE CASCADE
            );
        `);

    console.log("Tables created successfully!");

    // Insert initial data
    const result = await pool.query(`
            INSERT INTO presentations (title, creator)
            VALUES
            ('First Presentation', 'Admin'),
            ('Second Presentation', 'Admin')
            ON CONFLICT DO NOTHING
            RETURNING id;
        `);

    console.log("Initial data inserted successfully!");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
};

module.exports = initializeDatabase;

module.exports = pool;