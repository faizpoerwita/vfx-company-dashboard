const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get team members
router.get('/members', auth, async (req, res) => {
  try {
    // Mock data for now
    const teamMembers = [
      {
        id: '1',
        name: 'John Doe',
        role: '3D Artist',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online'
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Animator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'busy'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Compositor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        status: 'offline'
      }
    ];
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
});

module.exports = router;
