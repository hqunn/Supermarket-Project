const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool connection

// Example: GET /api/profile?userid=4
router.get('/', async (req, res) => {
  const { userid } = req.query;

  if (!userid) {
    return res.status(400).json({ error: 'userid is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM Customer WHERE UserID = $1',
      [userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]); // Sends the full customer profile
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
