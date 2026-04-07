const express = require('express');
const router = express.Router();
const sql = require('mssql');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// CREATE (Link Cloth to Outfit)
router.post('/', authenticateToken, async (req, res) => {
  const { outfit_id, cloth_id } = req.body;
  try {
    const request = (await pool).request();
    request.input('outfit_id', sql.Int, outfit_id);
    request.input('cloth_id', sql.Int, cloth_id);
    await request.query('INSERT INTO Outfit_Clothes (outfit_id, cloth_id) VALUES (@outfit_id, @cloth_id)');
    res.status(201).json({ message: 'Cloth linked to outfit' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link cloth to outfit', details: err.message });
  }
});

// READ All Outfit-Cloth Links
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Outfit_Clothes WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outfit-cloth links', details: err.message });
  }
});

// READ Single Link (Outfit-Cloth)
router.get('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const outfit_cloth_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_cloth_id', sql.Int, outfit_cloth_id);
    const result = await request.query('SELECT * FROM Outfit_Clothes WHERE outfit_cloth_id = @outfit_cloth_id AND user_id = @user_id');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Outfit-Cloth link not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch link', details: err.message });
  }
});

// DELETE Outfit-Cloth Link
router.delete('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const outfit_cloth_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('outfit_cloth_id', sql.Int, outfit_cloth_id);
    await request.query('DELETE FROM Outfit_Clothes WHERE outfit_cloth_id = @outfit_cloth_id AND user_id = @user_id');
    res.json({ message: 'Outfit-Cloth link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete link', details: err.message });
  }
});

module.exports = router;

