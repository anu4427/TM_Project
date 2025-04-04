const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { auth, checkRole } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const profilesRoutes = require('./routes/profiles');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Job Portal API is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/jobs', auth, jobsRoutes);
app.use('/api/applications', auth, applicationsRoutes);
app.use('/api/profiles', auth, profilesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Database connected successfully');
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
}); 