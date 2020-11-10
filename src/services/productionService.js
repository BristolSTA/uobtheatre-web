import api from '@/services/api';

export default {
  fetchProductions() {
    return api.get('productions/').then((response) => response.data);
  },
  fetchProduction(id) {
    return api.get(`productions/${id}/`).then((response) => response.data);
  },
};
