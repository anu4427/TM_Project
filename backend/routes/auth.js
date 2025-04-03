const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('../config/db');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        const pool = await connectDB();
        
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`SELECT * FROM ${userType === 'seeker' ? 'JobSeekers' : 'Recruiters'} WHERE email = @email`);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.recordset[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, userType },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, userType } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;
        const pool = await connectDB();

        // Check if user exists
        const checkResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`SELECT * FROM ${userType === 'seeker' ? 'JobSeekers' : 'Recruiters'} WHERE email = @email`);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('name', sql.NVarChar, name)
            .query(`
                INSERT INTO ${userType === 'seeker' ? 'JobSeekers' : 'Recruiters'} (email, password, name)
                OUTPUT INSERTED.id
                VALUES (@email, @password, @name)
            `);

        const userId = result.recordset[0].id;

        const token = jwt.sign(
            { id: userId, email, userType },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: userId, email, name, userType } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 