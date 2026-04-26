const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET all records for a person
router.get('/:personId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM records
       WHERE person_id = $1
       ORDER BY record_date DESC, record_time DESC`,
      [req.params.personId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a daily average record
router.post('/', async (req, res) => {
  const { person_id, avg_upper, avg_lower, avg_pulse, record_date, record_time } = req.body;

  if (!person_id || avg_upper == null || avg_lower == null || avg_pulse == null)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO records
         (person_id, avg_upper, avg_lower, avg_pulse, record_date, record_time)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [person_id, avg_upper, avg_lower, avg_pulse, record_date, record_time]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a record
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM records WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;