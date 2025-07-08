const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['Sick', 'Vacation', 'Casual', 'Other'], required: true },
  requestedDays: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
