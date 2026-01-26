// Import API configuration
import { apiRequest } from '../services/api';

// Helper function for authenticated requests (deprecated - using apiRequest instead)
const fetchWithAuth = async (endpoint, options = {}) => {
  return await apiRequest(endpoint, options);
};

export class User {
  static async me() {
    try {
      const data = await apiRequest('/auth/me');
      return data.data.user;
    } catch (error) {
      throw new Error('User not authenticated');
    }
  }

  static async updateMyUserData(userData) {
    try {
      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: userData
      });
      return data.data.user;
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  }
  }
}
