// Create admin user: node data/create-admin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import User from '../models/User.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cybershield.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      email: 'admin@cybershield.com',
      password: 'Admin@2024',  // Will be hashed by the model
      name: 'Admin User',
      fullName: 'CyberShield Admin',
      role: 'admin',
      score: 0,
      xp: 0,
      level: 1,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('ID:', admin._id);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
