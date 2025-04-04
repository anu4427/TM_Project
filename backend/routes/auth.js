const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { auth } = require('../middleware/auth');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        if (!email || !password || !userType) {
            return res.status(400).json({ message: 'Email, password, and user type are required' });
        }
        
        const pool = await getPool();
        const tableName = userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        const [users] = await pool.query(
            `SELECT * FROM ${tableName} WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, userType },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        // Create refresh token
        const refreshToken = jwt.sign(
            { id: user.id, email: user.email, userType },
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            { expiresIn: '7d' }
        );
        
        // Store refresh token in database
        await pool.query(
            `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`,
            [refreshToken, user.id]
        );

        // Remove password from user object
        const { password: _, refresh_token: __, ...userWithoutPassword } = user;
        
        res.json({ 
            accessToken, 
            refreshToken,
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                userType 
            } 
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, userType, ...additionalData } = req.body;
        
        if (!email || !password || !name || !userType) {
            return res.status(400).json({ message: 'Email, password, name, and user type are required' });
        }
        
        const pool = await getPool();
        const tableName = userType === 'seeker' ? 'JobSeekers' : 'Recruiters';

        // Check if user exists
        const [existingUsers] = await pool.query(
            `SELECT * FROM ${tableName} WHERE email = ?`,
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare additional fields based on user type
        let additionalFields = '';
        let additionalValues = '';
        let additionalParams = [];
        
        if (userType === 'seeker') {
            if (additionalData.phone) {
                additionalFields += ', phone';
                additionalValues += ', ?';
                additionalParams.push(additionalData.phone);
            }
            if (additionalData.experience) {
                additionalFields += ', experience';
                additionalValues += ', ?';
                additionalParams.push(additionalData.experience);
            }
            if (additionalData.skills) {
                additionalFields += ', skills';
                additionalValues += ', ?';
                additionalParams.push(additionalData.skills);
            }
            if (additionalData.education) {
                additionalFields += ', education';
                additionalValues += ', ?';
                additionalParams.push(additionalData.education);
            }
        } else if (userType === 'recruiter') {
            if (additionalData.company_name) {
                additionalFields += ', company_name';
                additionalValues += ', ?';
                additionalParams.push(additionalData.company_name);
            }
            if (additionalData.phone) {
                additionalFields += ', phone';
                additionalValues += ', ?';
                additionalParams.push(additionalData.phone);
            }
        }

        // Insert user
        const [result] = await pool.query(
            `INSERT INTO ${tableName} (email, password, name${additionalFields}) 
             VALUES (?, ?, ?${additionalValues})`,
            [email, hashedPassword, name, ...additionalParams]
        );

        const userId = result.insertId;

        // Create access token
        const accessToken = jwt.sign(
            { id: userId, email, userType },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        // Create refresh token
        const refreshToken = jwt.sign(
            { id: userId, email, userType },
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            { expiresIn: '7d' }
        );
        
        // Store refresh token in database
        await pool.query(
            `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`,
            [refreshToken, userId]
        );

        res.status(201).json({ 
            accessToken, 
            refreshToken,
            user: { 
                id: userId, 
                email, 
                name, 
                userType,
                ...additionalData 
            } 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
        );
        
        const pool = await getPool();
        const tableName = decoded.userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        // Check if refresh token exists in database
        const [users] = await pool.query(
            `SELECT * FROM ${tableName} WHERE id = ? AND refresh_token = ?`,
            [decoded.id, refreshToken]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        
        // Create new access token
        const accessToken = jwt.sign(
            { id: decoded.id, email: decoded.email, userType: decoded.userType },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({ accessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// Logout Route
router.post('/logout', auth, async (req, res) => {
    try {
        const { userType, id } = req.user;
        const pool = await getPool();
        const tableName = userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        // Clear refresh token in database
        await pool.query(
            `UPDATE ${tableName} SET refresh_token = NULL WHERE id = ?`,
            [id]
        );
        
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current User Route
router.get('/me', auth, async (req, res) => {
    try {
        const { userType, id } = req.user;
        const pool = await getPool();
        const tableName = userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        const [users] = await pool.query(
            `SELECT id, email, name, ${userType === 'seeker' ? 'phone, experience, skills, education, resume_url' : 'company_name, phone'} 
             FROM ${tableName} WHERE id = ?`,
            [id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = users[0];
        user.userType = userType;
        
        res.json({ user });
    } catch (err) {
        console.error('Get current user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 