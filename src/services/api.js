// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pizzamaster-5tlx.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  console.log('🌐 API Request:', { url, options });

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  console.log('🌐 API Config:', config);

  try {
    console.log('🌐 Making fetch request to:', url);
    const response = await fetch(url, config);
    console.log('🌐 API Response Status:', response.status);
    console.log('🌐 API Response Headers:', response.headers);
    
    if (!response.ok) {
      console.error('🚨 Response not OK:', response.status, response.statusText);
    }
    
    const data = await response.json();
    console.log('🌐 API Response Data:', data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('🚨 API Request Error Details:', {
      message: error.message,
      stack: error.stack,
      url: url,
      config: config
    });
    
    // Check if it's a network error
    if (error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
};

// Export the apiRequest function for direct use
export { apiRequest };

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: () => apiRequest('/auth/me'),

  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: userData,
  }),

  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: passwordData,
  }),

  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  }),

  resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, {
    method: 'PUT',
    body: { password },
  }),

  verifyEmail: (token) => apiRequest(`/auth/verify-email/${token}`),
};

// Pizza Ingredients API
export const ingredientsAPI = {
  // Pizza Bases
  getPizzaBases: () => apiRequest('/pizza-bases'),
  getPizzaBase: (id) => apiRequest(`/pizza-bases/${id}`),
  createPizzaBase: (data) => apiRequest('/pizza-bases', {
    method: 'POST',
    body: data,
  }),
  updatePizzaBase: (id, data) => apiRequest(`/pizza-bases/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deletePizzaBase: (id) => apiRequest(`/pizza-bases/${id}`, {
    method: 'DELETE',
  }),

  // Sauces
  getSauces: () => apiRequest('/sauces'),
  getSauce: (id) => apiRequest(`/sauces/${id}`),
  createSauce: (data) => apiRequest('/sauces', {
    method: 'POST',
    body: data,
  }),
  updateSauce: (id, data) => apiRequest(`/sauces/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteSauce: (id) => apiRequest(`/sauces/${id}`, {
    method: 'DELETE',
  }),

  // Cheeses
  getCheeses: () => apiRequest('/cheeses'),
  getCheese: (id) => apiRequest(`/cheeses/${id}`),
  createCheese: (data) => apiRequest('/cheeses', {
    method: 'POST',
    body: data,
  }),
  updateCheese: (id, data) => apiRequest(`/cheeses/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteCheese: (id) => apiRequest(`/cheeses/${id}`, {
    method: 'DELETE',
  }),

  // Toppings
  getToppings: () => apiRequest('/toppings'),
  getTopping: (id) => apiRequest(`/toppings/${id}`),
  getToppingsByCategory: (category) => apiRequest(`/toppings/category/${category}`),
  createTopping: (data) => apiRequest('/toppings', {
    method: 'POST',
    body: data,
  }),
  updateTopping: (id, data) => apiRequest(`/toppings/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteTopping: (id) => apiRequest(`/toppings/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: orderData,
  }),

  getUserOrders: () => apiRequest('/orders'),

  getOrder: (id) => apiRequest(`/orders/${id}`),

  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  },

  updateOrderStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: { status },
  }),

  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, {
    method: 'PUT',
  }),
};

// Inventory API
export const inventoryAPI = {
  getDashboard: () => apiRequest('/inventory/dashboard'),

  getAllItems: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/inventory/items${queryString ? `?${queryString}` : ''}`);
  },

  sendLowStockAlert: (threshold) => apiRequest('/inventory/low-stock-alert', {
    method: 'POST',
    body: { threshold },
  }),

  bulkUpdateStock: (updates) => apiRequest('/inventory/bulk-update', {
    method: 'PUT',
    body: { updates },
  }),

  updateStock: (itemType, id, quantity, operation) => {
    const endpoint = itemType === 'Pizza Base' ? 'pizza-bases' :
                    itemType === 'Sauce' ? 'sauces' :
                    itemType === 'Cheese' ? 'cheeses' : 'toppings';
    
    return apiRequest(`/${endpoint}/${id}/stock`, {
      method: 'PUT',
      body: { quantity, operation },
    });
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getUser: (id) => apiRequest(`/users/${id}`),

  updateUserRole: (id, role) => apiRequest(`/users/${id}/role`, {
    method: 'PUT',
    body: { role },
  }),

  deleteUser: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),

  getUserStats: () => apiRequest('/users/stats'),
};

// Local Storage Helpers
export const storageAPI = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('user'),

  setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  removeCart: () => localStorage.removeItem('cart'),
};

export default {
  auth: authAPI,
  ingredients: ingredientsAPI,
  orders: ordersAPI,
  inventory: inventoryAPI,
  users: usersAPI,
  storage: storageAPI,
};
