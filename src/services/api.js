import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV != 'test' && process.env.VUE_APP_API_BASE
      ? process.env.VUE_APP_API_BASE
      : '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
});

export default api;

let paginatedResource = class {
  apiResponse;
  constructor(endpoint, page = null) {
    if (page) {
      endpoint = endpoint + `?page=${page}`;
    }

    return new Promise((resolve, reject) => {
      api
        .get(endpoint)
        .then((response) => (this.apiResponse = response.data))
        .then(() => resolve(this.results()))
        .catch(reject);
    });
  }

  results() {
    return this.apiResponse ? this.apiResponse.results : [];
  }

  next() {
    if (!this.apiResource) throw 'No data received from API yet';
    return paginatedResource(this.apiResponse.next);
  }

  previous() {
    if (!this.apiResource) throw 'No data received from API yet';
    return paginatedResource(this.apiResponse.previous);
  }
};

export { paginatedResource };
