import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../lib/api.js';

export const fetchOverviewAnalytics = createAsyncThunk('analytics/fetchOverview', async () => {
  const { data } = await api.get('/analytics/overview');
  return data.data;
});

export const fetchStudentAnalytics = createAsyncThunk('analytics/fetchStudent', async () => {
  const { data } = await api.get('/analytics/student');
  return data.data;
});

export const fetchHistoricalAnalytics = createAsyncThunk('analytics/fetchHistorical', async () => {
  const { data } = await api.get('/analytics/historical');
  return data.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    overview: null,
    student: null,
    historical: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchHistoricalAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.historical = action.payload;
      })
      .addMatcher((action) => action.type.startsWith('analytics/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith('analytics/') && action.type.endsWith('/rejected'), (state) => {
        state.loading = false;
      });
  },
});

export default analyticsSlice.reducer;
