
import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});


api.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth?.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  

  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now()
    };
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  response => {

    if (response.data?.code !== 200 && response.data?.code) {
      return Promise.reject(response.data);
    }
    return response;
  },
  error => {

    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.replace('/login?expired=true');
      }
    }


    const errorMap = {
      400: 'Invalid request parameters',
      403: 'Insufficient permissions',
      404: 'Resource not found',
      500: 'Internal server error',
      502: 'Bad Gateway',
      503: 'Service unavailable',
      504: 'Gateway timeout'
    };

    const finalMessage = errorMap[status] || message;
    error.message = finalMessage;

    return Promise.reject(error);
  }
);


export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const put = (url, data) => api.put(url, data);
export const del = (url) => api.delete(url);

export default api;