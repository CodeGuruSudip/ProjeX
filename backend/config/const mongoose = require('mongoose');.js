const mongoose = require('mongoose');

const testDatabaseConnection = async () => {
  try {
    // Replace with your actual MongoDB connection string
    await mongoose.connect('mongodb://localhost:27017/projex', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Test the connection
testDatabaseConnection()
  .then(result => {
    if (!result) process.exit(1);
  });

module.exports = testDatabaseConnection;
