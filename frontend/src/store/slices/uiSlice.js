import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('placement_tracker_theme');
const initialTheme = savedTheme === 'miet-dark' ? 'miet-dark' : 'miet-light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: initialTheme,
    flashMessage: null,
  },
  reducers: {
    setTheme(state, action) {
      const nextTheme = action.payload === 'miet-dark' ? 'miet-dark' : 'miet-light';
      state.theme = nextTheme;
      localStorage.setItem('placement_tracker_theme', nextTheme);
    },
    showFlashMessage(state, action) {
      state.flashMessage = {
        type: action.payload?.type || 'success',
        text: action.payload?.text || '',
      };
    },
    clearFlashMessage(state) {
      state.flashMessage = null;
    },
  },
});

export const { setTheme, showFlashMessage, clearFlashMessage } = uiSlice.actions;
export default uiSlice.reducer;
