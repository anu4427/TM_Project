const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function initializeDatabase() {
    let connection;
    try {
        // Create connection
        connection = await mysql.createConnection(config);
        console.log('Connected to MySQL database');

        // Create JobSeekers table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS JobSeekers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                experience TEXT,
                skills TEXT,
                education TEXT,
                refresh_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('JobSeekers table created');

        // Create Recruiters table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Recruiters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                company_name VARCHAR(255),
                phone VARCHAR(20),
                refresh_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Recruiters table created');

        // Create Jobs table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                recruiter_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                requirements TEXT,
                salary_range VARCHAR(100),
                location VARCHAR(255),
                job_type VARCHAR(50),
                status ENUM('active', 'closed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (recruiter_id) REFERENCES Recruiters(id)
            )
        `);
        console.log('Jobs table created');

        // Create Applications table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                job_id INT NOT NULL,
                seeker_id INT NOT NULL,
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                cover_letter TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES Jobs(id),
                FOREIGN KEY (seeker_id) REFERENCES JobSeekers(id)
            )
        `);
        console.log('Applications table created');

        // Add sample data
        // Add sample recruiters
        await connection.query(`
            INSERT INTO Recruiters (email, password, name, company_name, phone)
            VALUES 
            ('recruiter1@example.com', '$2a$10$X7UrE2JzJ5Z5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'John Recruiter', 'Tech Corp', '1234567890'),
            ('recruiter2@example.com', '$2a$10$X7UrE2JzJ5Z5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Jane Recruiter', 'Innovation Inc', '0987654321')
        `);
        console.log('Sample recruiters added');

        // Add sample job seekers
        await connection.query(`
            INSERT INTO JobSeekers (email, password, name, phone, experience, skills, education)
            VALUES 
            ('seeker1@example.com', '$2a$10$X7UrE2JzJ5Z5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Alice Seeker', '1112223333', '3 years in web development', 'JavaScript, React, Node.js', 'BS in Computer Science'),
            ('seeker2@example.com', '$2a$10$X7UrE2JzJ5Z5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Bob Seeker', '4445556666', '5 years in data analysis', 'Python, SQL, Data Analysis', 'MS in Data Science')
        `);
        console.log('Sample job seekers added');

        // Add sample jobs
        await connection.query(`
            INSERT INTO Jobs (recruiter_id, title, description, requirements, salary_range, location, job_type)
            VALUES 
            (1, 'Senior Web Developer', 'Looking for an experienced web developer...', '5+ years experience, React, Node.js', '$80k-$120k', 'New York', 'Full-time'),
            (1, 'Junior Developer', 'Entry level position for recent graduates...', 'Basic JavaScript knowledge', '$50k-$70k', 'Remote', 'Full-time'),
            (2, 'Data Analyst', 'Seeking a data analyst to join our team...', '3+ years experience, Python, SQL', '$70k-$90k', 'San Francisco', 'Full-time')
        `);
        console.log('Sample jobs added');

        // Add sample applications
        await connection.query(`
            INSERT INTO Applications (job_id, seeker_id, status, cover_letter)
            VALUES 
            (1, 1, 'pending', 'I am interested in the Senior Web Developer position...'),
            (2, 2, 'accepted', 'I would like to apply for the Junior Developer position...'),
            (3, 1, 'rejected', 'I am applying for the Data Analyst position...')
        `);
        console.log('Sample applications added');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the initialization
initializeDatabase(); 