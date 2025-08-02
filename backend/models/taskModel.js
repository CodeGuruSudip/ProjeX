const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a task name'],
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        text: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    timeTracked: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        time: { type: Number, required: true }, // in seconds
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
