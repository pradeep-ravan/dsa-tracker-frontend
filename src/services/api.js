import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile')
};

export const topicAPI = {
  getAll: () => api.get('/topics'),
  getById: (id) => api.get(`/topics/${id}`),
  create: (topicData) => api.post('/topics', topicData)
};

export const problemAPI = {
  getAll: () => api.get('/problems'),
  getById: (id) => api.get(`/problems/${id}`),
  getByTopic: (topicId) => api.get(`/problems/topic/${topicId}`),
  create: (problemData) => api.post('/problems', problemData)
};

export const progressAPI = {
  getAll: () => api.get('/progress'),
  toggleStatus: (problemId) => api.post('/progress/toggle', { problemId }),
  getByTopic: (topicId) => api.get(`/progress/topic/${topicId}`)
};

export default api;