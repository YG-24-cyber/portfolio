import apiClient from './apiClient.js';

export const projectService = {
  /**
   * Fetch all projects with optional query filters
   * @param {object} [params] - { search, category, status, featured }
   * @returns {Promise<{ projects: Array, count: number }>}
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/projects', { params });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch a single project by slug or UUID
   * @param {string} slugOrId
   * @returns {Promise<{ project: object }>}
   */
  getBySlugOrId: async (slugOrId) => {
    const response = await apiClient.get(`/projects/${slugOrId}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Create a new showcase project
   * @param {object} data
   * @returns {Promise<{ project: object }>}
   */
  create: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Update an existing project
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{ project: object }>}
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Toggle featured spotlight status
   * @param {string} id
   * @returns {Promise<{ project: object }>}
   */
  toggleFeatured: async (id) => {
    const response = await apiClient.patch(`/projects/${id}/featured`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Batch reorder project display sequence
   * @param {Array<{ id: string, order: number }>} items
   * @returns {Promise<{ projects: Array }>}
   */
  reorder: async (items) => {
    const response = await apiClient.put('/projects/reorder', { items });
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Delete a project permanently
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },
};

export default projectService;
