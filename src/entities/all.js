// Local API Entity Classes
const API_BASE = "/api"; // Use proxy to backend

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
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
      const data = await fetchWithAuth(`${API_BASE}/auth/me`);
      return data.data;
    } catch (error) {
      throw new Error('User not authenticated');
    }
  }

  static async updateMyUserData(userData) {
    try {
      const data = await fetchWithAuth(`${API_BASE}/auth/profile`, {
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
      const data = await fetchPublic(`${API_BASE}/pizza-bases`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch pizza bases:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 PizzaBase.update called:', { id, data });
      const response = await fetchWithAuth(`${API_BASE}/pizza-bases/${id}`, {
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
    return await fetchWithAuth(`${API_BASE}/pizza-bases`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`${API_BASE}/pizza-bases/${id}`, {
      method: 'DELETE'
    });
  }
}

// Sauce Entity
export class Sauce {
  static async list() {
    try {
      const data = await fetchPublic(`${API_BASE}/sauces`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch sauces:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Sauce.update called:', { id, data });
      const response = await fetchWithAuth(`${API_BASE}/sauces/${id}`, {
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
    return await fetchWithAuth(`${API_BASE}/sauces`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`${API_BASE}/sauces/${id}`, {
      method: 'DELETE'
    });
  }
}

// Cheese Entity
export class Cheese {
  static async list() {
    try {
      const data = await fetchPublic(`${API_BASE}/cheeses`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch cheeses:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Cheese.update called:', { id, data });
      const response = await fetchWithAuth(`${API_BASE}/cheeses/${id}`, {
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
    return await fetchWithAuth(`${API_BASE}/cheeses`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`${API_BASE}/cheeses/${id}`, {
      method: 'DELETE'
    });
  }
}

// Topping Entity
export class Topping {
  static async list() {
    try {
      const data = await fetchPublic(`${API_BASE}/toppings`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch toppings:', error);
      return [];
    }
  }

  static async update(id, data) {
    try {
      console.log('🔄 Topping.update called:', { id, data });
      const response = await fetchWithAuth(`${API_BASE}/toppings/${id}`, {
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
    return await fetchWithAuth(`${API_BASE}/toppings`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`${API_BASE}/toppings/${id}`, {
      method: 'DELETE'
    });
  }
}

// Order Entity
export class Order {
  static async list(sort = '', limit = null) {
    try {
      let url = `${API_BASE}/orders`;
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
      let url = `${API_BASE}/orders/admin/all`;
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
      const data = await fetchWithAuth(`${API_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return data.data;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id) {
    return await fetchWithAuth(`${API_BASE}/orders/${id}`, {
      method: 'DELETE'
    });
  }

  static async getById(id) {
    try {
      const data = await fetchWithAuth(`${API_BASE}/orders/${id}`);
      return data.data;
    } catch (error) {
      throw new Error('Failed to fetch order');
    }
  }
}
