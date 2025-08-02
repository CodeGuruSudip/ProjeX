import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

// Get all tasks for the logged in user
export const getMyTasks = createAsyncThunk(
  'tasks/getMyTasks',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.getMyTasks(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  tasks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new task
export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, taskData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.createTask(projectId, taskData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project tasks
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.getTasks(projectId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.updateTask(taskData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add comment to a task
export const addComment = createAsyncThunk(
  'tasks/addComment',
  async (commentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.addComment(commentData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload attachment to a task
// Log time for a task
export const logTime = createAsyncThunk(
  'tasks/logTime',
  async (timeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.logTime(timeData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'tasks/uploadAttachment',
  async (attachmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await taskService.uploadAttachment(attachmentData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const task = state.tasks.find((task) => task._id === action.meta.arg.taskId);
        if (task) {
          task.comments = action.payload;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadAttachment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const task = state.tasks.find((task) => task._id === action.meta.arg.taskId);
        if (task) {
          task.attachments = action.payload;
        }
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const task = state.tasks.find((task) => task._id === action.meta.arg.taskId);
        if (task) {
          task.timeTracked = action.payload;
        }
      })
      .addCase(logTime.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
