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
      const data = await fetchWithAuth(`${API_BASE}/pizza-bases`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch pizza bases:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`${API_BASE}/pizza-bases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`${API_BASE}/sauces`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch sauces:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`${API_BASE}/sauces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`${API_BASE}/cheeses`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch cheeses:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`${API_BASE}/cheeses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`${API_BASE}/toppings`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch toppings:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`${API_BASE}/toppings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
  static async list() {
    try {
      const data = await fetchWithAuth(`${API_BASE}/orders`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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
