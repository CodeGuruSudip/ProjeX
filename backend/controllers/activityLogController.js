const asyncHandler = require('express-async-handler');
const ActivityLog = require('../models/activityLogModel');

// @desc    Get activity logs for a project
// @route   GET /api/activity-logs/:projectId
// @access  Private
const getProjectActivityLogs = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (page - 1) * limit;
  
  const logs = await ActivityLog.find({ project: projectId })
    .populate('user', 'name email profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);
    
  const total = await ActivityLog.countDocuments({ project: projectId });
  
  res.status(200).json({
    logs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalLogs: total,
  });
});

// @desc    Get activity logs for the current user
// @route   GET /api/activity-logs/user/me
// @access  Private
const getUserActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (page - 1) * limit;
  
  const logs = await ActivityLog.find({ user: req.user.id })
    .populate('project', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(skip);
    
  const total = await ActivityLog.countDocuments({ user: req.user.id });
  
  res.status(200).json({
    logs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalLogs: total,
  });
});

// Helper function to create activity log
const createActivityLog = async (data) => {
  try {
    const log = await ActivityLog.create(data);
    return log;
  } catch (error) {
    console.error('Error creating activity log:', error);
    // Don't throw error to prevent disrupting main operations
    return null;
  }
};

// Activity log helper functions for different actions
const logProjectActivity = async (userId, projectId, action, details, metadata = {}, req = null) => {
  const logData = {
    user: userId,
    project: projectId,
    action,
    details,
    metadata,
  };
  
  if (req) {
    logData.ipAddress = req.ip || req.connection.remoteAddress;
    logData.userAgent = req.get('user-agent');
  }
  
  return createActivityLog(logData);
};

// Specific activity loggers
const logProjectCreated = async (userId, projectId, projectName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'project_created',
    `Created project "${projectName}"`,
    { projectName },
    req
  );
};

const logProjectUpdated = async (userId, projectId, changes, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'project_updated',
    `Updated project details`,
    { changes },
    req
  );
};

const logMemberAdded = async (userId, projectId, memberEmail, role, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'member_added',
    `Added ${memberEmail} as ${role}`,
    { memberEmail, role },
    req
  );
};

const logMemberRemoved = async (userId, projectId, memberEmail, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'member_removed',
    `Removed ${memberEmail} from project`,
    { memberEmail },
    req
  );
};

const logMemberRoleUpdated = async (userId, projectId, memberEmail, oldRole, newRole, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'member_role_updated',
    `Changed ${memberEmail}'s role from ${oldRole} to ${newRole}`,
    { memberEmail, oldRole, newRole },
    req
  );
};

const logTaskCreated = async (userId, projectId, taskName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'task_created',
    `Created task "${taskName}"`,
    { taskName },
    req
  );
};

const logTaskUpdated = async (userId, projectId, taskId, taskName, changes, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'task_updated',
    `Updated task "${taskName}"`,
    { taskId, taskName, changes },
    req
  );
};

const logTaskDeleted = async (userId, projectId, taskName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'task_deleted',
    `Deleted task "${taskName}"`,
    { taskName },
    req
  );
};

const logTaskStatusChanged = async (userId, projectId, taskId, taskName, oldStatus, newStatus, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'task_status_changed',
    `Changed status of "${taskName}" from ${oldStatus} to ${newStatus}`,
    { taskId, taskName, oldStatus, newStatus },
    req
  );
};

const logTaskAssigned = async (userId, projectId, taskId, taskName, assignedToName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'task_assigned',
    `Assigned "${taskName}" to ${assignedToName}`,
    { taskId, taskName, assignedToName },
    req
  );
};

const logCommentAdded = async (userId, projectId, taskId, taskName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'comment_added',
    `Added comment on task "${taskName}"`,
    { taskId, taskName },
    req
  );
};

const logFileUploaded = async (userId, projectId, taskId, taskName, fileName, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'file_uploaded',
    `Uploaded file "${fileName}" to task "${taskName}"`,
    { taskId, taskName, fileName },
    req
  );
};

const logTimeLogged = async (userId, projectId, taskId, taskName, timeInMinutes, req) => {
  return logProjectActivity(
    userId,
    projectId,
    'time_logged',
    `Logged ${timeInMinutes} minutes on task "${taskName}"`,
    { taskId, taskName, timeInMinutes },
    req
  );
};

module.exports = {
  getProjectActivityLogs,
  getUserActivityLogs,
  // Export helper functions for use in other controllers
  logProjectCreated,
  logProjectUpdated,
  logMemberAdded,
  logMemberRemoved,
  logMemberRoleUpdated,
  logTaskCreated,
  logTaskUpdated,
  logTaskDeleted,
  logTaskStatusChanged,
  logTaskAssigned,
  logCommentAdded,
  logFileUploaded,
  logTimeLogged,
};