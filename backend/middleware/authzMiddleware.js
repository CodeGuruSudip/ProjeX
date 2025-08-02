const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');

const isProjectAdmin = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.user.id
  );

  if (member && member.role === 'Admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('User not authorized to perform this action');
  }
});

module.exports = { isProjectAdmin };
