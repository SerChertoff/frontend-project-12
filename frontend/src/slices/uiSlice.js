import { createSlice } from '@reduxjs/toolkit';
import { removeChannel, DEFAULT_CHANNEL_ID } from './channelsSlice';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentChannelId: DEFAULT_CHANNEL_ID,
    connectionStatus: 'connecting',
    modalAddChannel: false,
    modalRemoveChannel: false,
    modalRenameChannel: false,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    openAddChannelModal: (state) => {
      state.modalAddChannel = true;
    },
    closeAddChannelModal: (state) => {
      state.modalAddChannel = false;
    },
    openRemoveChannelModal: (state) => {
      state.modalRemoveChannel = true;
    },
    closeRemoveChannelModal: (state) => {
      state.modalRemoveChannel = false;
    },
    openRenameChannelModal: (state) => {
      state.modalRenameChannel = true;
    },
    closeRenameChannelModal: (state) => {
      state.modalRenameChannel = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      if (String(state.currentChannelId) === String(action.payload)) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
      }
    });
  },
});

export const {
  setCurrentChannelId,
  setConnectionStatus,
  openAddChannelModal,
  closeAddChannelModal,
  openRemoveChannelModal,
  closeRemoveChannelModal,
  openRenameChannelModal,
  closeRenameChannelModal,
} = uiSlice.actions;

export const selectCurrentChannelId = (state) => state.ui.currentChannelId;
export const selectConnectionStatus = (state) => state.ui.connectionStatus;
export const selectModalAddChannel = (state) => state.ui.modalAddChannel;
export const selectModalRemoveChannel = (state) => state.ui.modalRemoveChannel;
export const selectModalRenameChannel = (state) => state.ui.modalRenameChannel;

export default uiSlice.reducer;
