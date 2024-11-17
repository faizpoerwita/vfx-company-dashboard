const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Organization = require('../models/organization');
const auth = require('../middleware/auth');

// Get user settings
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('organization', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user settings
router.put('/user', auth, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'email', 'notifications', 'theme'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get organization settings
router.get('/organization', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.organization);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update organization settings (admin only)
router.put('/organization', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user._id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update organization settings' });
    }

    const allowedUpdates = ['name', 'settings', 'preferences'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const organization = await Organization.findByIdAndUpdate(
      req.user.organization,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
