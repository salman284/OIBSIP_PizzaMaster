const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzamaster');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pizzamaster.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@pizzamaster.com');
      console.log('🔐 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pizzamaster.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      phoneNumber: '+1234567890'
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@pizzamaster.com');
    console.log('🔐 Password: admin123');
    console.log('⚠️ Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
