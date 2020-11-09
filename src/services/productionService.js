import api from '@/services/api';

export default {
  fetchProductions() {
    return api.get('productions/').then((response) => response.data);
  },
};
