/**
 * CAUTION: You shouldn't need to directly edit this file!
 * Please see https://cli.vuejs.org/guide/mode-and-env.html#environment-variables for details on configuring via environment variables
 *
 * This file is a wrapper around the .env file (located at the base of the project) to provide reasonable defaults in the case of the .env file not existing, or certain properties being excluded
 */

let api_general_endpoint = process.env.VUE_APP_API_BASE
  ? process.env.VUE_APP_API_BASE
  : '/fakeapi';

export default {
  application: {
    name: process.env.VUE_APP_NAME ?? 'uobtheatre',
  },
  api: {
    general_endpoint: api_general_endpoint + '/api/v1',
    graphql_endpoint: api_general_endpoint + '/graphql',
  },
  auth: {
    cookie: 'uobtheatre-auth',
  },
  services: {
    square: {
      script:
        process.env.NODE_ENV !== 'production'
          ? 'https://js.squareupsandbox.com/v2/paymentform'
          : 'https://js.squareup.com/v2/paymentform',
      application_id: process.env.VUE_APP_SQUARE_APP_ID,
      location_id: process.env.VUE_APP_SQUARE_LOC_ID,
    },
  },
};
