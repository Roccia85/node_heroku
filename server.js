const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: process.env.MESSAGE || 'Default message',
        timestamp: new Date(),
        version: '1.0.0'
    });
});

// Handle non-GET methods
app.all('/', (req, res) => {
    res.status(406).json({ error: 'Method Not Allowed' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
