import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/config';

const api = new (class {
  axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.endpoint,
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
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          let errors = new Errors();
          errors.record(error.response.data);
          reject(errors, error.response.data);
        });
    });
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

/**
 * Errors class for wrapping (validaiton) errors from the API
 */
let Errors = class {
  /**
   * Create a new Errors instance.
   */
  constructor() {
    this.errors = {};
  }

  /**
   * Determine if an error exists for the given field.
   *
   * @param {string} field The field name
   * @returns {boolean} Whether the field has errors
   */
  has(field) {
    return Object.prototype.hasOwnProperty.call(this.errors, field);
  }

  /**
   * Determine if we have any errors.
   *
   * @returns {boolean} Whether there are any errors
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field The field name
   * @returns {string} The error message
   */
  get(field) {
    if (this.errors[field]) {
      return this.errors[field][0];
    }
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors API Errors Object
   */
  record(errors) {
    this.errors = errors;
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field The field name
   */
  clear(field) {
    if (field) {
      delete this.errors[field];

      return;
    }

    this.errors = {};
  }
};

export { paginatedResource, Errors };
