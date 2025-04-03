const sql = require('mssql');
require('dotenv').config();

const config = {
    user: 'sa',
    password: 'ANUmadhu@0828',
    server: 'AnuMadhu\\SQLEXPRESS',
    database: 'JobPortal',
    options: {
        trustServerCertificate: true,
        encrypt: true,
        enableArithAbort: true
    }
};

async function connectDB() {
    try {
        console.log('Attempting to connect to SQL Server...');
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = { connectDB, sql }; 