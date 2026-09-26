import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('propease_jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('propease_jwt_token');
      localStorage.removeItem('propease_user');
    }
    return Promise.reject(error);
  }
);

// ===================================================================
// 1. AUTHENTICATION SERVICES
// ===================================================================

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('propease_jwt_token', response.data.token);
      localStorage.setItem('propease_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('propease_jwt_token', response.data.token);
      localStorage.setItem('propease_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('propease_jwt_token');
    localStorage.removeItem('propease_user');
  },

  getToken: () => localStorage.getItem('propease_jwt_token'),
  getUser: () => {
    const userStr = localStorage.getItem('propease_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// ===================================================================
// 2. PROPERTY SERVICES
// ===================================================================

export const propertyService = {
  getAllProperties: async (page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get(`/properties?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  },

  searchProperties: async (filters = {}, page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') => {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
      ...filters
    });
    const response = await api.get(`/properties/search?${params.toString()}`);
    return response.data;
  },

  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  getAgentProperties: async (page = 0, size = 10) => {
    const response = await api.get(`/properties/agent/my?page=${page}&size=${size}`);
    return response.data;
  }
};

// ===================================================================
// 3. BOOKING SERVICES
// ===================================================================

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (page = 0, size = 10) => {
    const response = await api.get(`/bookings/my?page=${page}&size=${size}`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`);
    return response.data;
  },

  // Agent Endpoints
  getAgentBookings: async (status, page = 0, size = 10) => {
    const url = `/agent/bookings?page=${page}&size=${size}${status ? `&status=${status}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  confirmBooking: async (id) => {
    const response = await api.put(`/agent/bookings/${id}/confirm`);
    return response.data;
  },

  rejectBooking: async (id, reason) => {
    const response = await api.put(`/agent/bookings/${id}/reject${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`);
    return response.data;
  }
};

// ===================================================================
// 4. ADMIN SERVICES
// ===================================================================

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (role, page = 0, size = 15) => {
    const url = `/admin/users?page=${page}&size=${size}${role ? `&role=${role}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  updateUserStatus: async (id, active) => {
    const response = await api.put(`/admin/users/${id}/status`, { active });
    return response.data;
  },

  getAllBookings: async (page = 0, size = 15) => {
    const response = await api.get(`/admin/bookings?page=${page}&size=${size}`);
    return response.data;
  }
};

export default api;
