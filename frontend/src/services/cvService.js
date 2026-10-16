import apiClient from './apiClient.js';

export const cvService = {
  /**
   * Fetch currently active production CV release artifact
   * @returns {Promise<{ release: object }>}
   */
  getActive: async () => {
    const response = await apiClient.get('/cv/active');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch all registered CV release versions
   * @returns {Promise<{ releases: Array, count: number }>}
   */
  getAllReleases: async () => {
    const response = await apiClient.get('/cv/releases');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Atomically record CV download event
   * @returns {Promise<{ totalCvDownloads: number, lastCvDownloadAt: string }>}
   */
  recordDownload: async () => {
    const response = await apiClient.post('/cv/download');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Fetch administrative download telemetry and document metrics
   * @returns {Promise<{ telemetry: object }>}
   */
  getTelemetry: async () => {
    const response = await apiClient.get('/cv/telemetry');
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Deploy a new CV release version
   * @param {object} data
   * @returns {Promise<{ release: object }>}
   */
  createRelease: async (data) => {
    const response = await apiClient.post('/cv/releases', data);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Set target release as active production resume
   * @param {string} id
   * @returns {Promise<{ release: object }>}
   */
  setActiveRelease: async (id) => {
    const response = await apiClient.patch(`/cv/releases/${id}/activate`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },

  /**
   * Delete an archived CV release
   * @param {string} id
   * @returns {Promise<{ id: string }>}
   */
  deleteRelease: async (id) => {
    const response = await apiClient.delete(`/cv/releases/${id}`);
    return response?.data !== undefined && response?.success !== undefined ? response.data : response;
  },
};

export default cvService;
