const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a project name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['Admin', 'Editor', 'Viewer'],
          default: 'Viewer',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
