const express = require('express');
const router = express.Router();
const {
  getProjectActivityLogs,
  getUserActivityLogs,
} = require('../controllers/activityLogController');
const { protect } = require('../middleware/authMiddleware');

// Get activity logs for a specific project
router.get('/project/:projectId', protect, getProjectActivityLogs);

// Get activity logs for the current user
router.get('/user/me', protect, getUserActivityLogs);

module.exports = router;