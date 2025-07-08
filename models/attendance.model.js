
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true, default: Date.now },
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
