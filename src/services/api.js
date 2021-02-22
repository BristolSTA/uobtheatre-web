import axios from 'axios';
import Cookies from 'js-cookie';

import config from '@/config';
import store from '@/store';

const api = new (class {
  axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.general_endpoint,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    });
  }

  /**
   * Send a GET request to the given endpoint.
   *
   *
   * @param {string} endpoint API Endpoint
   * @param {object} [data] Optional request data
   * @returns {Promise} API Response Promise
   */
  get(endpoint, data = null) {
    return this.submit('get', endpoint, data);
  }

  /**
   * Send a POST request to the given endpoint.
   *
   *
   * @param {string} endpoint API Endpoint
   * @param {object} [data] Optional request data
   * @returns {Promise} API Response Promise
   */
  post(endpoint, data = null) {
    return this.submit('post', endpoint, data);
  }

  /**
   * Send a PUT request to the given endpoint.
   *
   *
   * @param {string} endpoint API Endpoint
   * @param {object} [data] Optional request data
   * @returns {Promise} API Response Promise
   */
  put(endpoint, data = null) {
    return this.submit('put', endpoint, data);
  }

  /**
   * Send a PATCH request to the given endpoint.
   *
   *
   * @param {string} endpoint API Endpoint
   * @param {object} [data] Optional request data
   * @returns {Promise} API Response Promise
   */
  patch(endpoint, data = null) {
    return this.submit('patch', endpoint, data);
  }

  /**
   * Send a DELETE request to the given endpoint.
   *
   *
   * @param {string} endpoint API Endpoint
   * @param {object} [data] Optional request data
   * @returns {Promise} API Response Promise
   */
  delete(endpoint, data = null) {
    return this.submit('delete', endpoint, data);
  }

  /**
   * Submit the form.
   *
   * @param {string} requestType HTTP Request method (GET, POST, etc)
   * @param {string} endpoint API Endpoint
   * @param {object|null} data Request Data
   * @returns {Promise} API Response Promise
   */
  submit(requestType, endpoint, data) {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request({
          method: requestType,
          url: endpoint,
          data: data,
          headers: this.getAuthHeaders(),
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          // HTTP 400 Code = Validation Error
          // if (
          //   error.response &&
          //   error.response.status == 400 &&
          //   error.response.data
          // ) {
          //   let errors = new Errors();
          //   errors.record(error.response.data);
          //   return reject(errors, error.response.data);
          // }
          reject(error);
        });
    });
  }

  /**
   * @returns {object} Authorization Headers
   */
  getAuthHeaders() {
    if (!store.state.auth.token) return;
    return {
      Authorization: `Token ${store.state.auth.token}`,
    };
  }
})();

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
        .then((data) => (this.apiResponse = data))
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
