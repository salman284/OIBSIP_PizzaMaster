// Base44 User Entity
const API_BASE = "https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6";
const API_KEY = "5cee5299004742998d9425143f63ec8e";

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
