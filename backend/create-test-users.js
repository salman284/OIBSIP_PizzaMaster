// Create test users for testing profile and logout functionality
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

async function createTestUsers() {
  console.log('🧪 Creating Test Users\n');
  
  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Clean up any existing test users
    await User.deleteMany({ 
      email: { $in: ['testuser@pizzamaster.com', 'admin@pizzamaster.com'] } 
    });
    
    // Create test regular user
    console.log('1️⃣ Creating Test User...');
    const testUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'testuser@pizzamaster.com',
      password: 'password123',
      phoneNumber: '1234567890',
      address: '123 Pizza Street, Food City',
      role: 'user',
      isEmailVerified: true
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log(`   - Email: testuser@pizzamaster.com`);
    console.log(`   - Password: password123`);
    console.log(`   - Role: ${testUser.role}\n`);
    
    // Create test admin user
    console.log('2️⃣ Creating Admin User...');
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pizzamaster.com',
      password: 'admin123',
      phoneNumber: '9876543210',
      address: '456 Admin Avenue, Management City',
      role: 'admin',
      isEmailVerified: true
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`   - Email: admin@pizzamaster.com`);
    console.log(`   - Password: admin123`);
    console.log(`   - Role: ${adminUser.role}\n`);
    
    console.log('🎉 TEST USERS CREATED SUCCESSFULLY! 🎉\n');
    console.log('📋 Login Credentials:');
    console.log('-------------------');
    console.log('👤 Regular User:');
    console.log('   Email: testuser@pizzamaster.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👨‍💼 Admin User:');
    console.log('   Email: admin@pizzamaster.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🌐 Application URL: http://localhost:5173');
    console.log('🔗 API URL: http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 MongoDB connection closed');
    process.exit(0);
  }
}

createTestUsers();
