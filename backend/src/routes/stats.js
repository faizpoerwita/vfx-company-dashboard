const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get project statistics
router.get('/projects', auth, async (req, res) => {
  try {
    // Mock data for now
    const projectStats = {
      totalProjects: 12,
      completedProjects: 5,
      ongoingProjects: 6,
      upcomingDeadlines: 3
    };
    res.json(projectStats);
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ message: 'Error fetching project statistics' });
  }
});

// Get task statistics
router.get('/tasks', auth, async (req, res) => {
  try {
    // Mock data for now
    const taskStats = {
      completed: 25,
      inProgress: 15,
      pending: 8,
      overdue: 2
    };
    res.json(taskStats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
});

module.exports = router;
