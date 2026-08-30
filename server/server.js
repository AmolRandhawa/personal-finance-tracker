const express = require('express');
const pool = require('./db');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Finance Tracker API is running!');
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});