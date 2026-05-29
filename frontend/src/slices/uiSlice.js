import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentChannelId: '1',
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
});

export const { setCurrentChannelId } = uiSlice.actions;
export const selectCurrentChannelId = (state) => state.ui.currentChannelId;
export default uiSlice.reducer;
