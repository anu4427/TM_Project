const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { auth, checkRole } = require('../middleware/auth');

// Get all applications for a job seeker
router.get('/seeker', auth, checkRole('seeker'), async (req, res) => {
    try {
        const pool = await getPool();
        
        const [applications] = await pool.query(
            `SELECT ja.*, j.title as job_title, j.description as job_description,
                    j.location, j.job_type, j.salary_range,
                    r.company_name, r.name as recruiter_name
             FROM JobApplications ja
             JOIN Jobs j ON ja.job_id = j.id
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE ja.seeker_id = ?
             ORDER BY ja.applied_date DESC`,
            [req.user.id]
        );
            
        res.json(applications);
    } catch (err) {
        console.error('Get seeker applications error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all applications for a job (Recruiter only)
router.get('/job/:jobId', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const pool = await getPool();
        
        // Check if job belongs to the recruiter
        const [jobs] = await pool.query(
            'SELECT * FROM Jobs WHERE id = ? AND recruiter_id = ?',
            [req.params.jobId, req.user.id]
        );
            
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const [applications] = await pool.query(
            `SELECT ja.*, js.name as seeker_name, js.email as seeker_email,
                    js.experience as seeker_experience, js.skills as seeker_skills,
                    js.education as seeker_education, js.resume_url as seeker_resume_url
             FROM JobApplications ja
             JOIN JobSeekers js ON ja.seeker_id = js.id
             WHERE ja.job_id = ?
             ORDER BY ja.applied_date DESC`,
            [req.params.jobId]
        );
            
        res.json(applications);
    } catch (err) {
        console.error('Get job applications error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply for a job (Job seeker only)
router.post('/:jobId', auth, checkRole('seeker'), async (req, res) => {
    try {
        const pool = await getPool();
        
        // Check if job exists and is active
        const [jobs] = await pool.query(
            'SELECT * FROM Jobs WHERE id = ? AND status = ?',
            [req.params.jobId, 'active']
        );
            
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or not active' });
        }

        // Check if already applied
        const [existingApplications] = await pool.query(
            'SELECT * FROM JobApplications WHERE job_id = ? AND seeker_id = ?',
            [req.params.jobId, req.user.id]
        );
            
        if (existingApplications.length > 0) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create application
        const [result] = await pool.query(
            'INSERT INTO JobApplications (job_id, seeker_id) VALUES (?, ?)',
            [req.params.jobId, req.user.id]
        );
        
        // Get the created application with job and recruiter details
        const [applications] = await pool.query(
            `SELECT ja.*, j.title as job_title, j.description as job_description,
                    j.location, j.job_type, j.salary_range,
                    r.company_name, r.name as recruiter_name
             FROM JobApplications ja
             JOIN Jobs j ON ja.job_id = j.id
             JOIN Recruiters r ON j.recruiter_id = r.id
             WHERE ja.id = ?`,
            [result.insertId]
        );
            
        res.status(201).json({
            message: 'Application submitted successfully',
            application: applications[0]
        });
    } catch (err) {
        console.error('Apply for job error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update application status (Recruiter only)
router.put('/:applicationId', auth, checkRole('recruiter'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
            return res.status(400).json({ message: 'Valid status is required' });
        }
        
        const pool = await getPool();
        
        // Check if application exists and job belongs to the recruiter
        const [applications] = await pool.query(
            `SELECT ja.* FROM JobApplications ja
             JOIN Jobs j ON ja.job_id = j.id
             WHERE ja.id = ? AND j.recruiter_id = ?`,
            [req.params.applicationId, req.user.id]
        );
            
        if (applications.length === 0) {
            return res.status(404).json({ message: 'Application not found or unauthorized' });
        }

        // Update application status
        await pool.query(
            'UPDATE JobApplications SET status = ? WHERE id = ?',
            [status, req.params.applicationId]
        );
        
        // Get the updated application with job and seeker details
        const [updatedApplications] = await pool.query(
            `SELECT ja.*, j.title as job_title, j.description as job_description,
                    js.name as seeker_name, js.email as seeker_email,
                    js.experience as seeker_experience, js.skills as seeker_skills
             FROM JobApplications ja
             JOIN Jobs j ON ja.job_id = j.id
             JOIN JobSeekers js ON ja.seeker_id = js.id
             WHERE ja.id = ?`,
            [req.params.applicationId]
        );
            
        res.json({
            message: 'Application status updated successfully',
            application: updatedApplications[0]
        });
    } catch (err) {
        console.error('Update application status error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get application by ID (for both seeker and recruiter)
router.get('/:applicationId', auth, async (req, res) => {
    try {
        const pool = await getPool();
        
        // Get application with job and user details
        const [applications] = await pool.query(
            `SELECT ja.*, j.title as job_title, j.description as job_description,
                    j.location, j.job_type, j.salary_range,
                    r.company_name, r.name as recruiter_name,
                    js.name as seeker_name, js.email as seeker_email,
                    js.experience as seeker_experience, js.skills as seeker_skills
             FROM JobApplications ja
             JOIN Jobs j ON ja.job_id = j.id
             JOIN Recruiters r ON j.recruiter_id = r.id
             JOIN JobSeekers js ON ja.seeker_id = js.id
             WHERE ja.id = ?`,
            [req.params.applicationId]
        );
        
        if (applications.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const application = applications[0];
        
        // Check if user is authorized to view this application
        if (req.user.userType === 'seeker' && application.seeker_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }
        
        if (req.user.userType === 'recruiter' && application.recruiter_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }
        
        res.json(application);
    } catch (err) {
        console.error('Get application by ID error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete application (Job seeker only)
router.delete('/:applicationId', auth, checkRole('seeker'), async (req, res) => {
    try {
        const pool = await getPool();
        
        // Check if application exists and belongs to the seeker
        const [applications] = await pool.query(
            'SELECT * FROM JobApplications WHERE id = ? AND seeker_id = ?',
            [req.params.applicationId, req.user.id]
        );
        
        if (applications.length === 0) {
            return res.status(404).json({ message: 'Application not found or unauthorized' });
        }
        
        // Delete application
        await pool.query(
            'DELETE FROM JobApplications WHERE id = ?',
            [req.params.applicationId]
        );
        
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error('Delete application error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 