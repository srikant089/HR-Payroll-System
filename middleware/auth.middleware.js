// middleware/auth.js
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model.js');

const isAuthenticated = async (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check for role-based access (Admin, HR, etc.)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

const isHR = (req, res, next) => {
  if (req.user.role !== 'HR' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. HRs only.' });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin, isHR };
