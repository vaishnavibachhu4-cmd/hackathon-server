const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
}, { _id: false });

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, trim: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderName: { type: String, required: true },
  members: [memberSchema],
  projectTitle: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['AI/ML', 'Web Development', 'Mobile App', 'IoT', 'Cybersecurity', 'Blockchain'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
