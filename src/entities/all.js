// Base44 Entity Classes
const API_BASE = "https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6";
const API_KEY = "5cee5299004742998d9425143f63ec8e";

// User Entity
export class User {
  static async me() {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Not authenticated');
      return await response.json();
    } catch (error) {
      throw new Error('User not authenticated');
    }
  }

  static async updateMyUserData(data) {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// PizzaBase Entity
export class PizzaBase {
  static async list() {
    const response = await fetch(`${API_BASE}/entities/PizzaBase`, {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${API_BASE}/entities/PizzaBase/${id}`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// Sauce Entity
export class Sauce {
  static async list() {
    const response = await fetch(`${API_BASE}/entities/Sauce`, {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${API_BASE}/entities/Sauce/${id}`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// Cheese Entity
export class Cheese {
  static async list() {
    const response = await fetch(`${API_BASE}/entities/Cheese`, {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${API_BASE}/entities/Cheese/${id}`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// Topping Entity
export class Topping {
  static async list() {
    const response = await fetch(`${API_BASE}/entities/Topping`, {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${API_BASE}/entities/Topping/${id}`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

// Order Entity
export class Order {
  static async list() {
    const response = await fetch(`${API_BASE}/entities/Order`, {
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  static async create(data) {
    const response = await fetch(`${API_BASE}/entities/Order`, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${API_BASE}/entities/Order/${id}`, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}
