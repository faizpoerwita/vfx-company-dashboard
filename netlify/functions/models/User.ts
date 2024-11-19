import mongoose from 'mongoose';

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
  phone: String,
  bio: String,
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  workPreferences: [{
    name: String,
    value: String
  }],
  learningInterests: String,
  portfolio: String,
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: Date
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
