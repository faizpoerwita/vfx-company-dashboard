const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get notifications
router.get('/', auth, async (req, res) => {
  try {
    // Mock data for now
    const notifications = [
      {
        id: '1',
        type: 'info',
        message: 'New project "Avatar 2 VFX" has been assigned to you',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: '2',
        type: 'warning',
        message: 'Deadline approaching for "Star Wars Scene 5"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      },
      {
        id: '3',
        type: 'success',
        message: 'Your render for "Marvel Scene 12" is complete',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
      }
    ];
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;
