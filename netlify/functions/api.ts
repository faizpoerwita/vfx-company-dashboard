import { Handler } from '@netlify/functions';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const router = Router();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Basic health check route
router.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      frontend_url: process.env.FRONTEND_URL || 'not set',
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
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('/.netlify/functions/api', router);

// Handler
export const handler: Handler = async (event, context) => {
  console.log('Function invoked:', event.path);
  
  try {
    // Connect to MongoDB before handling the request
    await connectDB();
    
    // Serverless handler
    const result = await serverless(app)(event, context);
    console.log('Response:', result.statusCode);
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: 'Terjadi kesalahan pada server'
      })
    };
  }
};
