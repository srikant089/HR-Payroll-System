const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  description: { type: String },
  members: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    role: { type: String, enum: ['Member', 'Team Lead', 'Manager'], required: true }  // Define roles
  }],
  createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
