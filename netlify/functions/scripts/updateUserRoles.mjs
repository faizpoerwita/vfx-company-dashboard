import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Define User Schema
const userSchema = new mongoose.Schema({
  email: String,
  roles: [String]  // Array of roles
});

const User = mongoose.model('User', userSchema);

const updateUserRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email and update roles
    const email = 'ilmuwankecil@gmail.com';
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { 
          role: '3D Artist',  // Primary role
          roles: ['3D Artist', 'admin']  // All roles
        } 
      },
      { new: true }
    );

    if (updatedUser) {
      console.log('User roles updated successfully:', {
        email: updatedUser.email,
        primaryRole: updatedUser.role,
        allRoles: updatedUser.roles
      });
    } else {
      console.log('User not found with email:', email);
    }
  } catch (error) {
    console.error('Error updating user roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateUserRoles();
