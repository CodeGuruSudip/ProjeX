const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// MongoDB connection for serverless
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
};

// Wrap route handlers with DB connection
const withDB = fn => async (req, res, next) => {
  try {
    await connectDB();
    await fn(req, res, next);
  } catch (error) {
    console.error('Route error:', error);
    next(error);
  }
};

// API Routes
app.use('/api/users', require('../backend/routes/userRoutes'));
app.use('/api/projects', require('../backend/routes/projectRoutes'));
app.use('/api/tasks', require('../backend/routes/taskRoutes'));
app.use('/api/notifications', require('../backend/routes/notificationRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? '🚫' : err.message
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    }
  });
}

module.exports = app;
