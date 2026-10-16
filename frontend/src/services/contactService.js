import apiClient from './apiClient.js';

export const contactService = {
  /**
   * Submit an inbound public message inquiry
   * @param {object} data - { name, email, topic, message }
   * @returns {Promise<{ id: string, createdAt: string }>}
   */
  submit: async (data) => {
    const response = await apiClient.post('/contact', data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch administrative inquiry telemetry stats
   * @returns {Promise<{ stats: { total: number, unread: number, reviewed: number, archived: number } }>}
   */
  getStats: async () => {
    const response = await apiClient.get('/contact/stats');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch paginated list of inbound messages
   * @param {object} [params] - { status, search, page, limit }
   * @returns {Promise<{ messages: Array, pagination: object }>}
   */
  getMessages: async (params = {}) => {
    const cleanParams = { ...params };
    if (cleanParams.status === 'ALL') {
      delete cleanParams.status;
    }
    const response = await apiClient.get('/contact/messages', { params: cleanParams });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch single message details (auto transitions UNREAD -> REVIEWED)
   * @param {string} id
   * @returns {Promise<{ message: object }>}
   */
  getMessage: async (id) => {
    const response = await apiClient.get(`/contact/messages/${id}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Update message triage status
   * @param {string} id
   * @param {string} status - 'UNREAD' | 'REVIEWED' | 'ARCHIVED'
   * @returns {Promise<{ message: object }>}
   */
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/contact/messages/${id}/status`, { status });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Delete an inbound message record permanently
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/contact/messages/${id}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },
};

export default contactService;
