import axios from 'axios';

const API_URL = '/api/tasks/';

// Get all tasks for the logged in user
const getMyTasks = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'mytasks', config);

  return response.data;
};

// Create new task
const createTask = async (projectId, taskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + projectId, taskData, config);

  return response.data;
};

// Get project tasks
const getTasks = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + projectId, config);

  return response.data;
};

// Update task
const updateTask = async (taskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + taskData._id, taskData, config);

  return response.data;
};

// Add comment to a task
const addComment = async (commentData, token) => {
  const { taskId, text } = commentData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${taskId}/comments`,
    { text },
    config
  );

  return response.data;
};

// Upload attachment to a task
const uploadAttachment = async (attachmentData, token) => {
  const { taskId, file } = attachmentData;
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${taskId}/attachments`,
    formData,
    config
  );

  return response.data;
};

// Log time for a task
const logTime = async (timeData, token) => {
  const { taskId, time } = timeData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${taskId}/log-time`,
    { time },
    config
  );

  return response.data;
};

const taskService = {
  getMyTasks,
  createTask,
  getTasks,
  updateTask,
  addComment,
  uploadAttachment,
  logTime,
};

export default taskService;
