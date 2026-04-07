const express = require('express');
const router = express.Router();
const sql = require('mssql');
const pool = require('../db');

// CREATE a user
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const request = (await pool).request();
    request.input('username', sql.VarChar, username);
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    await request.query(`
      INSERT INTO Users (username, email, password)
      VALUES (@username, @email, HASHBYTES('SHA2_256', @password))
    `);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const result = await (await pool).request().query('SELECT user_id, username, email FROM Users');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// READ single user by ID
router.get('/:id', async (req, res) => {
  try {
    const request = (await pool).request();
    request.input('id', sql.Int, req.params.id);
    const result = await request.query('SELECT user_id, username, email FROM Users WHERE user_id = @id');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const request = (await pool).request();
    request.input('id', sql.Int, req.params.id);
    request.input('username', sql.VarChar, username);
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    await request.query(`
      UPDATE Users
      SET username = @username,
          email = @email,
          password = HASHBYTES('SHA2_256', @password)
      WHERE user_id = @id
    `);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const request = (await pool).request();
    request.input('id', sql.Int, req.params.id);
    await request.query('DELETE FROM Users WHERE user_id = @id');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

module.exports = router;

