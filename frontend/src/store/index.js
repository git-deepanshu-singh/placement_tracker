import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice.js';
import driveReducer from './slices/driveSlice.js';
import analyticsReducer from './slices/analyticsSlice.js';
import notificationReducer from './slices/notificationSlice.js';
import uiReducer from './slices/uiSlice.js';
import userReducer from './slices/userSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drives: driveReducer,
    analytics: analyticsReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    users: userReducer,
  },
});
