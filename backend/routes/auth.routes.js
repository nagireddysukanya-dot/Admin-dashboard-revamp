const express = require('express');
const router = express.Router();
const { inMemoryUsers } = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  // Find user by registered email
  const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'No account found with this email address'
    });
  }

  const expectedPassword = user.password || 'admin123';
  if (password !== expectedPassword) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please try again.'
    });
  }

  const token = 'smt_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || ''
    }
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: inMemoryUsers[0]
  });
});

module.exports = router;
