const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model.js');
const { isAuthenticated } = require('../middleware/auth.middleware.js');

// Create a new employee
router.post('/', isAuthenticated, async (req, res) => {
  const { firstName, lastName, email, phoneNumber, jobTitle, department, dateOfJoining, address, salary, managerId } = req.body;

  try {
    // Create a new employee document
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      jobTitle,
      department,
      dateOfJoining,
      address,
      salary,
      managerId
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', data: newEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update employee details
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, jobTitle, department, address, salary, status, managerId } = req.body;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.phoneNumber = phoneNumber || employee.phoneNumber;
    employee.jobTitle = jobTitle || employee.jobTitle;
    employee.department = department || employee.department;
    employee.address = address || employee.address;
    employee.salary = salary || employee.salary;
    employee.status = status || employee.status;
    employee.managerId = managerId || employee.managerId;
    employee.updatedAt = Date.now();

    await employee.save();
    res.status(200).json({ message: 'Employee updated successfully', data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get employee by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee details retrieved successfully', data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get all employees
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const employees = await Employee.find().populate('managerId', 'firstName lastName email');  // Populate manager data

    if (!employees.length) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json({ message: 'Employees retrieved successfully', data: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
