const express = require('express');
const router = express.Router();
const Efficiency = require('../models/efficiency.model.js');
const { isAuthenticated } = require('../middleware/auth.middleware.js');

// Add efficiency data
router.post('/', isAuthenticated, async (req, res) => {
  const { taskId, taskName, completionTime, qualityRating, deadlineMet, comments } = req.body;
  const employeeId = (req.body?.employeeId) ? req.body.employeeId : req.user.id;  // Assuming you're using JWT and the employee ID is available

  try {
    const newEfficiencyData = new Efficiency({
      employeeId,
      taskId,
      taskName,
      completionTime,
      qualityRating,
      deadlineMet,
      comments
    });

    await newEfficiencyData.save();
    res.status(201).json({ message: 'Efficiency data recorded successfully', data: newEfficiencyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get efficiency data for an employee
router.get('/:employeeId', isAuthenticated, async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;  // Optional date range for filtering

  try {
    let filter = { employeeId };

    // Filter by date range if provided
    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate)
      };
    }

    const efficiencyData = await Efficiency.find(filter).sort({ createdAt: -1 });  // Sort by most recent

    if (!efficiencyData.length) {
      return res.status(404).json({ message: 'No efficiency data found' });
    }

    res.status(200).json({ message: 'Efficiency data retrieved successfully', data: efficiencyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate productivity score for an employee
router.get('/productivity/:employeeId', isAuthenticated, async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch efficiency data for the employee
    const efficiencyData = await Efficiency.find({ employeeId });

    if (!efficiencyData.length) {
      return res.status(404).json({ message: 'No efficiency data found for this employee' });
    }

    // Calculate the number of tasks completed on time
    const tasksOnTime = efficiencyData.filter(task => task.deadlineMet).length;
    const totalTasks = efficiencyData.length;

    // Calculate the average quality rating
    const avgQualityRating = efficiencyData.reduce((acc, task) => acc + task.qualityRating, 0) / totalTasks;

    // Calculate the productivity score
    const productivityScore = (
      tasksOnTime * 0.5 +
      avgQualityRating * 0.3 +
      (tasksOnTime / totalTasks) * 0.2
    ).toFixed(2); // Round to 2 decimal places

    res.status(200).json({ message: 'Productivity score calculated', productivityScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
