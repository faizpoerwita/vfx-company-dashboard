      experience,
      portfolio,
      bio,
      preferences,
      dislikes
    } = req.body;

    // Log the request body for debugging
    console.log('Profile update request:', {
      userId: req.user.id,
      body: req.body
    });

    // Validate required fields during onboarding
    if (onboardingCompleted) {
      if (!firstName || !lastName) {
        return res.status(400).json({ 
          message: 'First name and last name are required to complete onboarding' 
        });
      }
      if (!skills || !skills.length) {
        return res.status(400).json({ 
          message: 'At least one skill is required to complete onboarding' 
        });
      }
    }

    // Find user and update their profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        role,
        onboardingCompleted,
        skills,
        experience,
        portfolio,
        bio,
        preferences,
        dislikes,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', user);
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ 
      message: 'Server error during profile update',
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

module.exports = router;
