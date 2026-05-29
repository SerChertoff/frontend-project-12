import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const stored = localStorage.getItem('userToken');

  if (!stored) {
    return { username: null, token: null };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { username: null, token: null };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, { payload: { username, token } }) => {
      state.username = username;
      state.token = token;
      localStorage.setItem('userToken', JSON.stringify({ username, token }));
    },
    removeCredentials: (state) => {
      state.username = null;
      state.token = null;
      localStorage.removeItem('userToken');
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
