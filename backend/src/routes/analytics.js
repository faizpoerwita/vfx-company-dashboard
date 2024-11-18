const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Debug middleware for analytics routes
router.use((req, res, next) => {
  console.log('[Analytics Route]', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: req.body
  });
  next();
});

// Get user role distribution
router.get('/role-distribution', auth, async (req, res) => {
  try {
    console.log('Fetching role distribution...');
    const roleDistribution = await User.aggregate([
      { $match: { role: { $exists: true } } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('Role distribution result:', roleDistribution);

    if (!Array.isArray(roleDistribution)) {
      throw new Error('Invalid role distribution data format');
    }

    return res.json({
      success: true,
      data: roleDistribution
    });
  } catch (error) {
    console.error('Error fetching role distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data distribusi role',
      error: error.message
    });
  }
});

// Get experience level distribution
router.get('/experience-distribution', auth, async (req, res) => {
  try {
    console.log('Fetching experience distribution...');
    const expDistribution = await User.aggregate([
      { $match: { experienceLevel: { $exists: true, $ne: null } } },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('Experience distribution result:', expDistribution);

    if (!Array.isArray(expDistribution)) {
      throw new Error('Invalid experience distribution data format');
    }

    return res.json({
      success: true,
      data: expDistribution
    });
  } catch (error) {
    console.error('Error fetching experience distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data distribusi pengalaman',
      error: error.message
    });
  }
});

// Get skills distribution
router.get('/skills-distribution', auth, async (req, res) => {
  try {
    console.log('Fetching skills distribution...');
    const skillsDistribution = await User.aggregate([
      { $match: { 'skills.0': { $exists: true } } },
      { $unwind: '$skills' },
      { 
        $group: { 
          _id: {
            name: '$skills.name',
            level: '$skills.level'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('Skills distribution result:', skillsDistribution);

    if (!Array.isArray(skillsDistribution)) {
      throw new Error('Invalid skills distribution data format');
    }

    return res.json({
      success: true,
      data: skillsDistribution
    });
  } catch (error) {
    console.error('Error fetching skills distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data distribusi skill',
      error: error.message
    });
  }
});

// Get work preferences stats
router.get('/work-preferences', auth, async (req, res) => {
  try {
    console.log('Fetching work preferences...');
    const workPreferences = await User.aggregate([
      { $match: { 'workPreferences.0': { $exists: true } } },
      { $unwind: '$workPreferences' },
      {
        $group: {
          _id: '$workPreferences.name',
          trueCount: {
            $sum: { $cond: [{ $eq: ['$workPreferences.value', 'true'] }, 1, 0] }
          },
          falseCount: {
            $sum: { $cond: [{ $eq: ['$workPreferences.value', 'false'] }, 1, 0] }
          }
        }
      },
      { $sort: { trueCount: -1 } }
    ]);

    console.log('Work preferences result:', workPreferences);

    if (!Array.isArray(workPreferences)) {
      throw new Error('Invalid work preferences data format');
    }

    return res.json({
      success: true,
      data: workPreferences
    });
  } catch (error) {
    console.error('Error fetching work preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data preferensi kerja',
      error: error.message
    });
  }
});

// Get disliked work areas
router.get('/disliked-areas', auth, async (req, res) => {
  try {
    console.log('Fetching disliked areas...');
    const dislikedAreas = await User.aggregate([
      { $match: { 'dislikedWorkAreas.0': { $exists: true } } },
      { $unwind: '$dislikedWorkAreas' },
      { 
        $group: { 
          _id: '$dislikedWorkAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('Disliked areas result:', dislikedAreas);

    if (!Array.isArray(dislikedAreas)) {
      throw new Error('Invalid disliked areas data format');
    }

    return res.json({
      success: true,
      data: dislikedAreas
    });
  } catch (error) {
    console.error('Error fetching disliked areas:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data area yang tidak disukai',
      error: error.message
    });
  }
});

// Get department distribution
router.get('/department-distribution', auth, async (req, res) => {
  try {
    console.log('Fetching department distribution...');
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get department stats
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          roles: {
            $push: '$role'
          }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          roleBreakdown: {
            $reduce: {
              input: '$roles',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $literal: {
                      $concat: [
                        '{"',
                        '$$this',
                        '": 1}'
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('Department stats:', {
      totalUsers,
      roleDistribution,
      departmentStats
    });

    if (!Array.isArray(departmentStats)) {
      throw new Error('Invalid department stats format');
    }

    return res.json({
      success: true,
      data: {
        totalUsers,
        roleDistribution,
        departments: departmentStats
      }
    });
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data distribusi departemen',
      error: error.message
    });
  }
});

// Get users by role
router.get('/users-by-role/:role', auth, async (req, res) => {
  try {
    console.log('Fetching users by role:', req.params.role);
    const users = await User.find(
      { role: req.params.role },
      'firstName lastName email role department status' // Only select needed fields
    ).sort({ firstName: 1, lastName: 1 });

    console.log(`Found ${users.length} users for role:`, req.params.role);

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching users by role',
      error: error.message
    });
  }
});

// Debug endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint accessed');
  res.json({
    success: true,
    message: 'Analytics routes are accessible',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
