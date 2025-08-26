const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzamaster');
    console.log('Connected to MongoDB');

    // Find the admin user with password field included
    const admin = await User.findOne({ email: 'admin@pizzamaster.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('First Name:', admin.firstName);
    console.log('Last Name:', admin.lastName);
    console.log('Is Email Verified:', admin.isEmailVerified);
    
    // Test password
    const isPasswordCorrect = await admin.matchPassword('admin123');
    console.log('Password Test:', isPasswordCorrect ? '✅ Correct' : '❌ Incorrect');

    if (!isPasswordCorrect) {
      console.log('⚠️ Updating admin password...');
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Admin password updated');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAdminLogin();
