const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/userModel');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const makeAdmin = async (email) => {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  await connectDB();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error('User not found.');
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Successfully made ${user.name} (${user.email}) an admin.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

// Get email from command line arguments
const email = process.argv[2];

makeAdmin(email);
