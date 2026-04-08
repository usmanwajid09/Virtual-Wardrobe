const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Routes mapping
app.use('/api/users', require('./routes/users'));
app.use('/api/clothes', require('./routes/clothes'));
app.use('/api/events', require('./routes/events'));
app.use('/api/login', require('./routes/login'));
app.use('/api/outfits', require('./routes/outfits'));
app.use('/api/outfitClothes', require('./routes/outfitClothes'));
app.use('/api/chat', require('./routes/chat'));

// Default fallback to index.html for unknown frontend routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
