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

  if (event.path === '/.netlify/functions/stats/projects') {
    try {
      // For now, return mock data
      return {
        statusCode: 200,
        body: JSON.stringify({
          totalProjects: 10,
          completedProjects: 4,
          ongoingProjects: 5,
          delayedProjects: 1,
        }),
      };
    } catch (error) {
      console.error('Error fetching project stats:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching project stats' }),
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not found' }),
  };
};
