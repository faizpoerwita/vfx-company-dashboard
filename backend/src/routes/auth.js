const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Helper function to set cookies
const setAuthCookies = (res, { accessToken, refreshToken }) => {
  // Access token cookie
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // Refresh token cookie
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
};

// Signin endpoint
router.post('/signin', async (req, res) => {
  try {
    console.log('Signin request:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password harus diisi'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({
        message: 'Email atau password salah'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);
    setAuthCookies(res, tokens);

    res.json({
      message: 'Login berhasil',
      token: tokens.accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { email, password, role, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Semua field harus diisi',
        details: {
          email: !email ? 'Email harus diisi' : null,
          password: !password ? 'Password harus diisi' : null,
          role: !role ? 'Role harus diisi' : null
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'Email sudah terdaftar'
      });
    }

    // Create new user
    const user = new User({ 
      email, 
      password, 
      role,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    
    try {
      await user.validate();
    } catch (validationError) {
      console.log('Validation error:', validationError);
      return res.status(400).json({
        message: 'Data tidak valid',
        details: validationError.errors
      });
    }

    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);
    setAuthCookies(res, tokens);

    res.status(201).json({
      message: 'Pendaftaran berhasil',
      token: tokens.accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mendaftar',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'User tidak ditemukan'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    setAuthCookies(res, tokens);

    res.json({
      message: 'Token refreshed successfully',
      token: tokens.accessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      message: 'Invalid refresh token'
    });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      onboardingCompleted: user.onboardingCompleted
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token tidak valid',
        expired: error.name === 'TokenExpiredError'
      });
    }
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        workPreferences: user.workPreferences,
        learningInterests: user.learningInterests,
        portfolio: user.portfolio,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token tidak valid',
        expired: error.name === 'TokenExpiredError'
      });
    }
    res.status(500).json({
      message: 'Gagal mengambil data profil',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'phone', 
      'bio', 
      'skills', 
      'workPreferences', 
      'learningInterests', 
      'portfolio',
      'onboardingCompleted'
    ];
    
    const updates = req.body;
    const updateObj = {};

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateObj[field] = updates[field];
      }
    });

    Object.assign(user, updateObj);
    await user.validate();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        workPreferences: user.workPreferences,
        learningInterests: user.learningInterests,
        portfolio: user.portfolio,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token tidak valid',
        expired: error.name === 'TokenExpiredError'
      });
    }
    res.status(500).json({
      message: 'Error updating profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout endpoint
router.post('/signout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'Signout berhasil' });
});

module.exports = router;
