import { Router } from 'express';
import { User } from '../models/User';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { ApiResponse } from '../../../src/types/api';

const router = Router();

// Middleware to ensure only admins can access analytics
router.use(authenticateToken, isAdmin);

// Get role distribution
router.get('/role-distribution', async (req, res) => {
  try {
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          role: '$_id',
          count: 1,
          percentage: {
            $multiply: [
              { $divide: ['$count', { $size: await User.find() }] },
              100
            ]
          }
        }
      }
    ]);

    res.json({ success: true, data: roleDistribution });
  } catch (error) {
    console.error('Error getting role distribution:', error);
    res.status(500).json({ success: false, error: 'Failed to get role distribution' });
  }
});

// Get user growth data
router.get('/user-growth', async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' }
            ]
          },
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: userGrowth });
  } catch (error) {
    console.error('Error getting user growth data:', error);
    res.status(500).json({ success: false, error: 'Failed to get user growth data' });
  }
});

// Get user activity data
router.get('/user-activity', async (req, res) => {
  try {
    const userActivity = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$lastLogin' },
            year: { $year: '$lastLogin' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' }
            ]
          },
          status: '$_id.status',
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: userActivity });
  } catch (error) {
    console.error('Error getting user activity data:', error);
    res.status(500).json({ success: false, error: 'Failed to get user activity data' });
  }
});

// Get key metrics
router.get('/key-metrics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    const metrics = {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      mostCommonRole: roleDistribution[0]?._id || 'N/A',
      activeUsersPercentage: ((activeUsers / totalUsers) * 100).toFixed(1)
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error getting key metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to get key metrics' });
  }
});

export default router;
