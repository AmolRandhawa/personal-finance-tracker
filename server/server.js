const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

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

app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY transaction_date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const {
            user_id,
            category_id,
            amount,
            type,
            description,
            transaction_date
        } = req.body;

        const result = await pool.query(
            `INSERT INTO transactions
            (user_id, category_id, amount, type, description, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                user_id,
                category_id,
                amount,
                type,
                description,
                transaction_date
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});