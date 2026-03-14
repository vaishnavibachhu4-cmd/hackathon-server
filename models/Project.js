const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamName: { type: String, required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderName: { type: String, required: true },
  projectTitle: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: String, required: true },
  githubLink: { type: String, trim: true },
  demoVideo: { type: String, trim: true },
  projectFile: { type: String }, // stored filename
  submissionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
