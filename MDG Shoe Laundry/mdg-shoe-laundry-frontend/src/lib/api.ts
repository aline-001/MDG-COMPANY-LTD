import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('📤 Request to:', config.url, 'Token present:', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✓ Auth header added');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
    });
    
    // If 401 Unauthorized, clear auth and redirect to login
    if (error.response?.status === 401) {
      console.warn('🔑 Unauthorized - clearing auth');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;