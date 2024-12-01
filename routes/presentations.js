
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

router.post("/join/:id", async (req, res) => {
  const { nickname } = req.body;
  const { id } = req.params;

  if (!nickname || !id) {
    return res.status(400).send("Nickname and Presentation ID are required");
  }

  try {
    // Check if the user already exists in the presentation
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE nickname = $1 AND presentation_id = $2",
      [nickname, id]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).send("User already joined the presentation");
    }

    // Add user to the presentation
    const result = await pool.query(
      "INSERT INTO users (nickname, presentation_id) VALUES ($1, $2) RETURNING *",
      [nickname, id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error joining presentation:", error);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
