const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');  // Assuming your model is in models/attendance.js
const { isAuthenticated } = require('../middleware/auth.middleware.js');  // Add any necessary authentication middleware

// Add or update attendance record
router.post('/', isAuthenticated, async (req, res) => {
  const { employeeId, checkIn, checkOut, status } = req.body;

  try {
    const today = new Date().setHours(0, 0, 0, 0);  // Reset to midnight for today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today }, // Check if attendance already exists today
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already recorded for today' });
    }

    const newAttendance = new Attendance({
      employeeId,
      checkIn,
      checkOut,
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Attendance recorded successfully', data: newAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance record (check-out or status update)
router.put('/:id', isAuthenticated, async (req, res) => {
  const { checkOut, status } = req.body;
  const attendanceId = req.params.id;

  try {
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (checkOut) {
      attendance.checkOut = checkOut;
    }

    if (status) {
      attendance.status = status;
    }

    await attendance.save();
    res.status(200).json({ message: 'Attendance updated successfully', data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get attendance records for a specific employee
router.get('/:employeeId', isAuthenticated, async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query; // Optional query parameters to filter by date range

  try {
    let filter = { employeeId };

    // If date range is provided, filter the records
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(filter);

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json({ message: 'Attendance records retrieved successfully', data: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance records for a specific employee
router.get('/', isAuthenticated, async (req, res) => {
  const { startDate, endDate } = req.query; // Optional query parameters to filter by date range

  try {
    const filter='';

    // If date range is provided, filter the records
    if (startDate && endDate) {
       filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(filter);

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json({ message: 'Attendance records retrieved successfully', data: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
