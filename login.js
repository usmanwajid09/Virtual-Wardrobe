const express = require('express');
const router = express.Router();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../db');

// POST /api/login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const request = (await pool).request();
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);

    const result = await request.query(`
      SELECT user_id, username
      FROM Users
      WHERE email = @email AND password = HASHBYTES('SHA2_256', @password)
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    // Create JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
