const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Encrypted password
  role: { type: String, enum: ['Admin', 'HR', 'Employee'], default: 'Employee' }, // Role (Admin, HR, Employee)
  phoneNumber: { type: String },
  dateOfJoining: { type: Date, required: true },
  dateOfBirth: { type: Date, required: true },
  jobTitle: { type: String },
  department: { type: String },
  dateOfJoining: { type: Date, required: true },
  address: { type: String },
  salary: { type: Number },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },  // Manager reference
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  totalLeaveBalance: { type: Number, default: 10 },  // Total leave balance per year
  remainingLeaveBalance: { type: Number, default: 10 },  // Remaining balance
  leaveHistory: [],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Hash the password before saving it
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method
employeeSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

