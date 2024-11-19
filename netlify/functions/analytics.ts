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

  try {
    switch (path) {
      case 'role-distribution':
        const roleDistribution = await User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        return createResponse(200, roleDistribution);

      case 'experience-distribution':
        const experienceDistribution = await User.aggregate([
          { $match: { experienceLevel: { $exists: true } } },
          { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        return createResponse(200, experienceDistribution);

      case 'skills-distribution':
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
        return createResponse(200, skillsDistribution);

      case 'work-preferences':
        const workPreferences = await User.aggregate([
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
          { $match: { dislikes: { $exists: true } } },
          { $unwind: '$dislikes' },
          { $group: { _id: '$dislikes', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        return createResponse(200, dislikedAreas);

      case 'department-distribution':
        const [departmentStats] = await User.aggregate([
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
                    users: { $push: '$$ROOT' }
                  } 
                },
                {
                  $addFields: {
                    roleBreakdown: {
                      $reduce: {
                        input: '$users',
                        initialValue: {},
                        in: {
                          $mergeObjects: [
                            '$$value',
                            {
                              $literal: {
                                $concat: [
                                  '{"',
                                  '$$this.role',
                                  '": ',
                                  { $add: [{ $ifNull: ['$$value.$$this.role', 0] }, 1] },
                                  '}'
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    count: 1,
                    roleBreakdown: 1,
                    users: 0
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

      default:
        return createResponse(404, null, 'Endpoint not found');
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return createResponse(500, null, 'Failed to fetch analytics data');
  }
};
