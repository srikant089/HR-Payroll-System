// models/efficiency.js
const mongoose = require('mongoose');

const efficiencySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  taskId: { type: String, required: true },
  taskName: { type: String, required: true },
  completionTime: { type: Date, required: true }, // Date and time when the task was completed
  qualityRating: { type: Number, min: 1, max: 5, required: true },  // Scale 1-5 (1 being poor, 5 being excellent)
  deadlineMet: { type: Boolean, required: true },  // Whether the task was completed on time
  comments: { type: String },  // Optional comments/feedback
  createdAt: { type: Date, default: Date.now }
});

const Efficiency = mongoose.model('Efficiency', efficiencySchema);

module.exports = Efficiency;
