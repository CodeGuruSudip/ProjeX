import axios from 'axios';

const API_URL = '/api/projects/';

// Create new project
const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, projectData, config);

  return response.data;
};

// Get user projects
const getProjects = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

// Delete user project
const deleteProject = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + projectId, config);

  return response.data;
};

// Add member to project
const addMember = async (memberData, token) => {
  const { projectId, email, role } = memberData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}${projectId}/members`,
    { email, role },
    config
  );
  return response.data;
};

// Remove member from project
const removeMember = async (memberData, token) => {
  const { projectId, userId } = memberData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { userId },
  };
  const response = await axios.delete(`${API_URL}${projectId}/members`, config);
  return response.data;
};

// Update member role
const updateMemberRole = async (memberData, token) => {
  const { projectId, userId, role } = memberData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${API_URL}${projectId}/members`,
    { userId, role },
    config
  );
  return response.data;
};

const projectService = {
  createProject,
  getProjects,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
};

export default projectService;
