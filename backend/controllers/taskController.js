const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const Notification = require('../models/notificationModel');

// @desc    Get tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('comments.user', 'name')
    .populate('timeTracked.user', 'name');
  res.status(200).json(tasks);
});

// @desc    Set task for a project
// @route   POST /api/tasks/:projectId
// @access  Private
const setTask = asyncHandler(async (req, res) => {
  const { name, description, status, priority, dueDate, assignedTo } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add a task name');
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = await Task.create({
    project: req.params.projectId,
    user: req.user.id,
    name,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
  });

  // Create a notification if the task is assigned to someone
  if (task.assignedTo) {
    await Notification.create({
      user: task.assignedTo,
      message: `You have been assigned to the task '${task.name}'`,
      link: `/project/${task.project}`,
    });
  }

  res.status(201).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user is part of the project
  const project = await Project.findById(task.project);
  if (!project.members.includes(req.user.id)) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Create a notification if the task is assigned to someone new
  if (updatedTask.assignedTo && updatedTask.assignedTo.toString() !== (task.assignedTo ? task.assignedTo.toString() : null)) {
    await Notification.create({
      user: updatedTask.assignedTo,
      message: `You have been assigned to the task '${updatedTask.name}'`,
      link: `/project/${updatedTask.project}`,
    });
  }

  res.status(200).json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user is part of the project
  const project = await Project.findById(task.project);
  if (!project.members.includes(req.user.id)) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Add comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = {
    text: req.body.text,
    user: req.user.id,
  };

  task.comments.push(comment);

  await task.save();

  const updatedTask = await Task.findById(req.params.id).populate(
    'comments.user',
    'name'
  );

  res.status(201).json(updatedTask.comments);
});

// @desc    Upload attachment to a task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const uploadAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.file) {
    const attachment = {
      filename: req.file.filename,
      path: req.file.path,
    };

    task.attachments.push(attachment);
    await task.save();

    res.status(201).json(task.attachments);
  } else {
    res.status(400);
    throw new Error('Please upload a file');
  }
});

// @desc    Log time for a task
// @route   POST /api/tasks/:id/log-time
// @access  Private
const logTime = asyncHandler(async (req, res) => {
  const { time } = req.body; // time in seconds
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const timeEntry = {
    user: req.user.id,
    time: Number(time),
  };

  task.timeTracked.push(timeEntry);
  await task.save();

  const updatedTask = await Task.findById(req.params.id).populate(
    'timeTracked.user',
    'name'
  );

  res.status(201).json(updatedTask.timeTracked);
});

// @desc    Get all tasks for the logged in user across all projects
// @route   GET /api/tasks/mytasks
// @access  Private
const getMyTasks = asyncHandler(async (req, res) => {
  // Find all projects where the user is a member
  const projects = await Project.find({ 'members.user': req.user.id });
  const projectIds = projects.map(project => project._id);

  // Find all tasks in those projects
  const tasks = await Task.find({ project: { $in: projectIds } }).populate('project', 'name');

  res.status(200).json(tasks);
});

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
  logTime,
  getMyTasks,
};
