const express = require('express');
const router = express.Router();
const Team = require('../models/team.model.js');
const { isAuthenticated } = require('../middleware/auth.middleware.js');  // Assuming isAuthenticated checks if the user is logged in

// Create a new team
router.post('/', isAuthenticated, async (req, res) => {
  const { teamName, description, teamLeadId } = req.body;

  try {
    // Create a new team
    const newTeam = new Team({
      teamName,
      description,
      members: [{
        employeeId: teamLeadId,
        role: 'Team Lead'
      }]
    });

    await newTeam.save();
    res.status(201).json({ message: 'Team created successfully', data: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new member to the team
router.post('/:teamId/member', isAuthenticated, async (req, res) => {
  const { teamId } = req.params;
  const { employeeId, role } = req.body;  // Role could be 'Member', 'Team Lead', etc.

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure the user is either the team lead or an admin to add members
    if (req.user.role !== 'Team Lead' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if employee is already a member of the team
    const existingMember = team.members.find(member => member.employeeId.toString() === employeeId);

    if (existingMember) {
      return res.status(400).json({ message: 'Employee is already a member of this team' });
    }

    // Add the new member to the team
    team.members.push({ employeeId, role });
    await team.save();

    res.status(200).json({ message: 'Member added successfully', data: team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Remove a member from a team
router.delete('/:teamId/member/:employeeId', isAuthenticated, async (req, res) => {
  const { teamId, employeeId } = req.params;

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure the user is either the team lead or an admin to remove members
    if (req.user.role !== 'Team Lead' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Find and remove the employee from the members list
    const updatedMembers = team.members.filter(member => member.employeeId.toString() !== employeeId);
    
    // Update the team members
    team.members = updatedMembers;
    await team.save();

    res.status(200).json({ message: 'Member removed successfully', data: team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Assign a new role to a team member
router.put('/:teamId/member/:employeeId', isAuthenticated, async (req, res) => {
  const { teamId, employeeId } = req.params;
  const { role } = req.body;  // Role could be 'Member', 'Team Lead', etc.

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the member to update
    const member = team.members.find(m => m.employeeId.toString() === employeeId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found in this team' });
    }

    // Update the role
    member.role = role;
    await team.save();

    res.status(200).json({ message: 'Role updated successfully', data: team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team details by teamId
router.get('/:teamId', isAuthenticated, async (req, res) => {
  const { teamId } = req.params;

  try {
    // Find the team by ID
    const team = await Team.findById(teamId).populate('members.employeeId', 'name email role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ message: 'Team details retrieved successfully', data: team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


module.exports = router;
