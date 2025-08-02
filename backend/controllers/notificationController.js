const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json(notification);
});

module.exports = { getNotifications, markAsRead };
