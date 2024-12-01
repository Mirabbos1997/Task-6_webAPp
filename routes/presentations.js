
const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

// Fetch all presentations
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM presentations");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching presentations");
  }
});

// Create a new presentation
// router.post("/", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO presentations (name) VALUES ($1) RETURNING *",
//       [name]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating presentation");
//   }
// });

// Create a new presentation
router.post("/create", async (req, res) => {
  const { title, creator } = req.body;
  if (!title || !creator) {
    return res.status(400).send("Title and Creator are required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO presentations (title, creator) VALUES ($1, $2) RETURNING *",
      [title, creator]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating presentation:", error);
    res.status(500).send("Server Error");
  }
});

// Join a presentation
router.post('/join/:id', async (req, res) => {
  const { id } = req.params; // presentation ID
  const { nickname } = req.body; // user nickname

  try {
    // Check if the presentation exists
    const presentation = await pool.query('SELECT * FROM presentations WHERE id = $1', [id]);

    if (presentation.rows.length === 0) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    // Insert user into the `users` table
    await pool.query(
      'INSERT INTO users (presentation_id, nickname) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, nickname]
    );

    res.status(200).json({ message: `User ${nickname} joined presentation ${id}` });
  } catch (error) {
    console.error('Error joining presentation:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
