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

  /**
   * Fetches ticket options for specified performance
   *
   * @param {string} production_slug Production's slug
   * @param {string} performance_id Performance ID
   * @returns {Promise} API Response Promise
   */
  fetchTicketOptionsForPerformance(production_slug, performance_id) {
    return api.get(
      `productions/${production_slug}/performances/${performance_id}/ticket_types/`
    );
  },

  /**
   * Fetches group discount options for specified performance
   *
   * @param {string} production_slug Production's slug
   * @param {string} performance_id Performance ID
   * @returns {Promise} API Response Promise
   */
  fetchGroupDiscountOptionsForPerformance(production_slug, performance_id) {
    return api.get(
      `productions/${production_slug}/performances/${performance_id}/discounts/`
    );
  },
};
