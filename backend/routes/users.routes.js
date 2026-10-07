const express = require('express');
const router = express.Router();
const { inMemoryUsers } = require('../config/db');

// GET /api/users
router.get('/', (req, res) => {
  res.json({
    success: true,
    totalCount: inMemoryUsers.length,
    users: inMemoryUsers
  });
});

// POST /api/users - Add team user
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const newUser = {
    id: inMemoryUsers.length + 1,
    name,
    email,
    role: role || 'Support Lead',
    avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    is_active: 1,
    two_factor_enabled: 0
  };

  inMemoryUsers.push(newUser);

  res.status(201).json({
    success: true,
    message: `User ${name} added successfully`,
    user: newUser
  });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  const idx = inMemoryUsers.findIndex(u => u.id === parseInt(req.params.id, 10));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const removed = inMemoryUsers.splice(idx, 1);
  res.json({ success: true, message: `User ${removed[0].name} removed` });
});

module.exports = router;
