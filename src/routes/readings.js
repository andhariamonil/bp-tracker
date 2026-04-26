const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET readings by person_id
router.get('/:personId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM readings
       WHERE person_id = $1
       ORDER BY created_at DESC`,
      [req.params.personId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create reading
router.post('/', async (req, res) => {
  const { person_id, upper, lower, pulse, time } = req.body;

  if (!person_id || !upper || !lower || !pulse || !time)
    return res.status(400).json({ error: 'All fields required' });

  const u = parseInt(upper), l = parseInt(lower), p = parseInt(pulse);
  if (isNaN(u) || isNaN(l) || isNaN(p))
    return res.status(400).json({ error: 'Values must be numbers' });
  if (u < 50 || u > 300 || l < 30 || l > 200 || p < 20 || p > 250)
    return res.status(400).json({ error: 'Values out of physiological range' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO readings (person_id, upper_bp, lower_bp, pulse, reading_time)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [person_id, u, l, p, time]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a reading
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM readings WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;