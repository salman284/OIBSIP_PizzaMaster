// Local API User Entity
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

export class User {
  static async me() {
    try {
      const data = await fetchWithAuth(`${API_BASE}/auth/me`);
      return data.data.user;
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
      return data.data.user;
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  }
}
