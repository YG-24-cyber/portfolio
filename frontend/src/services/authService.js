import apiClient from './apiClient.js';

export const authService = {
  /**
   * Authenticate administrator via username or email
   * @param {string} identifier - Username or Email
   * @param {string} password - Master password
   * @returns {Promise<{ token: string, admin: object }>}
   */
  login: async (identifier, password) => {
    const response = await apiClient.post('/auth/login', {
      identifier,
      password,
    });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Verify authenticated session & fetch administrator profile
   * @returns {Promise<{ admin: object }>}
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Update master credentials or administrator profile
   * @param {object} payload - { currentPassword, newPassword, displayName, email }
   * @returns {Promise<{ admin: object }>}
   */
  updateCredentials: async (payload) => {
    const response = await apiClient.put('/auth/update-credentials', payload);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Clear local session storage
   */
  logout: () => {
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_user');
  },
};

export default authService;
