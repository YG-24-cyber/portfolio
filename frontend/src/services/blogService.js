import apiClient from './apiClient.js';

export const blogService = {
  /**
   * Fetch all blog articles with search, filtering, and pagination
   * @param {object} [params] - { search, category, tag, featured, page, limit }
   * @returns {Promise<{ blogs: Array, pagination: object }>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/blogs', { params });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch a single blog post by slug or UUID
   * @param {string} slugOrId
   * @returns {Promise<{ blog: object }>}
   */
  getBySlugOrId: async (slugOrId) => {
    const response = await apiClient.get(`/blogs/${slugOrId}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Publish a new blog article
   * @param {object} data
   * @returns {Promise<{ blog: object }>}
   */
  create: async (data) => {
    const response = await apiClient.post('/blogs', data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Update an existing article
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{ blog: object }>}
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/blogs/${id}`, data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Toggle featured hero article spotlight
   * @param {string} id
   * @returns {Promise<{ blog: object }>}
   */
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`/blogs/${id}/featured`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Delete an article permanently
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },
};

export default blogService;
