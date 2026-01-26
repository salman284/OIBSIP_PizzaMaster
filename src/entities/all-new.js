// Import API configuration
import { apiRequest } from '../services/api';

// Helper function for authenticated requests (deprecated - using apiRequest instead)
const fetchWithAuth = async (endpoint, options = {}) => {
  return await apiRequest(endpoint, options);
};

// User Entity
export class User {
  static async me() {
    try {
      const data = await fetchWithAuth(`/auth/me`);
      return data.data;
    } catch (error) {
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
      const data = await fetchWithAuth(`/pizza-bases`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch pizza bases:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`/pizza-bases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`/sauces`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch sauces:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`/sauces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`/cheeses`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch cheeses:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`/cheeses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
      const data = await fetchWithAuth(`/toppings`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch toppings:', error);
      return [];
    }
  }

  static async update(id, data) {
    return await fetchWithAuth(`/toppings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
  static async list() {
    try {
      const data = await fetchWithAuth(`/orders`);
      return data.data || data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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
    return await fetchWithAuth(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
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
