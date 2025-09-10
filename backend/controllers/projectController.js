const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const {
  logProjectCreated,
  logProjectUpdated,
  logMemberAdded,
  logMemberRemoved,
  logMemberRoleUpdated,
} = require('./activityLogController');

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user.id }).populate(
    'members.user',
    'name email'
  );
  res.status(200).json(projects);
});

// @desc    Set project
// @route   POST /api/projects
// @access  Private
const setProject = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error('Please add a name field');
  }

  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'Admin' }],
  });

  // Log project creation activity
  await logProjectCreated(req.user.id, project._id, project.name, req);

  res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user is the owner of the project
  if (project.owner.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Log the project update activity
  await logProjectUpdated(req.user.id, req.params.id, req.body, req);

  res.status(200).json(updatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user is the owner of the project
  if (project.owner.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await project.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private (Admin)
const addProjectMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const project = await Project.findById(req.params.id);
  project.members.push({ user: user._id, role });
  await project.save();

  // Create a notification for the new member
  await Notification.create({
    user: user._id,
    message: `You have been added to the project '${project.name}'`,
    link: `/project/${project._id}`,
  });

  // Log member addition activity
  await logMemberAdded(req.user.id, project._id, email, role, req);

  res.status(200).json(project.members);
});

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members
// @access  Private (Admin)
const removeProjectMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);
  project.members = project.members.filter(
    (member) => member.user.toString() !== userId
  );
  await project.save();

  res.status(200).json(project.members);
});

// @desc    Update a member's role in a project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin)
const updateMemberRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.id);
  const member = project.members.find(
    (member) => member.user.toString() === userId
  );

  if (member) {
    const oldRole = member.role;
    member.role = role;
    await project.save();

    // Log member role update activity
    await logMemberRoleUpdated(req.user.id, project._id, user.email, oldRole, role, req);

    res.status(200).json(project.members);
  } else {
    res.status(404);
    throw new Error('Member not found in project');
  }
});

module.exports = {
  getProjects,
  setProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
};
