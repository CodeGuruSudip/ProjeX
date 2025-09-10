const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'project_created',
        'project_updated',
        'project_deleted',
        'member_added',
        'member_removed',
        'member_role_updated',
        'task_created',
        'task_updated',
        'task_deleted',
        'task_status_changed',
        'task_assigned',
        'comment_added',
        'file_uploaded',
        'time_logged',
      ],
    },
    details: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);