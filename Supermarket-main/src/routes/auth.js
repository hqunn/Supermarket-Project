// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// Signup
router.post("/signup", async (req, res) => {
  console.log("🔥 /signup request body:", req.body);
  const { username, password, email, phonenumber, address } = req.body;

  if (!username || !password || !email || !phonenumber || !address) {
    return res
      .status(400)
      .json({ error: "username, password, email, phonenumber & address are all required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );
    const userId = result.rows[0].id;

    // Insert into customer table with address
    const custRes = await pool.query(
      "INSERT INTO customer (name, email, phonenumber, address, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, email, phonenumber, address, userId]
    );

    console.log("✅ inserted customer row:", custRes.rows[0]);

    res.status(201).json({
      message: "User and customer created",
      userId,
      customer: custRes.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Signup failed" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
