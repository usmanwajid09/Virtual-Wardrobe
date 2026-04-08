const express = require('express');
const router = express.Router();
const sql = require('mssql');
const poolPromise = require('../db');
const authenticateToken = require('../middleware/auth');

let mockOutfits = [
    { outfit_id: 1, user_id: 1, outfit_name: 'The Effortless Standard', style_category: 'Casual', season: 'All', created_at: '2026-04-07' },
    { outfit_id: 2, user_id: 1, outfit_name: 'Smart Evening Flow', style_category: 'Formal', season: 'Winter', created_at: '2026-04-07' }
];

router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;

  const pool = await poolPromise;
  if (!pool) return res.json(mockOutfits);

  try {
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Outfits WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outfits', details: err.message });
  }
});

module.exports = router;
