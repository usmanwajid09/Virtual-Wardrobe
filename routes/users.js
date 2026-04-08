const express = require('express');
const router = express.Router();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const poolPromise = require('../db');
const authenticateToken = require('../middleware/auth');

// In-Memory Mock User Database
let mockUsers = [
    { user_id: 1, username: 'MockUser', email: 'mock@styleiq.com', password: 'mockpassword' }
];
let nextUserId = 2;

// POST /api/users/register (Register a new user)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // JWT creation helper
    const signToken = (user) => jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
    );

    const pool = await poolPromise;
    if (!pool) {
        // Fallback Mock Logic
        if (mockUsers.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const newUser = { user_id: nextUserId++, username, email, password };
        mockUsers.push(newUser);
        return res.status(201).json({ message: 'User created (Mock)', token: signToken(newUser) });
    }

    try {
        const request = pool.request();
        // Check if email exists
        request.input('email', sql.VarChar, email);
        const checkResult = await request.query('SELECT * FROM Users WHERE email = @email');
        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert new user
        request.input('username', sql.VarChar, username);
        // Emulating the previously defined HASHBYTES logic
        request.input('password', sql.VarChar, password); 
        
        await request.query(`
            INSERT INTO Users (username, email, password)
            VALUES (@username, @email, HASHBYTES('SHA2_256', @password))
        `);
        
        // Fetch it back to get ID and issue token
        const fetchUser = await request.query(`SELECT user_id, username FROM Users WHERE email = @email`);
        const token = signToken(fetchUser.recordset[0]);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// GET /api/users/me (Get logged in profile)
router.get('/me', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    
    const pool = await poolPromise;
    if (!pool) {
        const user = mockUsers.find(u => u.user_id === user_id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json({ user_id: user.user_id, username: user.username, email: user.email, is_mock: true });
    }

    try {
        const request = pool.request();
        request.input('user_id', sql.Int, user_id);
        const result = await request.query('SELECT user_id, username, email FROM Users WHERE user_id = @user_id');
        if(result.recordset.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed fetching profile', details: err.message });
    }
});

// We expose mockUsers onto the router so login.js can access it if needed in a hacky mock way
router.mockUsers = mockUsers;
module.exports = router;
