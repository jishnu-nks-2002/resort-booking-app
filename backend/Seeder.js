const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@resort.com',
    password: 'admin123',
    phone: '+1234567890',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123',
    phone: '+1987654321',
    role: 'user',
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Booking.deleteMany();

    console.log('🗑️  Cleared existing data\n');

    // Create users ONE BY ONE to trigger password hashing
    console.log('🔨 Creating users...');
    
    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`✅ Created: ${user.email} (${user.role})`);
    }

    console.log('\n✅ Data Imported Successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@resort.com');
    console.log('   Password: admin123');
    console.log('\n📧 Test User Credentials:');
    console.log('   Email: user@test.com');
    console.log('   Password: user123');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Booking.deleteMany();

    console.log('✅ Data Destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}