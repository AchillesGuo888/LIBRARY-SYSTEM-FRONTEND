// src/utils/api.js
import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

// 创建带超时和基础URL配置的实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000, // 调整为15秒更合理
  withCredentials: true, // 如果需要跨域携带cookie
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 请求拦截器
api.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth?.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 添加请求时间戳防止缓存
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

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 统一处理成功响应格式
    if (response.data?.code !== 200 && response.data?.code) {
      return Promise.reject(response.data);
    }
    return response;
  },
  error => {
    // 统一错误处理
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.replace('/login?expired=true');
      }
    }

    // 处理其他状态码
    const errorMap = {
      400: '请求参数错误',
      403: '权限不足',
      404: '资源未找到',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };

    const finalMessage = errorMap[status] || message;
    error.message = finalMessage;

    return Promise.reject(error);
  }
);

// 封装常用方法
export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const put = (url, data) => api.put(url, data);
export const del = (url) => api.delete(url);

export default api;