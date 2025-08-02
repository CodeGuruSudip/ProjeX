const express = require('express');
const cors = require('cors');
const colors = require('colors');
const path = require('path');
const { connectDB } = require('./backend/config/db');
const { errorHandler } = require('./backend/middleware/errorMiddleware');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

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

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('API is running...'));
}

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
