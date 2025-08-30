// Local API Order Entity
const API_BASE = "/api"; // Use proxy to backend

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export class Order {
  static async list() {
    try {
      const response = await fetchWithAuth(`${API_BASE}/orders`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Order.list response:", result); // Debug log
      
      // Handle the backend response format: { success: true, count: X, data: [...] }
      if (result.success && result.data) {
        return result.data;
      }
      
      // Fallback for other response formats
      return result.orders || result || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async create(orderData) {
    try {
      const response = await fetchWithAuth(`${API_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await fetchWithAuth(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const response = await fetchWithAuth(`${API_BASE}/orders/${id}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
