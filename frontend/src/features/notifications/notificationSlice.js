import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
  notifications: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user notifications
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.getNotifications(token);
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

// Mark a notification as read
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.markAsRead(id, token);
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

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (notification) => notification._id === action.payload._id
        );
        if (index !== -1) {
          state.notifications[index].read = true;
        }
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
