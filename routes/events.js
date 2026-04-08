const express = require('express');
const router = express.Router();
const sql = require('mssql');
const authenticateToken = require('../middleware/auth');
const poolPromise = require('../db');

let mockEvents = [
    { event_id: 1, user_id: 1, event_name: "Paris Fashion Week", event_date: "2026-11-15", location: "Paris", type: "Formal" },
    { event_id: 2, user_id: 1, event_name: "Dinner Date", event_date: "2026-11-18", location: "Downtown", type: "Evening" },
    { event_id: 3, user_id: 1, event_name: "Board Meeting", event_date: "2026-12-01", location: "Office", type: "Business" }
];

let nextEventId = 4;

// GET /api/events
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;

    const pool = await poolPromise;
    if (!pool) {
        const userEvents = mockEvents.filter(e => e.user_id === user_id);
        return res.json(userEvents);
    }

    try {
        const request = pool.request();
        request.input('user_id', sql.Int, user_id);
        const result = await request.query('SELECT * FROM Events WHERE user_id = @user_id ORDER BY event_date ASC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Failed', details: err.message });
    }
});

// POST /api/events
router.post('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;
    const { event_name, event_date, location, type } = req.body;

    const pool = await poolPromise;
    if (!pool) {
        const newEvent = { event_id: nextEventId++, user_id, event_name, event_date, location, type };
        mockEvents.push(newEvent);
        return res.status(201).json({ message: 'Event added (Mock)', event: newEvent });
    }

    try {
        const request = pool.request();
        request.input('user_id', sql.Int, user_id);
        request.input('event_name', sql.VarChar, event_name);
        request.input('event_date', sql.Date, event_date);
        request.input('location', sql.VarChar, location);
        request.input('type', sql.VarChar, type);
        
        await request.query(`INSERT INTO Events (user_id, event_name, event_date, location, type) 
                             VALUES (@user_id, @event_name, @event_date, @location, @type)`);
        res.status(201).json({ message: 'Event added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed', details: err.message });
    }
});

module.exports = router;
