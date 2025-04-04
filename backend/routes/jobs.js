const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { auth, checkRole } = require('../middleware/auth');

// Get all jobs with optional filters
router.get('/', async (req, res) => {
    try {
        const { title, location, jobType, status } = req.query;
        const pool = await getPool();
        
        let query = `
            SELECT j.*, r.company_name, r.name as recruiter_name
            FROM Jobs j
            JOIN Recruiters r ON j.recruiter_id = r.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Only show active jobs to non-recruiters
        if (!req.user || req.user.userType !== 'recruiter') {
            query += ` AND j.status = 'active'`;
        } else if (status) {
            query += ` AND j.status = ?`;
            params.push(status);
        }
        
        if (title) {
            query += ` AND j.title LIKE ?`;
            params.push(`%${title}%`);
        }
        if (location) {
            query += ` AND j.location LIKE ?`;
            params.push(`%${location}%`);
        }
        if (jobType) {
            query += ` AND j.job_type = ?`;
            params.push(jobType);
        }
        
        query += ` ORDER BY j.created_at DESC`;
        
        const [jobs] = await pool.query(query, params);
        res.json(jobs);
    } catch (err) {
        console.error('Get jobs error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get job by ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const [jobs] = await pool.query(
            `SELECT j.*, r.company_name, r.name as recruiter_name
             FROM Jobs j
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE j.id = ?`,
            [req.params.id]
        );
        
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        // Only show active jobs to non-recruiters
        if ((!req.user || req.user.userType !== 'recruiter') && jobs[0].status !== 'active') {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json(jobs[0]);
    } catch (err) {
        console.error('Get job by ID error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new job (Recruiter only)
router.post('/', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const { title, description, requirements, salaryRange, location, jobType } = req.body;
        
        if (!title || !description || !location || !jobType) {
            return res.status(400).json({ message: 'Title, description, location, and job type are required' });
        }
        
        const pool = await getPool();
        
        const [result] = await pool.query(
            'INSERT INTO Jobs (recruiter_id, title, description, requirements, salary_range, location, job_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description, requirements || null, salaryRange || null, location, jobType]
        );

        // Get the created job
        const [jobs] = await pool.query(
            `SELECT j.*, r.company_name, r.name as recruiter_name
             FROM Jobs j
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE j.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Job created successfully',
            job: jobs[0]
        });
    } catch (err) {
        console.error('Create job error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update job (Recruiter only)
router.put('/:id', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const pool = await getPool();
        
        // Check if job exists and belongs to the recruiter
        const [jobs] = await pool.query(
            'SELECT * FROM Jobs WHERE id = ? AND recruiter_id = ?',
            [req.params.id, req.user.id]
        );
            
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const { title, description, requirements, salaryRange, location, jobType, status } = req.body;
        
        // Validate required fields
        if (!title || !description || !location || !jobType) {
            return res.status(400).json({ message: 'Title, description, location, and job type are required' });
        }
        
        await pool.query(
            'UPDATE Jobs SET title = ?, description = ?, requirements = ?, salary_range = ?, location = ?, job_type = ?, status = ? WHERE id = ?',
            [title, description, requirements || null, salaryRange || null, location, jobType, status || 'active', req.params.id]
        );
        
        // Get the updated job
        const [updatedJobs] = await pool.query(
            `SELECT j.*, r.company_name, r.name as recruiter_name
             FROM Jobs j
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE j.id = ?`,
            [req.params.id]
        );
            
        res.json({ 
            message: 'Job updated successfully',
            job: updatedJobs[0]
        });
    } catch (err) {
        console.error('Update job error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete job (Recruiter only)
router.delete('/:id', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const pool = await getPool();
        
        // Check if job exists and belongs to the recruiter
        const [jobs] = await pool.query(
            'SELECT * FROM Jobs WHERE id = ? AND recruiter_id = ?',
            [req.params.id, req.user.id]
        );
            
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        // Check if there are any applications for this job
        const [applications] = await pool.query(
            'SELECT * FROM JobApplications WHERE job_id = ?',
            [req.params.id]
        );
        
        if (applications.length > 0) {
            // Instead of deleting, mark as inactive
            await pool.query(
                'UPDATE Jobs SET status = ? WHERE id = ?',
                ['inactive', req.params.id]
            );
            return res.json({ message: 'Job marked as inactive due to existing applications' });
        }

        await pool.query('DELETE FROM Jobs WHERE id = ?', [req.params.id]);
            
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Delete job error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get jobs posted by the current recruiter
router.get('/recruiter/my-jobs', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const pool = await getPool();
        
        const [jobs] = await pool.query(
            `SELECT j.*, r.company_name, r.name as recruiter_name,
                    (SELECT COUNT(*) FROM JobApplications WHERE job_id = j.id) as application_count
             FROM Jobs j
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE j.recruiter_id = ?
             ORDER BY j.created_at DESC`,
            [req.user.id]
        );
        
        res.json(jobs);
    } catch (err) {
        console.error('Get recruiter jobs error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 