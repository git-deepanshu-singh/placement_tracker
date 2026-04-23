import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../lib/api.js';

const storedToken = localStorage.getItem('placement_tracker_token');
const storedUser = localStorage.getItem('placement_tracker_user');

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Request failed';

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/forgot-password', payload);
    return data.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/reset-password', payload);
    return data.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('placement_tracker_token');

  if (!token) {
    return rejectWithValue('No active session');
  }

  try {
    const { data } = await api.get('/auth/me');
    return { token, user: data.data };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch('/auth/me', payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('placement_tracker_token');
      localStorage.removeItem('placement_tracker_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('placement_tracker_user', JSON.stringify(action.payload));
      })
      .addCase(loadSession.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = null;
        localStorage.removeItem('placement_tracker_token');
        localStorage.removeItem('placement_tracker_user');
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected') && action.type !== 'auth/loadSession/rejected', (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Request failed';
      })
      .addMatcher((action) => ['auth/loginUser/fulfilled', 'auth/registerUser/fulfilled', 'auth/loadSession/fulfilled'].includes(action.type), (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('placement_tracker_token', action.payload.token);
        localStorage.setItem('placement_tracker_user', JSON.stringify(action.payload.user));
      })
      .addMatcher((action) => ['auth/forgotPassword/fulfilled', 'auth/resetPassword/fulfilled'].includes(action.type), (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
