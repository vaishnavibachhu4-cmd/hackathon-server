const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Team = require('../models/Team');
const upload = require('../middleware/upload');
const { protect, requireRole, requireApproved } = require('../middleware/auth');

// Submit project
router.post('/', protect, requireApproved, requireRole('participant'), upload.single('projectFile'), async (req, res) => {
  try {
    const team = await Team.findOne({ leaderId: req.user._id });
    if (!team) return res.status(400).json({ message: 'Create a team first' });
    const projectData = {
      teamId: team._id,
      teamName: team.teamName,
      leaderId: req.user._id,
      leaderName: req.user.name,
      projectTitle: team.projectTitle,
      category: team.category,
      description: req.body.description,
      techStack: req.body.techStack,
      githubLink: req.body.githubLink,
      demoVideo: req.body.demoVideo,
      projectFile: req.file ? req.file.filename : undefined,
    };
    const existing = await Project.findOne({ teamId: team._id });
    if (existing) {
      const updated = await Project.findByIdAndUpdate(existing._id, projectData, { new: true });
      return res.json(updated);
    }
    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my project
router.get('/my', protect, requireApproved, async (req, res) => {
  try {
    const team = await Team.findOne({ leaderId: req.user._id });
    if (!team) return res.json(null);
    const project = await Project.findOne({ teamId: team._id });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all projects (admin)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.$or = [
      { projectTitle: { $regex: search, $options: 'i' } },
      { teamName: { $regex: search, $options: 'i' } },
    ];
    const projects = await Project.find(filter).sort('-submissionDate');
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Download file
router.get('/:id/download', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.projectFile) return res.status(404).json({ message: 'File not found' });
    const filePath = require('path').join(__dirname, '../uploads', project.projectFile);
    res.download(filePath);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
