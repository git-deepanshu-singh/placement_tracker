import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../lib/api.js';

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Request failed';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users');
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserStatus = createAsyncThunk('users/updateUserStatus', async ({ userId, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/users/${userId}/status`, { status });
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/users/${userId}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload._id);
      })
      .addMatcher((action) => action.type.startsWith('users/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('users/') && action.type.endsWith('/rejected'), (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
