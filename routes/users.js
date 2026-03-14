const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

// Get all participants (admin)
router.get('/participants', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'participant' }).sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all jury (admin)
router.get('/jury', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'jury' }).sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Approve/Reject user (admin)
router.patch('/:id/status', protect, requireRole('admin'), async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    if (!['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { approvalStatus }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
