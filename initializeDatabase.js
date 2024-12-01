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

        // Check if `presentations` table is empty
        const presentationCheck = await pool.query(`
            SELECT COUNT(*) AS count FROM presentations;
        `);

        if (parseInt(presentationCheck.rows[0].count, 10) === 0) {
            // Insert initial data into `presentations`
            const presentationResult = await pool.query(`
                INSERT INTO presentations (title, creator) 
                VALUES 
                ('First Presentation', 'Admin'),
                ('Second Presentation', 'Admin')
                RETURNING id;
            `);

            const presentationId = presentationResult.rows[0].id;

            // Insert initial data into `users`
            await pool.query(`
                INSERT INTO users (presentation_id, nickname, role) 
                VALUES 
                (${presentationId}, 'JohnDoe', 'Editor'),
                (${presentationId}, 'JaneDoe', 'Viewer');
            `);

            console.log("Initial data inserted successfully!");
        } else {
            console.log("Initial data already exists, skipping data insertion.");
        }

    } catch (error) {
        console.error("Error initializing database:", error.message);
    }
};
