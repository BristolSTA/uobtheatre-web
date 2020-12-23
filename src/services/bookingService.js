import api from '@/services/api';

export default {
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
};
