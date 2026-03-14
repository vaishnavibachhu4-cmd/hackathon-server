const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect, requireRole, requireApproved } = require('../middleware/auth');

// Create team
router.post('/', protect, requireApproved, requireRole('participant'), async (req, res) => {
  try {
    const existing = await Team.findOne({ leaderId: req.user._id });
    if (existing) {
      const updated = await Team.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json(updated);
    }
    const team = await Team.create({ ...req.body, leaderId: req.user._id, leaderName: req.user.name });
    res.status(201).json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my team
router.get('/my', protect, requireApproved, async (req, res) => {
  try {
    const team = await Team.findOne({ leaderId: req.user._id });
    res.json(team);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all teams (admin)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const teams = await Team.find().sort('-createdAt');
    res.json(teams);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
