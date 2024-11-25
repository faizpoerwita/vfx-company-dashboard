import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  }
});

const workPreferenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer', 'admin'],
    default: '3D Artist'
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  skills: [skillSchema],
  workPreferences: [workPreferenceSchema],
  dislikedWorkAreas: [{
    type: String
  }],
  portfolio: {
    type: String,
    required: false
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add password validation method
userSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model('User', userSchema);
