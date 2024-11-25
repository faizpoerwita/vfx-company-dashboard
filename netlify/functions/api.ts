import { Handler } from '@netlify/functions';
import express, { Router, Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';

dotenv.config();

// Initialize Express app
const app = express();
const router = Router();

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Basic health check route
router.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      frontend_url: process.env.FRONTEND_URL ? 'set' : 'not set',
      node_env: process.env.NODE_ENV || 'not set',
      mongodb_uri: process.env.MONGODB_URI ? 'set' : 'not set'
    }
  });
});

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    console.log('Attempting to connect to MongoDB...');
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    };

    await mongoose.connect(process.env.MONGODB_URI!, options);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);

// Mount router
app.use('/.netlify/functions/api', router);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handler
const handler: Handler = async (event, context) => {
  // Make sure to connect to MongoDB before handling the request
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Database connection failed'
      })
    };
  }

  // Serverless http handler
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
