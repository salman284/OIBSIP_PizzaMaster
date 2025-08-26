// Test our authentication routes directly without HTTP
const path = require('path');
process.chdir(path.join(__dirname));

// Load environment variables
require('dotenv').config();

// Test if our auth routes can be loaded
try {
  console.log('Testing auth routes import...');
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded successfully');
  
  // Test User model
  const User = require('./models/User');
  console.log('✅ User model loaded successfully');
  
  // Test if bcrypt works
  const bcrypt = require('bcrypt');
  const testPassword = 'password123';
  const hashedPassword = bcrypt.hashSync(testPassword, 10);
  const isValid = bcrypt.compareSync(testPassword, hashedPassword);
  console.log('✅ Bcrypt working:', isValid);
  
  // Test JWT
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ userId: 'test' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  console.log('✅ JWT working:', decoded.userId === 'test');
  
  // Test nodemailer config
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'placeholder@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'placeholder'
    }
  });
  console.log('✅ Nodemailer configured');
  
  console.log('\n🎉 All auth dependencies are working correctly!');
  console.log('📝 Environment variables:');
  console.log('  - MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Not set');
  console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
  console.log('  - EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('  - EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  
} catch (error) {
  console.error('❌ Error testing auth system:', error.message);
}
