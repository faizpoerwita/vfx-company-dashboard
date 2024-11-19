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

  // Add CORS headers to all responses
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

  const path = event.path.replace('/.netlify/functions/stats/', '');

  if (path === 'projects' || path === '') {
    try {
      // For now, return mock data
      const mockData = {
        totalProjects: 10,
        completedProjects: 4,
        ongoingProjects: 5,
        delayedProjects: 1,
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockData),
      };
    } catch (error) {
      console.error('Error fetching project stats:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Error fetching project statistics' }),
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ message: 'Not found' }),
  };
};
