/**
 * One-off maintenance script to verify existing stuck users in MongoDB.
 * This is a standalone CLI tool and is NOT exposed as an HTTP route.
 * 
 * Usage:
 *   node scripts/verifyExistingUsers.js user@example.com
 *   node scripts/verifyExistingUsers.js user1@example.com user2@example.com
 *   node scripts/verifyExistingUsers.js --all
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('------------------------------------------------------------');
  console.log('PizzaMaster - Account Verification Utility');
  console.log('------------------------------------------------------------');
  console.log('Usage:');
  console.log('  node scripts/verifyExistingUsers.js <email1> [email2 ...]');
  console.log('  node scripts/verifyExistingUsers.js --all');
  console.log('------------------------------------------------------------');
  process.exit(1);
}

const verifyUsers = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI is not set in environment or .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    if (args.includes('--all')) {
      const unverifiedUsers = await User.find({ isEmailVerified: false });
      if (unverifiedUsers.length === 0) {
        console.log('ℹ️  No unverified users found.');
        return;
      }

      console.log(`Found ${unverifiedUsers.length} unverified user(s):`);
      unverifiedUsers.forEach(u => console.log(` - ${u.firstName} ${u.lastName} (${u.email})`));

      const result = await User.updateMany(
        { isEmailVerified: false },
        {
          $set: { isEmailVerified: true },
          $unset: {
            emailVerificationToken: '',
            emailVerificationExpire: '',
            lastVerificationEmailSent: ''
          }
        }
      );

      console.log(`\n✅ Successfully verified ${result.modifiedCount} account(s).`);
    } else {
      const emails = args.map(e => e.toLowerCase().trim()).filter(Boolean);

      for (const email of emails) {
        const user = await User.findOne({ email });
        if (!user) {
          console.log(`⚠️  User with email [${email}] not found.`);
          continue;
        }

        if (user.isEmailVerified) {
          console.log(`ℹ️  User [${email}] is already verified.`);
          continue;
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        user.lastVerificationEmailSent = undefined;
        await user.save();

        console.log(`✅ Verified user: ${user.firstName} ${user.lastName} (${user.email})`);
      }
    }
  } catch (error) {
    console.error('❌ Error verifying users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

verifyUsers();
