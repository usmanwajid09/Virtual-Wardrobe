const express = require('express');
const router = express.Router();
const sql = require('mssql');
const poolPromise = require('../db');
const authenticateToken = require('../middleware/auth');

let mockClothes = [
  { cloth_id: 1, user_id: 1, cloth_name: 'Navy Blazer', type: 'Outerwear', color: 'Navy', brand: 'Custom', season: 'Winter', image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop' },
  { cloth_id: 2, user_id: 1, cloth_name: 'White Linen Shirt', type: 'Topwear', color: 'White', brand: 'Uniqlo', season: 'Summer', image_url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=400&auto=format&fit=crop' },
  { cloth_id: 3, user_id: 1, cloth_name: 'Blue Denim Jeans', type: 'Bottomwear', color: 'Blue', brand: 'Levis', season: 'All', image_url: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=400&auto=format&fit=crop' },
  { cloth_id: 4, user_id: 1, cloth_name: 'Evening Maxi Gown', type: 'Dress', color: 'Red', brand: 'Zara', season: 'All', image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=400&auto=format&fit=crop' }
];
let nextId = 5;

router.post('/', authenticateToken, async (req, res) => {
  const { cloth_name, type, color, brand, season, image_url } = req.body;
  const user_id = req.user.user_id;

  const pool = await poolPromise;
  if (!pool) {
    mockClothes.push({ cloth_id: nextId++, user_id, cloth_name, type, color, brand, season, image_url });
    return res.status(201).json({ message: 'Clothing item added (Mock Mode)' });
  }

  try {
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_name', sql.VarChar, cloth_name);
    request.input('type', sql.VarChar, type);
    request.input('color', sql.VarChar, color);
    request.input('brand', sql.VarChar, brand);
    request.input('season', sql.VarChar, season);
    request.input('image_url', sql.VarChar, image_url);
    await request.query(`INSERT INTO Clothes (user_id, cloth_name, type, color, brand, season, image_url) VALUES (@user_id, @cloth_name, @type, @color, @brand, @season, @image_url)`);
    res.status(201).json({ message: 'Clothing item added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add cloth', details: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const pool = await poolPromise;
  if (!pool) return res.json(mockClothes);

  try {
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Clothes WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clothes', details: err.message });
  }
});

// UPDATE
router.put('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const cloth_id = parseInt(req.params.id);
  const { cloth_name, type, color, brand, season, image_url } = req.body;
  
  const pool = await poolPromise;
  if (!pool) {
      const idx = mockClothes.findIndex(c => c.cloth_id === cloth_id && c.user_id === user_id);
      if(idx === -1) return res.status(404).json({ message: 'Clothing item not found' });
      mockClothes[idx] = { ...mockClothes[idx], cloth_name, type, color, brand, season, image_url };
      return res.json({ message: 'Clothing item updated (Mock Mode)' });
  }

  try {
    const request = pool.request();
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
  
  const pool = await poolPromise;
  if (!pool) {
      const initLen = mockClothes.length;
      mockClothes = mockClothes.filter(c => !(c.cloth_id === cloth_id && c.user_id === user_id));
      if (mockClothes.length === initLen) return res.status(404).json({ message: 'Clothing item not found' });
      return res.json({ message: 'Clothing item deleted (Mock Mode)' });
  }

  try {
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    request.input('cloth_id', sql.Int, cloth_id);
    await request.query('DELETE FROM Clothes WHERE cloth_id = @cloth_id AND user_id = @user_id');
    res.json({ message: 'Clothing item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
});

module.exports = router;
