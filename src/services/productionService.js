import api, { paginatedResource } from '@/services/api';

export default {
  fetchProductions() {
    return new paginatedResource('productions/');
  },
  fetchUpcomingProductions() {
    return new paginatedResource('productions/upcoming_productions/');
  },
  fetchProductionBySlug(slug) {
    return api
      .get(`productions/${slug}/`)
      .then((response) => response.data.production);
  },
};
