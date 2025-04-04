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

let pool = null;

async function connectDB() {
    try {
        if (pool) {
            console.log('Using existing database connection pool');
            return pool;
        }

        console.log('Attempting to connect to MySQL...');
        pool = await mysql.createPool(config);
        console.log('Connected to MySQL successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        pool = null;
        throw err;
    }
}

async function getPool() {
    if (!pool) {
        await connectDB();
    }
    return pool;
}

module.exports = { connectDB, getPool }; 