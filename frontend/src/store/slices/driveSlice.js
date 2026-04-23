import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../lib/api.js';

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Request failed';

export const fetchDrives = createAsyncThunk('drives/fetchDrives', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/drives');
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createDrive = createAsyncThunk('drives/createDrive', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/drives', payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateDrive = createAsyncThunk('drives/updateDrive', async ({ driveId, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/drives/${driveId}`, payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteDrive = createAsyncThunk('drives/deleteDrive', async (driveId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/drives/${driveId}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const applyToDrive = createAsyncThunk('drives/applyToDrive', async ({ driveId, formPayload }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/drives/${driveId}/apply`, { formPayload });
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const toggleDriveRegistration = createAsyncThunk(
  'drives/toggleDriveRegistration',
  async ({ driveId, registrationEnabled }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/drives/${driveId}/toggle-registration`, { registrationEnabled });
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const driveSlice = createSlice({
  name: 'drives',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher((action) => action.type.startsWith('drives/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('drives/') && action.type.endsWith('/fulfilled'), (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addMatcher((action) => action.type.startsWith('drives/') && action.type.endsWith('/rejected'), (state) => {
        state.loading = false;
      });
  },
});

export default driveSlice.reducer;
