// Order Entity
const API_BASE = "https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6";
const API_KEY = "5cee5299004742998d9425143f63ec8e";

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
