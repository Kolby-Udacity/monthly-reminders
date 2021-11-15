import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export type ThemeMode = 'light' | 'dark';

export type ThemeState = {
  mode: ThemeMode;
};

const initialMode = 'light';

// Define the initial state using that type
const initialState: ThemeState = {
  mode: initialMode,
};

export const themeSlice = createSlice({
  name: 'theme',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    toggleThemeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleThemeMode } = themeSlice.actions;

export default themeSlice.reducer;
