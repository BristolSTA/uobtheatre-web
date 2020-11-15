import api, { paginatedResource } from '@/services/api';

export default {
  fetchProductions() {
    return new paginatedResource('productions/');
  },
  fetchUpcomingProductions() {
    return new paginatedResource('productions/upcoming_productions/');
  },
  fetchProduction(id) {
    return api.get(`productions/${id}/`).then((response) => response.data);
  },
};
