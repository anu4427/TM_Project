-- Create the database
CREATE DATABASE JobPortal;
GO

USE JobPortal;
GO

-- Create JobSeekers table
CREATE TABLE JobSeekers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    experience NVARCHAR(MAX),
    skills NVARCHAR(MAX),
    education NVARCHAR(MAX),
    resume_url NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create Recruiters table
CREATE TABLE Recruiters (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    company_name NVARCHAR(255),
    phone NVARCHAR(20),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create Jobs table
CREATE TABLE Jobs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    requirements NVARCHAR(MAX),
    salary_range NVARCHAR(100),
    location NVARCHAR(255),
    job_type NVARCHAR(50),
    status NVARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (recruiter_id) REFERENCES Recruiters(id)
);

-- Create JobApplications table
CREATE TABLE JobApplications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    job_id INT NOT NULL,
    seeker_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending',
    applied_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (job_id) REFERENCES Jobs(id),
    FOREIGN KEY (seeker_id) REFERENCES JobSeekers(id)
);

-- Create indexes for better performance
CREATE INDEX IX_JobSeekers_Email ON JobSeekers(email);
CREATE INDEX IX_Recruiters_Email ON Recruiters(email);
CREATE INDEX IX_Jobs_RecruiterId ON Jobs(recruiter_id);
CREATE INDEX IX_JobApplications_JobId ON JobApplications(job_id);
CREATE INDEX IX_JobApplications_SeekerId ON JobApplications(seeker_id); 

SELECT @@SERVERNAME as ServerName; 