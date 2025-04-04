const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and add user to request
 */
const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

/**
 * Middleware to check if user has required role
 * @param {string} role - The role to check for ('seeker' or 'recruiter')
 */
const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        if (req.user.userType !== role) {
            return res.status(403).json({ message: `Access denied. ${role} role required.` });
        }
        
        next();
    };
};

module.exports = { auth, checkRole }; 