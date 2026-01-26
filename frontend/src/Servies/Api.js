import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL='http://localhost:5000/api/users';


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authservices = {
  register: async (userdata) => {
    const response = await api.post('/register', userdata);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

export default api;
