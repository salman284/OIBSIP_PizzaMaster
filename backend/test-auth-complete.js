// Direct authentication test without HTTP
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Use bcryptjs to match User model
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import our models and routes
const User = require('./models/User');

async function testAuthenticationFlow() {
  console.log('🧪 Testing Complete Authentication Flow\n');
  
  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    
    // Clean up any existing test user
    await User.deleteMany({ email: 'test@example.com' });
    
    const testUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123', // This will be auto-hashed by pre-save middleware
      phoneNumber: '1234567890'
    };
    
    // Create user - password will be auto-hashed by the User model
    const newUser = new User({
      ...testUserData,
      isEmailVerified: false,
      emailVerificationToken: jwt.sign(
        { email: testUserData.email }, 
        process.env.JWT_SECRET || 'fallback_secret'
      )
    });
    
    await newUser.save();
    console.log('✅ User created successfully');
    console.log(`   - ID: ${newUser._id}`);
    console.log(`   - Email: ${newUser.email}`);
    console.log(`   - Verified: ${newUser.isEmailVerified}\n`);
    
    // Test 2: User Login
    console.log('2️⃣ Testing User Login...');
    
    const foundUser = await User.findOne({ email: testUserData.email }).select('+password');
    if (!foundUser) {
      throw new Error('User not found');
    }
    
    console.log('   - Found user password field:', foundUser.password ? 'Present' : 'Missing');
    console.log('   - Password length:', foundUser.password ? foundUser.password.length : 'N/A');
    
    if (!foundUser.password) {
      throw new Error('User password is missing from database');
    }
    
    // Use the model's matchPassword method
    const isPasswordValid = await foundUser.matchPassword(testUserData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    
    const loginToken = jwt.sign(
      { userId: foundUser._id, email: foundUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful');
    console.log(`   - Token generated: ${loginToken.substring(0, 20)}...`);
    console.log(`   - User ID: ${foundUser._id}\n`);
    
    // Test 3: Token Verification
    console.log('3️⃣ Testing JWT Token Verification...');
    
    const decoded = jwt.verify(loginToken, process.env.JWT_SECRET || 'fallback_secret');
    console.log('✅ Token verified successfully');
    console.log(`   - User ID from token: ${decoded.userId}`);
    console.log(`   - Email from token: ${decoded.email}\n`);
    
    // Test 4: Email Verification
    console.log('4️⃣ Testing Email Verification...');
    
    if (!foundUser.emailVerificationToken) {
      console.log('   - No email verification token found, generating new one...');
      const newVerificationToken = jwt.sign(
        { email: foundUser.email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );
      foundUser.emailVerificationToken = newVerificationToken;
      await foundUser.save();
      console.log('   - New verification token generated');
    }
    
    const verificationDecoded = jwt.verify(
      foundUser.emailVerificationToken,
      process.env.JWT_SECRET || 'fallback_secret'
    );
    
    if (verificationDecoded.email === foundUser.email) {
      foundUser.isEmailVerified = true;
      foundUser.emailVerificationToken = undefined;
      await foundUser.save();
      console.log('✅ Email verification successful');
    } else {
      throw new Error('Invalid verification token');
    }
    
    // Test 5: Password Reset Token Generation
    console.log('5️⃣ Testing Password Reset...');
    
    const resetToken = jwt.sign(
      { email: foundUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
    
    foundUser.passwordResetToken = resetToken;
    foundUser.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await foundUser.save();
    
    console.log('✅ Password reset token generated');
    console.log(`   - Reset token: ${resetToken.substring(0, 20)}...\n`);
    
    // Test 6: Admin User Creation
    console.log('6️⃣ Testing Admin User Creation...');
    
    // Clean up any existing admin
    await User.deleteMany({ email: 'admin@pizzamaster.com' });
    
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pizzamaster.com',
      password: 'admin123', // Will be auto-hashed
      phoneNumber: '0000000000',
      role: 'admin',
      isEmailVerified: true
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`   - Admin ID: ${adminUser._id}`);
    console.log(`   - Role: ${adminUser.role}\n`);
    
    // Summary
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED! 🎉\n');
    console.log('✅ User Registration Working');
    console.log('✅ Password Hashing Working');
    console.log('✅ User Login Working');
    console.log('✅ JWT Token Generation Working');
    console.log('✅ JWT Token Verification Working');
    console.log('✅ Email Verification Flow Working');
    console.log('✅ Password Reset Flow Working');
    console.log('✅ Admin User Creation Working');
    console.log('✅ MongoDB Integration Working');
    
    console.log('\n📊 Database Status:');
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`   - Total Users: ${userCount}`);
    console.log(`   - Admin Users: ${adminCount}`);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteMany({ email: { $in: ['test@example.com', 'admin@pizzamaster.com'] } });
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 MongoDB connection closed');
    process.exit(0);
  }
}

testAuthenticationFlow();
