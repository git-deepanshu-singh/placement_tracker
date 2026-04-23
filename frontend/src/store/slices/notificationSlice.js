import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../lib/api.js';

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Request failed';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const sendNotification = createAsyncThunk('notifications/sendNotification', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/notifications', payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    pushNotification(state, action) {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addMatcher((action) => action.type.startsWith('notifications/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('notifications/') && action.type.endsWith('/rejected'), (state) => {
        state.loading = false;
      });
  },
});

export const { pushNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
