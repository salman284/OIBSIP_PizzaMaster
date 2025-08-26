const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pizzamaster.com' });
    
    if (existingAdmin) {
      console.log('✅ Default admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pizzamaster.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      phoneNumber: '+1234567890'
    });

    console.log('✅ Default admin user created successfully');
    console.log('📧 Email: admin@pizzamaster.com');
    console.log('🔐 Password: admin123');
    console.log('⚠️ Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
  }
};

module.exports = createDefaultAdmin;
