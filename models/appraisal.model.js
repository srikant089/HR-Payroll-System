const mongoose = require('mongoose');

const appraisalSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  cycle: { type: String, enum: ['Quarterly', 'Yearly'], required: true },
  cycleStart: { type: Date, required: true },
  cycleEnd: { type: Date, required: true },
  performanceRating: { type: Number, min: 1, max: 5, required: true },  // Rating from 1 to 5
  salaryIncrement: { type: Number, required: true },  // Increment as a percentage
  feedback: { type: String },  // Feedback from the reviewer
  createdAt: { type: Date, default: Date.now }
});

const Appraisal = mongoose.model('Appraisal', appraisalSchema);

module.exports = Appraisal;
