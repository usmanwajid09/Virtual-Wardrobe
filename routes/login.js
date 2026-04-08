const express = require('express');
const router = express.Router();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const poolPromise = require('../db');
const usersRoute = require('./users'); // To access the shared mock database

// POST /api/login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const signToken = (user) => jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' }
  );

  const pool = await poolPromise;
  if (!pool) {
      // In-Memory Mock Fallback
      const user = usersRoute.mockUsers.find(u => u.email === email && u.password === password);
      if (!user) {
          return res.status(401).json({ error: 'Invalid mock credentials' });
      }
      return res.json({ token: signToken(user) });
  }

  try {
    const request = pool.request();
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
    res.json({ token: signToken(user) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
