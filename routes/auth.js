const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, college, phone, organization, expertiseArea } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({
      name, email, password,
      role: role === 'jury' ? 'jury' : 'participant',
      approvalStatus: 'pending',
      college, phone, organization, expertiseArea,
    });
    res.status(201).json({ message: 'Registration submitted. Awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.role !== 'admin' && user.approvalStatus !== 'approved') {
      return res.status(403).json({ message: `Account is ${user.approvalStatus}. Contact admin.` });
    }
    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Me
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
