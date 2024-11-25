import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Define User Schema
const userSchema = new mongoose.Schema({
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email and update role to admin
    const email = 'ilmuwankecil@gmail.com'; // Your email
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (updatedUser) {
      console.log('Admin setup successful:', {
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      console.log('User not found with email:', email);
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

setupAdmin();
