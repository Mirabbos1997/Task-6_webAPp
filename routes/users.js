
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

// Add a user to the users table
router.post("/users", async (req, res) => {
  const { presentation_id, nickname, role } = req.body;

  if (!presentation_id || !nickname) {
    return res.status(400).json({ error: "Presentation ID and nickname are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (presentation_id, nickname, role) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
      [presentation_id, nickname, role || "Viewer"] // Default role is Viewer
    );
    res.status(201).json({ message: "User added successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
