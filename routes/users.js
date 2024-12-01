
const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

// Fetch users in a presentation
router.get("/:presentationId", async (req, res) => {
  const { presentationId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE presentation_id = $1",
      [presentationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  }
});

// Add a user to a presentation
router.post("/", async (req, res) => {
  const { nickname, role, presentationId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (nickname, role, presentation_id) VALUES ($1, $2, $3) RETURNING *",
      [nickname, role, presentationId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding user");
  }
});

module.exports = router;
