const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// Available roles
const VALID_ROLES = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];

// Helper function to generate tokens
const generateTokens = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

// Helper function to set cookies
const setAuthCookies = (res, { accessToken, refreshToken }) => {
  try {
    // Access token cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Refresh token cookie
    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    throw error;
  }
};

// Signin endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Validate password
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare user data
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      experienceLevel: user.experienceLevel || '',
      skills: user.skills || [],
      workPreferences: user.workPreferences || [],
      dislikedWorkAreas: user.dislikedWorkAreas || [],
      portfolio: user.portfolio || '',
      bio: user.bio || '',
      onboardingCompleted: user.onboardingCompleted || false
    };

    // Send successful response
    return res.json({
      success: true,
      message: 'Berhasil masuk',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan role harus diisi'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid. Role yang tersedia: ' + VALID_ROLES.join(', ')
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Create new user
    const user = new User({
      email,
      password, // Will be hashed by the pre-save middleware
      role,
      onboardingCompleted: false
    });

    // Save user
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set auth cookies
    setAuthCookies(res, { accessToken, refreshToken });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil',
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific error cases
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
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
    const tokens = await generateTokens(user);
    await setAuthCookies(res, tokens);

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
      success: true,
      message: 'Profil berhasil diperbarui',
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
        success: false,
        message: 'Data profil tidak valid',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid',
        expired: error.name === 'TokenExpiredError'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
