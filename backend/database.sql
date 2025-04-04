-- Create the database
CREATE DATABASE IF NOT EXISTS JobPortal;
USE JobPortal;

-- Create JobSeekers table
CREATE TABLE IF NOT EXISTS JobSeekers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    experience TEXT,
    skills TEXT,
    education TEXT,
    resume_url VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Recruiters table
CREATE TABLE IF NOT EXISTS Recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(20),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS Jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_range VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES Recruiters(id)
);

-- Create JobApplications table
CREATE TABLE IF NOT EXISTS JobApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    seeker_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES Jobs(id),
    FOREIGN KEY (seeker_id) REFERENCES JobSeekers(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS IX_JobSeekers_Email ON JobSeekers(email);
CREATE INDEX IF NOT EXISTS IX_Recruiters_Email ON Recruiters(email);
CREATE INDEX IF NOT EXISTS IX_Jobs_RecruiterId ON Jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS IX_JobApplications_JobId ON JobApplications(job_id);
CREATE INDEX IF NOT EXISTS IX_JobApplications_SeekerId ON JobApplications(seeker_id); 