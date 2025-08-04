const express = require('express');
const cors = require('cors');
const colors = require('colors');
const path = require('path');
const { connectDB } = require('./backend/config/db');
const { errorHandler } = require('./backend/middleware/errorMiddleware');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Database connection with retry logic
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return;
  }

  try {
    // Close any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = connection;
    console.log('New database connection established');
    
    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedDb = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedDb = null;
    });

    return cachedDb;
  } catch (error) {
    console.error('Database connection error:', error);
    cachedDb = null;
    throw error;
  }
};

// Connect to database
connectToDatabase();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/users', require('./backend/routes/userRoutes'));
app.use('/api/projects', require('./backend/routes/projectRoutes'));
app.use('/api/tasks', require('./backend/routes/taskRoutes'));
app.use('/api/notifications', require('./backend/routes/notificationRoutes'));

// CORS configuration
app.use(cors({
  origin: ['https://proje-x-psi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnection: isConnected });
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', async function(req, res, next) {
    try {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    } catch (error) {
      next(error);
    }
  });
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

// Error handler must be after all routes
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for serverless deployment
module.exports = app;
