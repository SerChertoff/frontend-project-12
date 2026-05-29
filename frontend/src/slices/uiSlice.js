import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentChannelId: '1',
    connectionStatus: 'connecting',
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const { setCurrentChannelId, setConnectionStatus } = uiSlice.actions;
export const selectCurrentChannelId = (state) => state.ui.currentChannelId;
export const selectConnectionStatus = (state) => state.ui.connectionStatus;
export default uiSlice.reducer;
