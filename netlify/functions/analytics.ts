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

  // Verify token
  const authResult = await authenticateToken(event);
  if (!authResult.success) {
    return {
      statusCode: 401,
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
          body: JSON.stringify(roleDistribution),
        };

      case 'experience':
        const experienceDistribution = await User.aggregate([
          { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
        ]);
        return {
          statusCode: 200,
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
          body: JSON.stringify(workPreferences),
        };

      case 'dislikes':
        const dislikedAreas = await User.aggregate([
          { $unwind: '$dislikes' },
          { $group: { _id: '$dislikes', count: { $sum: 1 } } }
        ]);
        return {
          statusCode: 200,
          body: JSON.stringify(dislikedAreas),
        };

      case 'departments':
        const departmentStats = await User.aggregate([
          {
            $facet: {
              totalUsers: [{ $count: 'count' }],
              roleDistribution: [
                { $group: { _id: '$role', count: { $sum: 1 } } }
              ],
              departments: [
                { $group: { _id: '$department', count: { $sum: 1 } } }
              ]
            }
          }
        ]);

        const formattedDepartmentStats = {
          totalUsers: departmentStats[0].totalUsers[0]?.count || 0,
          roleDistribution: departmentStats[0].roleDistribution || [],
          departments: departmentStats[0].departments || []
        };

        return {
          statusCode: 200,
          body: JSON.stringify(formattedDepartmentStats),
        };

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching analytics' }),
    };
  }
};
