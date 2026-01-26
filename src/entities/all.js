// Import API configuration
import { apiRequest } from '../services/api';

// Helper function for authenticated requests (deprecated - using apiRequest instead)
const fetchWithAuth = async (endpoint, options = {}) => {
  return await apiRequest(endpoint, options);
};

// Helper function for public requests (same as fetchWithAuth since apiRequest handles both)
const fetchPublic = async (endpoint, options = {}) => {
  return await apiRequest(endpoint, options);
};

// Helper function for public requests (no authentication required)
const fetchPublic = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return await response.json();
};

// User Entity
export class User {
  static async me() {
    try {
      console.log('🔐 User.me called');
      const response = await fetchWithAuth(`/auth/me`);
      console.log('👤 User.me raw response:', response);
      
      // Handle nested user object structure - the user data is in response.user
      const userData = response.user || response.data?.user || response.data || response;
      console.log('✅ User.me processed data:', userData);
      return userData;
    } catch (error) {
      console.error('❌ User.me error:', error);
      throw new Error('User not authenticated');
    }
  }

  static async updateMyUserData(userData) {
    try {
      const data = await fetchWithAuth(`/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return data.data;
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  }
}

// PizzaBase Entity
export class PizzaBase {
  static async list() {
    try {
      const data = await fetchPublic(`/pizza-bases`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch pizza bases:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 PizzaBase.update called:', { id, data });
      const response = await fetchWithAuth(`/pizza-bases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ PizzaBase.update response:', response);
      return response;
    } catch (error) {
      console.error('❌ PizzaBase.update error:', error);
      throw error;
    }
  }

  static async create(data) {
    return await fetchWithAuth(`/pizza-bases`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`/pizza-bases/${id}`, {
      method: 'DELETE'
    });
  }
}

// Sauce Entity
export class Sauce {
  static async list() {
    try {
      const data = await fetchPublic(`/sauces`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch sauces:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Sauce.update called:', { id, data });
      const response = await fetchWithAuth(`/sauces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Sauce.update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Sauce.update error:', error);
      throw error;
    }
  }

  static async create(data) {
    return await fetchWithAuth(`/sauces`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`/sauces/${id}`, {
      method: 'DELETE'
    });
  }
}

// Cheese Entity
export class Cheese {
  static async list() {
    try {
      const data = await fetchPublic(`/cheeses`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch cheeses:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Cheese.update called:', { id, data });
      const response = await fetchWithAuth(`/cheeses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Cheese.update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Cheese.update error:', error);
      throw error;
    }
  }

  static async create(data) {
    return await fetchWithAuth(`/cheeses`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`/cheeses/${id}`, {
      method: 'DELETE'
    });
  }
}

// Topping Entity
export class Topping {
  static async list() {
    try {
      const data = await fetchPublic(`/toppings`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch toppings:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Topping.update called:', { id, data });
      const response = await fetchWithAuth(`/toppings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Topping.update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Topping.update error:', error);
      throw error;
    }
  }

  static async create(data) {
    return await fetchWithAuth(`/toppings`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`/toppings/${id}`, {
      method: 'DELETE'
    });
  }
}

// Order Entity
export class Order {
  static async list(sort = '', limit = null) {
    try {
      let url = `/orders`;
      const params = new URLSearchParams();
      
      if (sort) {
        params.append('sort', sort);
      }
      if (limit) {
        params.append('limit', limit);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const data = await fetchWithAuth(url);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  }

  static async listAll(limit = null) {
    try {
      let url = `/orders/admin/all`;
      const params = new URLSearchParams();
      
      if (limit) {
        params.append('limit', limit);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetchWithAuth(url);
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      return [];
    }
  }

  static async create(orderData) {
    try {
      const data = await fetchWithAuth(`/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return data.data;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Order.update called:', { id, data });
      
      // Use the correct endpoint for status updates
      const endpoint = data.status ? `/orders/${id}/status` : `/orders/${id}`;
      console.log('🎯 Using endpoint:', endpoint);
      
      const response = await fetchWithAuth(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log('✅ Order.update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Order.update error:', error);
      throw error;
    }
  }

  static async delete(id) {
    return await fetchWithAuth(`/orders/${id}`, {
      method: 'DELETE'
    });
  }

  static async getById(id) {
    try {
      const data = await fetchWithAuth(`/orders/${id}`);
      return data.data;
    } catch (error) {
      throw new Error('Failed to fetch order');
    }
  }
}
