import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authservices = {
  register: async (userdata) => {
    const response = await api.post('/users/register', userdata);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};

export default api;
