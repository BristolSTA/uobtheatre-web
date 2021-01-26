import api from '@/services/api';

export default {
  /**
   * Fetches a society by it's slug
   *
   * @param {string} slug Society's slug
   * @returns {Promise} API Response Promise
   */
  fetchSocietyBySlug(slug) {
    return api.get(`societies/${slug}/`);
  },
};
