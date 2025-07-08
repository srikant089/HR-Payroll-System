// routes/appraisal.js
const express = require('express');
const router = express.Router();
const Appraisal = require('../models/appraisal.model.js');
const { isAuthenticated, isAdmin, isHR  } = require('../middleware/auth.middleware.js');

// Create a new appraisal
router.post('/', isAuthenticated, isAdmin, isHR, async (req, res) => {
  const { employeeId, cycle, cycleStart, cycleEnd, performanceRating, salaryIncrement, feedback } = req.body;

  try {
    const newAppraisal = new Appraisal({
      employeeId,
      cycle,
      cycleStart,
      cycleEnd,
      performanceRating,
      salaryIncrement,
      feedback,
    });

    await newAppraisal.save();
    res.status(201).json({ message: 'Appraisal created successfully', data: newAppraisal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appraisals for a specific employee
router.get('/:employeeId', isAuthenticated, async (req, res) => {
  const { employeeId } = req.params;

  try {
    const appraisals = await Appraisal.find({ employeeId }).sort({ cycleStart: -1 });  // Sort by most recent cycle

    if (!appraisals.length) {
      return res.status(404).json({ message: 'No appraisals found for this employee' });
    }

    res.status(200).json({ message: 'Appraisals retrieved successfully', data: appraisals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appraisals (Admin or HR)
router.get('/', isAuthenticated,isAdmin, isHR, async (req, res) => {
  try {
    const appraisals = await Appraisal.find().sort({ cycleStart: -1 });

    if (!appraisals.length) {
      return res.status(404).json({ message: 'No appraisals found' });
    }

    res.status(200).json({ message: 'Appraisals retrieved successfully', data: appraisals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing appraisal
router.put('/:id', isAuthenticated,isAdmin, isHR, async (req, res) => {
  const { id } = req.params;
  const { performanceRating, salaryIncrement, feedback } = req.body;

  try {
    const appraisal = await Appraisal.findById(id);

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    appraisal.performanceRating = performanceRating || appraisal.performanceRating;
    appraisal.salaryIncrement = salaryIncrement || appraisal.salaryIncrement;
    appraisal.feedback = feedback || appraisal.feedback;

    await appraisal.save();
    res.status(200).json({ message: 'Appraisal updated successfully', data: appraisal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
