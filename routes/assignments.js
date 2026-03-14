const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { protect, requireRole } = require('../middleware/auth');

// Create assignment (admin)
router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { projectId, juryId } = req.body;
    const existing = await Assignment.findOne({ projectId, juryId });
    if (existing) return res.status(400).json({ message: 'Already assigned' });
    const assignment = await Assignment.create({ projectId, juryId });
    res.status(201).json(assignment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all assignments (admin)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('projectId').populate('juryId', '-password').sort('-createdAt');
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my assignments (jury)
router.get('/my', protect, requireRole('jury'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ juryId: req.user._id }).populate('projectId');
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete assignment (admin)
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
