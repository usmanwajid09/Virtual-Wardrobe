const express = require('express');
const router = express.Router();
const sql = require('mssql');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// CREATE
router.post('/', authenticateToken, async (req, res) => {
  const { cloth_name, type, color, brand, season, image_url } = req.body;
  const user_id = req.user.user_id;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_name', sql.VarChar, cloth_name);
    request.input('type', sql.VarChar, type);
    request.input('color', sql.VarChar, color);
    request.input('brand', sql.VarChar, brand);
    request.input('season', sql.VarChar, season);
    request.input('image_url', sql.VarChar, image_url);
    await request.query(`INSERT INTO Clothes (user_id, cloth_name, type, color, brand, season, image_url)
                         VALUES (@user_id, @cloth_name, @type, @color, @brand, @season, @image_url)`);
    res.status(201).json({ message: 'Clothing item added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add cloth', details: err.message });
  }
});

// READ ALL
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Clothes WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clothes', details: err.message });
  }
});

// READ SINGLE
router.get('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const cloth_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_id', sql.Int, cloth_id);
    const result = await request.query('SELECT * FROM Clothes WHERE cloth_id = @cloth_id AND user_id = @user_id');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Clothing item not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item', details: err.message });
  }
});

// UPDATE
router.put('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const cloth_id = parseInt(req.params.id);
  const { cloth_name, type, color, brand, season, image_url } = req.body;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_id', sql.Int, cloth_id);
    request.input('cloth_name', sql.VarChar, cloth_name);
    request.input('type', sql.VarChar, type);
    request.input('color', sql.VarChar, color);
    request.input('brand', sql.VarChar, brand);
    request.input('season', sql.VarChar, season);
    request.input('image_url', sql.VarChar, image_url);
    await request.query(`UPDATE Clothes SET cloth_name = @cloth_name, type = @type, color = @color,
                         brand = @brand, season = @season, image_url = @image_url
                         WHERE cloth_id = @cloth_id AND user_id = @user_id`);
    res.json({ message: 'Clothing item updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item', details: err.message });
  }
});

// DELETE
router.delete('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const cloth_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_id', sql.Int, cloth_id);
    await request.query('DELETE FROM Clothes WHERE cloth_id = @cloth_id AND user_id = @user_id');
    res.json({ message: 'Clothing item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
});

module.exports = router;