const express = require('express');
const router = express.Router();
const sql = require('mssql');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// CREATE Outfit
router.post('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const { outfit_name } = req.body;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_name', sql.VarChar, outfit_name);
    await request.query('INSERT INTO Outfits (user_id, outfit_name) VALUES (@user_id, @outfit_name)');
    res.status(201).json({ message: 'Outfit created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create outfit', details: err.message });
  }
});

// READ All Outfits
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Outfits WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outfits', details: err.message });
  }
});

// READ Single Outfit
router.get('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const outfit_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_id', sql.Int, outfit_id);
    const result = await request.query('SELECT * FROM Outfits WHERE outfit_id = @outfit_id AND user_id = @user_id');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Outfit not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outfit', details: err.message });
  }
});

// UPDATE Outfit
router.put('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const outfit_id = parseInt(req.params.id);
  const { outfit_name } = req.body;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_id', sql.Int, outfit_id);
    request.input('outfit_name', sql.VarChar, outfit_name);
    await request.query(`
      UPDATE Outfits SET outfit_name = @outfit_name
      WHERE outfit_id = @outfit_id AND user_id = @user_id
    `);
    res.json({ message: 'Outfit updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update outfit', details: err.message });
  }
});

// DELETE Outfit
router.delete('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const outfit_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_id', sql.Int, outfit_id);
    await request.query('DELETE FROM Outfits WHERE outfit_id = @outfit_id AND user_id = @user_id');
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete outfit', details: err.message });
  }
});

module.exports = router;
