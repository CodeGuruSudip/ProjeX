const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Update user profile (bio and/or profile picture)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bio } = req.body;
  let profilePicture;

  if (req.file) {
    // Save the path to the uploaded file
    profilePicture = `/uploads/${req.file.filename}`;
  }

  const updateFields = {};
  if (bio !== undefined) updateFields.bio = bio;
  if (profilePicture) updateFields.profilePicture = profilePicture;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select('-password');

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(updatedUser);
});

module.exports = {
  updateProfile,
};
