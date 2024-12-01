
const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

// Fetch slides for a presentation
router.get("/:presentationId", async (req, res) => {
  const { presentationId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM slides WHERE presentation_id = $1",
      [presentationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching slides");
  }
});

// Add a new slide to a presentation
router.post("/:presentationId", async (req, res) => {
  const { presentationId } = req.params;
  try {
    const result = await pool.query(
      "INSERT INTO slides (presentation_id) VALUES ($1) RETURNING *",
      [presentationId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding slide");
  }
});

module.exports = router;
