const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');
const { auth, checkRole } = require('../middleware/auth');

// Get profile (both seeker and recruiter)
router.get('/', auth, async (req, res) => {
    try {
        const pool = await getPool();
        const table = req.user.userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        const [profiles] = await pool.query(
            `SELECT id, email, name, ${req.user.userType === 'seeker' ? 
                'phone, experience, skills, education, resume_url' : 
                'company_name, phone'} 
             FROM ${table} WHERE id = ?`,
            [req.user.id]
        );
            
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        const profile = profiles[0];
        profile.userType = req.user.userType;
        
        res.json(profile);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get profile by ID (for recruiters to view seeker profiles)
router.get('/:id', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const pool = await getPool();
        
        const [profiles] = await pool.query(
            `SELECT id, email, name, phone, experience, skills, education, resume_url
             FROM JobSeekers WHERE id = ?`,
            [req.params.id]
        );
            
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        const profile = profiles[0];
        profile.userType = 'seeker';
        
        res.json(profile);
    } catch (err) {
        console.error('Get profile by ID error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update profile (both seeker and recruiter)
router.put('/', auth, async (req, res) => {
    try {
        const pool = await getPool();
        const table = req.user.userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        // Different fields for seekers and recruiters
        const seekerFields = ['name', 'phone', 'experience', 'skills', 'education', 'resume_url'];
        const recruiterFields = ['name', 'company_name', 'phone'];
        
        const allowedFields = req.user.userType === 'seeker' ? seekerFields : recruiterFields;
        const updates = [];
        const params = [];
        
        // Build update query dynamically based on provided fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(req.body[field]);
            }
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        
        // Add user ID to params
        params.push(req.user.id);
        
        const query = `
            UPDATE ${table}
            SET ${updates.join(', ')}
            WHERE id = ?
        `;
        
        await pool.query(query, params);
        
        // Get updated profile
        const [profiles] = await pool.query(
            `SELECT id, email, name, ${req.user.userType === 'seeker' ? 
                'phone, experience, skills, education, resume_url' : 
                'company_name, phone'} 
             FROM ${table} WHERE id = ?`,
            [req.user.id]
        );
        
        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        const profile = profiles[0];
        profile.userType = req.user.userType;
        
        res.json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update password
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }
        
        const pool = await getPool();
        const table = req.user.userType === 'seeker' ? 'JobSeekers' : 'Recruiters';
        
        // Get current user with password
        const [users] = await pool.query(
            `SELECT * FROM ${table} WHERE id = ?`,
            [req.user.id]
        );
            
        if (users.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        const user = users[0];
        
        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        await pool.query(
            `UPDATE ${table} SET password = ? WHERE id = ?`,
            [hashedPassword, req.user.id]
        );
            
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload resume (seeker only)
router.post('/resume', auth, checkRole('seeker'), async (req, res) => {
    try {
        // This is a placeholder for file upload functionality
        // In a real application, you would use a file upload middleware like multer
        // and store the file in a cloud storage service like AWS S3
        
        const { resumeUrl } = req.body;
        
        if (!resumeUrl) {
            return res.status(400).json({ message: 'Resume URL is required' });
        }
        
        const pool = await getPool();
        
        await pool.query(
            'UPDATE JobSeekers SET resume_url = ? WHERE id = ?',
            [resumeUrl, req.user.id]
        );
        
        res.json({ 
            message: 'Resume uploaded successfully',
            resumeUrl
        });
    } catch (err) {
        console.error('Upload resume error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 