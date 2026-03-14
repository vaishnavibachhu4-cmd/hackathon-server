const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Evaluation = require('../models/Evaluation');
const { protect, requireRole } = require('../middleware/auth');

// Get leaderboard (public)
router.get('/leaderboard', async (req, res) => {
  try {
    const projects = await Project.find();
    const results = await Promise.all(projects.map(async (p) => {
      const evals = await Evaluation.find({ projectId: p._id });
      const avgScore = evals.length > 0
        ? evals.reduce((s, e) => s + e.totalScore, 0) / evals.length
        : 0;
      return {
        projectId: p._id,
        teamName: p.teamName,
        projectTitle: p.projectTitle,
        category: p.category,
        avgScore: Math.round(avgScore * 10) / 10,
        evalCount: evals.length,
      };
    }));
    results.sort((a, b) => b.avgScore - a.avgScore);
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
