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
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
