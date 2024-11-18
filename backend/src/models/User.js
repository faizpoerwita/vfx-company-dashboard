const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Format email tidak valid'
    }
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: [6, 'Password minimal 6 karakter'],
    select: false
  },
  firstName: {
    type: String,
    trim: true,
    required: false,
    maxlength: [50, 'Nama depan tidak boleh lebih dari 50 karakter']
  },
  lastName: {
    type: String,
    trim: true,
    required: false,
    maxlength: [50, 'Nama belakang tidak boleh lebih dari 50 karakter']
  },
  role: {
    type: String,
    required: [true, 'Role harus diisi'],
    enum: {
      values: ROLES,
      message: '{VALUE} bukan role yang valid. Role yang tersedia: ' + ROLES.join(', ')
    }
  },
  experienceLevel: {
    type: String,
    enum: {
      values: SKILL_LEVELS,
      message: '{VALUE} bukan level yang valid. Level yang tersedia: ' + SKILL_LEVELS.join(', ')
    },
    required: false // Optional during signup, required during onboarding
  },
  skills: [{
    name: {
      type: String,
      required: [true, 'Nama skill harus diisi'],
      trim: true
    },
    level: {
      type: String,
      enum: {
        values: SKILL_LEVELS,
        message: '{VALUE} bukan level yang valid. Level yang tersedia: ' + SKILL_LEVELS.join(', ')
      },
      required: [true, 'Level skill harus diisi']
    }
  }],
  workPreferences: [{
    name: {
      type: String,
      required: [true, 'Nama preferensi harus diisi'],
      trim: true
    },
    value: {
      type: String,
      required: [true, 'Nilai preferensi harus diisi'],
      enum: {
        values: ['true', 'false'],
        message: 'Nilai preferensi harus true atau false'
      },
      default: 'true'
    }
  }],
  dislikedWorkAreas: [{
    type: String,
    trim: true
  }],
  portfolio: {
    type: String,
    trim: true,
    required: false,
    validate: {
      validator: function(v) {
        if (!v || v.trim() === '') return true; // Empty string or undefined is valid
        try {
          new URL(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Portfolio URL harus valid atau kosong'
    },
    set: function(v) {
      if (!v) return ''; // Convert null/undefined to empty string
      return v.trim();
    }
  },
  bio: {
    type: String,
    trim: true,
    required: false,
    maxlength: [500, 'Bio tidak boleh lebih dari 500 karakter']
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      
      // Ensure consistent data format
      ret.skills = ret.skills || [];
      ret.workPreferences = ret.workPreferences || [];
      ret.dislikedWorkAreas = ret.dislikedWorkAreas || [];
      ret.firstName = ret.firstName || '';
      ret.lastName = ret.lastName || '';
      ret.portfolio = ret.portfolio || '';
      ret.bio = ret.bio || '';
      
      return ret;
    }
  }
});

// Virtual for fullName
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.email.split('@')[0];
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error validating password');
  }
};

// Static method to find user by email with password
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
