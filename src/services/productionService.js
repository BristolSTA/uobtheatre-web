import api, { paginatedResource } from '@/services/api';

export default {
  /**
   * Fetches all productions
   *
   * @returns {paginatedResource} API Response Promise (Paginated)
   */
  fetchProductions() {
    return new paginatedResource('productions/');
  },
  /**
   * Fetches upcoming productions
   *
   * @returns {paginatedResource} API Response Promise (Paginated)
   */
  fetchUpcomingProductions() {
    return new paginatedResource('productions/upcoming_productions/');
  },
  /**
   * Fetches a production by it's slug
   *
   * @param {string} slug Production's slug
   * @returns {Promise} API Response Promise
   */
  fetchProductionBySlug(slug) {
    return api.get(`productions/${slug}/`);
  },
};
