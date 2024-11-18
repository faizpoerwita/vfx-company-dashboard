require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const teamRoutes = require('./routes/team');
const notificationsRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Headers'
  ],
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Request logging middleware with CORS debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vfx-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  console.log('Connection URI:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vfx-dashboard');
  
  // Test the connection and create test data if needed
  try {
    const User = require('./models/user');
    const count = await User.countDocuments();
    console.log('Number of users in database:', count);

    // Create test data if no users exist
    if (count === 0) {
      console.log('Creating test data...');
      
      const testUsers = [
        {
          email: 'ilmuwankecil@gmail.com',
          password: 'password123',
          role: '3D Artist',
          experienceLevel: 'Senior',
          firstName: 'Test',
          lastName: 'User',
          skills: [
            { name: 'Maya', level: 'Expert' },
            { name: 'Blender', level: 'Intermediate' }
          ],
          workPreferences: [
            { name: 'Remote Work', value: 'true' },
            { name: 'Flexible Hours', value: 'true' }
          ],
          dislikedWorkAreas: ['Rigging', 'Documentation'],
          onboardingCompleted: true
        },
        {
          email: 'artist@vfx.com',
          password: 'password123',
          role: 'VFX Artist',
          experienceLevel: 'Mid',
          firstName: 'VFX',
          lastName: 'Artist',
          skills: [
            { name: 'Houdini', level: 'Expert' },
            { name: 'Nuke', level: 'Advanced' }
          ],
          workPreferences: [
            { name: 'Remote Work', value: 'false' },
            { name: 'Flexible Hours', value: 'true' }
          ],
          dislikedWorkAreas: ['Management', 'Client Communication'],
          onboardingCompleted: true
        }
      ];

      await User.insertMany(testUsers);
      console.log('Test data created successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  console.error('Connection string used:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vfx-dashboard');
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ 
      message: 'Email sudah terdaftar' 
    });
  }
  
  res.status(500).json({ 
    message: 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
