import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vfx-dashboard-2023-f8a72c1b9d3e4f5689c0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z';

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.'
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Log request data (excluding password)
    console.log('Received signup request:', {
      email: email || 'missing',
      role: role || 'missing',
      hasPassword: !!password
    });

    // Validate required fields
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!role) missingFields.push('role');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field berikut harus diisi: ${missingFields.join(', ')}`
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

    // Validate role
    const validRoles = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role tidak valid. Role yang tersedia: ${validRoles.join(', ')}`
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      onboardingCompleted: false
    });

    // Log user object before saving (excluding sensitive data)
    console.log('Creating user:', {
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check for specific MongoDB errors
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          details: error.message
        });
      } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user'
    });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this endpoint

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui profil'
    });
  }
});

router.post('/signout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Berhasil keluar'
  });
});

export default router;
