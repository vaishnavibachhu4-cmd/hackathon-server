const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const Assignment = require('../models/Assignment');
const { protect, requireRole } = require('../middleware/auth');

// Submit evaluation (jury)
router.post('/', protect, requireRole('jury'), async (req, res) => {
  try {
    const { projectId, innovation, technical, uiux, presentation, impact, feedback } = req.body;
    // Verify assignment
    const assignment = await Assignment.findOne({ projectId, juryId: req.user._id });
    if (!assignment) return res.status(403).json({ message: 'Not assigned to this project' });
    const totalScore = innovation + technical + uiux + presentation + impact;
    const existing = await Evaluation.findOne({ projectId, juryId: req.user._id });
    if (existing) {
      const updated = await Evaluation.findByIdAndUpdate(existing._id, {
        innovation, technical, uiux, presentation, impact, totalScore, feedback,
      }, { new: true });
      return res.json(updated);
    }
    const evaluation = await Evaluation.create({
      projectId, juryId: req.user._id, juryName: req.user.name,
      innovation, technical, uiux, presentation, impact, totalScore, feedback,
    });
    res.status(201).json(evaluation);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all evaluations (admin)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate('projectId').sort('-createdAt');
    res.json(evaluations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my evaluations (jury)
router.get('/my', protect, requireRole('jury'), async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ juryId: req.user._id }).populate('projectId');
    res.json(evaluations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get evaluations for a project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ projectId: req.params.projectId });
    res.json(evaluations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
