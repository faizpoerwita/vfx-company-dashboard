const express = require('express');
const router = express.Router();
const Resource = require('../models/resource');
const auth = require('../middleware/auth');

// Get all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ organization: req.user.organization })
      .populate('project', 'name')
      .sort({ updatedAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resource by id
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      organization: req.user.organization
    }).populate('project', 'name');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create resource
router.post('/', auth, async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      organization: req.user.organization,
      createdBy: req.user._id
    });
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update resource
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization
    });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resources by project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const resources = await Resource.find({
      project: req.params.projectId,
      organization: req.user.organization
    }).sort({ updatedAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
