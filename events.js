const express = require('express');
const router = express.Router();
const sql = require('mssql');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// CREATE Event
router.post('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const { event_name, event_date } = req.body;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('event_name', sql.VarChar, event_name);
    request.input('event_date', sql.Date, event_date);
    await request.query('INSERT INTO Events (user_id, event_name, event_date) VALUES (@user_id, @event_name, @event_date)');
    res.status(201).json({ message: 'Event created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});

// READ All Events
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    const result = await request.query('SELECT * FROM Events WHERE user_id = @user_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
});

// READ Single Event
router.get('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const event_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('event_id', sql.Int, event_id);
    const result = await request.query('SELECT * FROM Events WHERE event_id = @event_id AND user_id = @user_id');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
});

// UPDATE Event
router.put('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const event_id = parseInt(req.params.id);
  const { event_name, event_date } = req.body;
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('event_id', sql.Int, event_id);
    request.input('event_name', sql.VarChar, event_name);
    request.input('event_date', sql.Date, event_date);
    await request.query(\`
      UPDATE Events SET event_name = @event_name, event_date = @event_date
      WHERE event_id = @event_id AND user_id = @user_id
    \`);
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event', details: err.message });
  }
});

// DELETE Event
router.delete('/:id', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;
  const event_id = parseInt(req.params.id);
  try {
    const request = (await pool).request();
    request.input('user_id', sql.Int, user_id);
    request.input('event_id', sql.Int, event_id);
    await request.query('DELETE FROM Events WHERE event_id = @event_id AND user_id = @user_id');
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event', details: err.message });
  }
});

module.exports = router;
