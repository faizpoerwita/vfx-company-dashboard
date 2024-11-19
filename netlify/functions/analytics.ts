import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { User } from './models/User';
import { authenticateToken } from './middleware/auth';

const createResponse = (statusCode: number, data: any = null, error: string | null = null) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    success: statusCode === 200,
    data,
    ...(error && { error })
  })
});

export const handler: Handler = async (event, context) => {
  // Enable CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: '',
    };
  }

  // Verify token
  const authResult = await authenticateToken(event);
  if (!authResult.success) {
    return createResponse(401, null, 'Unauthorized');
  }

  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection error:', error);
    return createResponse(500, null, 'Internal server error');
  }

  const path = event.path.replace('/.netlify/functions/analytics/', '');
  const segments = path.split('/');
  const endpoint = segments[0];

  try {
    switch (endpoint) {
      case 'role-distribution':
        const roleDistribution = await User.aggregate([
          { $match: { status: 'active' } },
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        return createResponse(200, roleDistribution);

      case 'experience-distribution':
        const experienceDistribution = await User.aggregate([
          { $match: { experienceLevel: { $exists: true }, status: 'active' } },
          { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        return createResponse(200, experienceDistribution);

      case 'skills-distribution':
        const skillsDistribution = await User.aggregate([
          { $match: { status: 'active' } },
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
        return createResponse(200, skillsDistribution);

      case 'work-preferences':
        const workPreferences = await User.aggregate([
          { $match: { status: 'active' } },
          { $unwind: '$workPreferences' },
          {
            $group: {
              _id: '$workPreferences.name',
              trueCount: {
                $sum: { $cond: [{ $eq: ['$workPreferences.value', true] }, 1, 0] }
              },
              falseCount: {
                $sum: { $cond: [{ $eq: ['$workPreferences.value', false] }, 1, 0] }
              }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        return createResponse(200, workPreferences);

      case 'disliked-areas':
        const dislikedAreas = await User.aggregate([
          { $match: { dislikes: { $exists: true }, status: 'active' } },
          { $unwind: '$dislikes' },
          { $group: { _id: '$dislikes', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        return createResponse(200, dislikedAreas);

      case 'department-distribution':
        const [departmentStats] = await User.aggregate([
          { $match: { status: 'active' } },
          {
            $facet: {
              totalUsers: [
                { $count: 'count' }
              ],
              roleDistribution: [
                { $group: { _id: '$role', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
              ],
              departments: [
                { 
                  $group: { 
                    _id: '$department', 
                    count: { $sum: 1 },
                    roles: {
                      $push: {
                        role: '$role',
                        experienceLevel: '$experienceLevel'
                      }
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
                              $let: {
                                vars: {
                                  currentCount: {
                                    $ifNull: [
                                      { $getField: { field: { $toString: '$$this.role' }, input: '$$value' } },
                                      0
                                    ]
                                  }
                                },
                                in: {
                                  $literal: {
                                    $concat: [
                                      '{"',
                                      '$$this.role',
                                      '":',
                                      { $add: ['$$currentCount', 1] },
                                      '}'
                                    ]
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                { $sort: { count: -1 } }
              ]
            }
          },
          {
            $addFields: {
              totalUsers: { $arrayElemAt: ['$totalUsers.count', 0] }
            }
          }
        ]);

        return createResponse(200, {
          totalUsers: departmentStats.totalUsers || 0,
          roleDistribution: departmentStats.roleDistribution || [],
          departments: departmentStats.departments || []
        });

      case 'users-by-role':
        if (!segments[1]) {
          return createResponse(400, null, 'Role parameter is required');
        }

        const role = decodeURIComponent(segments[1]);
        const users = await User.find(
          { role, status: 'active' },
          {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            department: 1,
            experienceLevel: 1,
            status: 1
          }
        ).sort({ lastName: 1, firstName: 1 });

        return createResponse(200, users);

      default:
        return createResponse(404, null, 'Endpoint not found');
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return createResponse(500, null, 'Failed to fetch analytics data');
  }
};
