const express = require('express');
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
  logTime,
  getMyTasks,
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// FIX: Place /mytasks route before /:projectId to avoid route collision
router.route('/mytasks').get(protect, getMyTasks);

router.route('/:projectId').get(protect, getTasks).post(protect, setTask);
router.route('/:id').delete(protect, deleteTask).put(protect, updateTask);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/attachments').post(protect, upload, uploadAttachment);
router.route('/:id/log-time').post(protect, logTime);

module.exports = router;
