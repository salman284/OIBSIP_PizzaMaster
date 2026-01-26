// Import API configuration
import { apiRequest } from '../services/api';

// Helper function for authenticated requests (deprecated - using apiRequest instead)
const fetchWithAuth = async (endpoint, options = {}) => {
  return await apiRequest(endpoint, options);
};

export class Order {
  static async list() {
    try {
      const result = await apiRequest('/orders', {
        method: 'GET'
      });
      
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
      const result = await apiRequest('/orders', {
        method: 'POST',
        body: orderData
      });
      
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const result = await apiRequest(`/orders/${id}`, {
        method: 'PUT',
        body: data
      });
      
      return result;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await apiRequest(`/orders/${id}`, {
        method: 'GET'
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  static async filter(filters = {}, sort = '-created_date', limit = 10) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      if (sort) queryParams.append('sort', sort);
      if (limit) queryParams.append('limit', limit);
      
      const result = await apiRequest(`/orders?${queryParams.toString()}`, {
        method: 'GET'
      });
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return result.orders || result || [];
    } catch (error) {
      console.error('Error filtering orders:', error);
      return [];
    }
  }
}
