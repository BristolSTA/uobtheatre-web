import api from '@/services/api';

export default {
  /**
   * Fetches a venue by it's slug
   *
   * @param {string} slug Venue's slug
   * @returns {Promise} API Response Promise
   */
  fetchVenueBySlug(slug) {
    return api.get(`venues/${slug}/`);
  },
};
