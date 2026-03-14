const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  juryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

assignmentSchema.index({ projectId: 1, juryId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
