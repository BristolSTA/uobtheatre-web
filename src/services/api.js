import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/config';

const api = axios.create({
  baseURL: config.api.endpoint,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
});

export default api;

/**
 * Wrapper for requesting & retrieving data from the API that is paginated
 *
 * @param {string} endpoint API method endpoint (e.g. /productions)
 * @param {number} page Requested page number
 */
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
