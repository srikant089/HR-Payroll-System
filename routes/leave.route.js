const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model.js');
const Leave = require('../models/leave.model.js');  // Assuming your model is in models/leave.js
const { isAuthenticated } = require('../middleware/auth.middleware.js');  // Middleware for authentication

// Request leave
router.post('/', isAuthenticated, async (req, res) => {
  console.log(req.body);
  const { leaveType, requestedDays, startDate, endDate, reason } = req.body;
  const employeeId = req.user.id;  // Assuming you're using JWT and have access to user info

  try {

    // Find the employee who is making the request
    const employee = await Employee.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the employee has enough remaining leave balance
    if (employee.remainingLeaveBalance < requestedDays) {
      return res.status(400).json({ message: 'Not enough leave balance' });
    }

    // Check if the leave request is valid (endDate >= startDate)
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be later than start date' });
    }


    const newLeave = new Leave({
      employeeId,
      leaveType,
      requestedDays,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    // Update the employee's leave balance
    employee.remainingLeaveBalance -= requestedDays;
    await employee.save();

    // Add the leave request ID to the employee's leave history
    employee.leaveHistory.push(newLeave);
    await employee.save();


    res.status(201).json({ message: 'Leave request submitted successfully', data: newLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all leave requests for a specific employee
router.get('/', isAuthenticated, async (req, res) => {
  const employeeId = req.user.id;  // Assuming user is authenticated
  const { status } = req.query;    // Optional filter by status

  try {
    const filter = { employeeId };
    if (status) {
      filter.status = status;  // Filter by leave status (Pending, Approved, Rejected)
    }

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });  // Sort by most recent

    if (!leaves.length) {
      return res.status(404).json({ message: 'No leave requests found' });
    }

    res.status(200).json({ message: 'Leave requests fetched successfully', data: leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Approve or reject leave request
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // Should be either 'Approved' or 'Rejected'

  try {
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "Approved" or "Rejected"' });
    }

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if the user is HR or manager (additional logic based on your system)
    // Here, for simplicity, we assume that `isAuthenticated` middleware verifies user role
    if (req.user.role !== 'HR' && req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Only HR or Manager can approve/reject leaves' });
    }

    leave.status = status;  // Set the status to 'Approved' or 'Rejected'
    await leave.save();

    res.status(200).json({ message: `Leave request ${status}`, data: leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


module.exports = router;

