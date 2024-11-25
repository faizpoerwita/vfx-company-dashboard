import { Router } from 'express';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import mongoose from 'mongoose';

const router = Router();

// Require authentication for all analytics routes
router.use(authenticateToken);

// Ensure MongoDB is connected before processing requests
router.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      };
      await mongoose.connect(process.env.MONGODB_URI!, options);
      console.log('MongoDB connected in analytics routes');
    }
    next();
  } catch (error) {
    console.error('MongoDB connection error in analytics routes:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error'
    });
  }
});

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
      { $sort: { _id: 1 } }
    ]);

    res.json(roleDistribution);
  } catch (error) {
    console.error('Error fetching role distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role distribution'
    });
  }
});

// Get experience level distribution
router.get('/experience-distribution', async (req, res) => {
  try {
    const experienceDistribution = await User.aggregate([
      {
        $group: {
          _id: '$experienceLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(experienceDistribution);
  } catch (error) {
    console.error('Error fetching experience distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience distribution'
    });
  }
});

// Get skills distribution
router.get('/skills-distribution', async (req, res) => {
  try {
    const skillsDistribution = await User.aggregate([
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
      { $sort: { '_id.name': 1, '_id.level': 1 } }
    ]);

    res.json(skillsDistribution);
  } catch (error) {
    console.error('Error fetching skills distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills distribution'
    });
  }
});

// Get work preferences distribution
router.get('/work-preferences', async (req, res) => {
  try {
    const workPreferences = await User.aggregate([
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
      { $sort: { _id: 1 } }
    ]);

    res.json(workPreferences);
  } catch (error) {
    console.error('Error fetching work preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work preferences'
    });
  }
});

// Get disliked work areas distribution
router.get('/disliked-areas', async (req, res) => {
  try {
    const dislikedAreas = await User.aggregate([
      { $unwind: '$dislikedWorkAreas' },
      {
        $group: {
          _id: '$dislikedWorkAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(dislikedAreas);
  } catch (error) {
    console.error('Error fetching disliked areas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disliked areas'
    });
  }
});

// Get department distribution
router.get('/department-distribution', async (req, res) => {
  try {
    const [totalUsers, roleDistribution, departments] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            roleBreakdown: {
              $push: '$role'
            }
          }
        },
        {
          $project: {
            _id: 1,
            count: 1,
            roleBreakdown: {
              $arrayToObject: {
                $map: {
                  input: {
                    $setUnion: '$roleBreakdown'
                  },
                  as: 'role',
                  in: {
                    k: '$$role',
                    v: {
                      $size: {
                        $filter: {
                          input: '$roleBreakdown',
                          cond: { $eq: ['$$this', '$$role'] }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      totalUsers,
      roleDistribution,
      departments
    });
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department distribution'
    });
  }
});

// Get users by role
router.get('/users-by-role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role })
      .select('firstName lastName email role experienceLevel')
      .sort({ firstName: 1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users by role'
    });
  }
});

export default router;
