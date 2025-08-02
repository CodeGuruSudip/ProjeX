const express = require('express');
const router = express.Router();
const {
  getProjects,
  setProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');
const { isProjectAdmin } = require('../middleware/authzMiddleware');

router.route('/').get(protect, getProjects).post(protect, setProject);

router
  .route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router
  .route('/:id/members')
  .post(protect, isProjectAdmin, addProjectMember)
  .delete(protect, isProjectAdmin, removeProjectMember)
  .put(protect, isProjectAdmin, updateMemberRole);

module.exports = router;
