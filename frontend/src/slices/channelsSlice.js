import axios from 'axios';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import routes from '../routes';

export const DEFAULT_CHANNEL_ID = '1';

const channelsAdapter = createEntityAdapter();

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get(routes.channels(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({
    loadingStatus: 'idle',
    error: null,
    channelToRemove: null,
    channelToRename: null,
  }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    setChannelToRemove: (state, action) => {
      state.channelToRemove = action.payload;
    },
    setChannelToRename: (state, action) => {
      state.channelToRename = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload);
        state.loadingStatus = 'idle';
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const channelsSelectors = channelsAdapter.getSelectors(
  (state) => state.channels,
);

export const {
  addChannel,
  removeChannel,
  renameChannel,
  setChannelToRemove,
  setChannelToRename,
} = channelsSlice.actions;

export const selectChannelToRemove = (state) => state.channels.channelToRemove;
export const selectChannelToRename = (state) => state.channels.channelToRename;

export default channelsSlice.reducer;
