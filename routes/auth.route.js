const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const Employee = require("../models/employee.model.js");
const { isAuthenticated } = require("../middleware/auth.middleware.js");
const router = express.Router();

// Register a new employee
router.post("/register", async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    phoneNumber,
    jobTitle,
    department,
    dateOfJoining,
    address,
    salary,
    managerId,
  } = req.body;

  try {
    // Check if the employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Create a new employee
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      role: role || "Employee", // Default role is 'Employee'
      phoneNumber,
      jobTitle,
      department,
      dateOfJoining,
      address,
      salary,
      managerId,
    });

    // Save the employee to the database
    await newEmployee.save();

    // Return a success message
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login an employee
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await employee.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: employee.id,
        role: employee.role,
      },
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
