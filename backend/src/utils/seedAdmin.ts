import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cellublock';
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected');
    
    const adminEmail = 'admin@cellublock.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await Admin.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin'
    });
    
    console.log('✅ Admin created successfully');
    console.log('Email:', adminEmail);
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
