const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  juryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  juryName: { type: String, required: true },
  innovation: { type: Number, min: 0, max: 10, required: true },
  technical: { type: Number, min: 0, max: 10, required: true },
  uiux: { type: Number, min: 0, max: 10, required: true },
  presentation: { type: Number, min: 0, max: 10, required: true },
  impact: { type: Number, min: 0, max: 10, required: true },
  totalScore: { type: Number, required: true },
  feedback: { type: String },
}, { timestamps: true });

evaluationSchema.index({ projectId: 1, juryId: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
