import axios from 'axios';

const getToken = () => {
  const stored = localStorage.getItem('userToken');

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
};

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
