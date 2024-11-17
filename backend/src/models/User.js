const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['3D Artist', 'Animator', 'Compositor', 'VFX Supervisor', 'Producer'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: false
  },
  lastName: {
    type: String,
    trim: true,
    required: false
  },
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
  role: {
    type: String,
    required: [true, 'Role harus diisi'],
    enum: {
      values: ROLES,
      message: '{VALUE} bukan role yang valid. Role yang tersedia: ' + ROLES.join(', ')
    }
  },
  phone: {
    type: String,
    trim: true,
    required: false
  },
  bio: {
    type: String,
    trim: true,
    required: false,
    maxlength: [500, 'Bio tidak boleh lebih dari 500 karakter']
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
      trim: true
    }
  }],
  learningInterests: {
    type: String,
    trim: true,
    required: false,
    maxlength: [300, 'Learning interests tidak boleh lebih dari 300 karakter']
  },
  portfolio: {
    type: String,
    trim: true,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Portfolio URL harus valid'
    }
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Virtual for fullName
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`.trim();
  }
  return this.firstName || this.email.split('@')[0];
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    // Hash password with cost factor 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to ensure firstName is set
userSchema.pre('save', async function(next) {
  try {
    // If firstName is not set but fullName is provided
    if (!this.firstName && this._doc.fullName) {
      const nameParts = this._doc.fullName.trim().split(/\s+/);
      this.firstName = nameParts[0];
      this.lastName = nameParts.slice(1).join(' ');
    }
    // Fallback to email prefix if no name is provided
    else if (!this.firstName && this.email) {
      this.firstName = this.email.split('@')[0];
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
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
