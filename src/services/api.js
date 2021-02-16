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
          if (
            error.response &&
            error.response.status == 400 &&
            error.response.data
          ) {
            let errors = new Errors();
            errors.record(error.response.data);
            return reject(errors, error.response.data);
          }
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

/**
 * Errors class for wrapping (validaiton) errors from the API
 */
let Errors = class {
  /**
   * Create a new Errors instance.
   */
  constructor() {
    this.resetErrors();
  }

  /**
   * Resets errors object
   */
  resetErrors() {
    this.errors = {
      field_errors: {},
      non_field_errors: [],
    };
  }

  /**
   * Determine if an error exists for the given field.
   *
   * @param {string} field The field name
   * @returns {boolean} Whether the field has errors
   */
  has(field) {
    return Object.prototype.hasOwnProperty.call(
      this.errors.field_errors,
      field
    );
  }

  /**
   * Determine if we have any errors.
   *
   * @returns {boolean} Whether there are any errors
   */
  any() {
    return (
      Object.keys(this.errors.field_errors).length > 0 ||
      Object.keys(this.errors.non_field_errors).length > 0
    );
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field The field name
   * @returns {string} The error message
   */
  get(field) {
    if (this.errors.field_errors[field]) {
      return this.errors.field_errors[field][0];
    }
  }

  /**
   * @returns {boolean} Whether there are generic errors
   */
  hasGenericErrors() {
    return this.getGenericErrors().length !== 0;
  }

  /**
   * Retrieve the generic (i.e. non-field) errors
   *
   * @returns {Array | null} Array of generic errors
   */
  getGenericErrors() {
    return this.errors.non_field_errors;
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors API Errors Object
   */
  record(errors) {
    let non_field_errors = errors.non_field_errors;
    delete errors['non_field_errors'];
    let field_errors = errors;

    this.errors = {
      field_errors: field_errors ?? {},
      non_field_errors: non_field_errors ?? [],
    };
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field The field name
   */
  clear(field) {
    if (field) {
      delete this.errors.field_errors[field];

      return;
    }

    this.resetErrors();
  }
};

export { Errors, paginatedResource };
