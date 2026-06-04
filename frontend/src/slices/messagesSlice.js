import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';
import api from '../api';
import routes from '../routes';

const messagesAdapter = createEntityAdapter();

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await api.get(routes.messages());
    return response.data;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({
    loadingStatus: 'idle',
    error: null,
  }),
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        messagesAdapter.setAll(state, action.payload);
        state.loadingStatus = 'idle';
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(removeChannel, (state, action) => {
        const channelId = action.payload;
        const remainingMessages = Object.values(state.entities).filter(
          (message) => String(message.channelId) !== String(channelId),
        );
        messagesAdapter.setAll(state, remainingMessages);
      });
  },
});

export const messagesSelectors = messagesAdapter.getSelectors(
  (state) => state.messages,
);

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
