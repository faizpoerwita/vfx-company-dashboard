import { Handler } from '@netlify/functions';
import { connectToDatabase } from './utils/db';
import { User } from './models/User';
import { authenticateToken } from './middleware/auth';

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

  // Common headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Verify token
  const authResult = await authenticateToken(event);
  if (!authResult.success) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }

  const path = event.path.replace('/.netlify/functions/analytics/', '');

  try {
    switch (path) {
      case 'roles':
        const roleDistribution = await User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(roleDistribution),
        };

      case 'experience':
        const experienceDistribution = await User.aggregate([
          { $match: { experienceLevel: { $exists: true } } },
          { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
        ]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(experienceDistribution),
        };

      case 'skills':
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
          }
        ]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(skillsDistribution),
        };

      case 'preferences':
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
          }
        ]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(workPreferences),
        };

      case 'dislikes':
        const dislikedAreas = await User.aggregate([
          { $match: { dislikes: { $exists: true } } },
          { $unwind: '$dislikes' },
          { $group: { _id: '$dislikes', count: { $sum: 1 } } }
        ]);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(dislikedAreas),
        };

      case 'departments':
        const [departmentStats] = await User.aggregate([
          {
            $facet: {
              totalUsers: [{ $count: 'count' }],
              roleDistribution: [
                { $group: { _id: '$role', count: { $sum: 1 } } }
              ],
              departments: [
                { $group: { _id: '$department', count: { $sum: 1 } } },
                {
                  $lookup: {
                    from: 'users',
                    let: { dept: '$_id' },
                    pipeline: [
                      { $match: { $expr: { $eq: ['$department', '$$dept'] } } },
                      { $group: { _id: '$role', count: { $sum: 1 } } }
                    ],
                    as: 'roleBreakdown'
                  }
                }
              ]
            }
          }
        ]);

        const formattedDepartmentStats = {
          totalUsers: departmentStats.totalUsers[0]?.count || 0,
          roleDistribution: departmentStats.roleDistribution || [],
          departments: departmentStats.departments.map((dept: any) => ({
            ...dept,
            roleBreakdown: dept.roleBreakdown.reduce((acc: any, role: any) => {
              acc[role._id] = role.count;
              return acc;
            }, {})
          }))
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(formattedDepartmentStats),
        };

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error fetching analytics data' }),
    };
  }
};
