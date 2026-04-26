const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET all persons
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM persons ORDER BY name ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or get person by name
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'Name is required' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO persons (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name.trim().toLowerCase()]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;