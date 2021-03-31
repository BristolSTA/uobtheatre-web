/**
 * CAUTION: You shouldn't need to directly edit this file!
 * Please see https://cli.vuejs.org/guide/mode-and-env.html#environment-variables for details on configuring via environment variables
 *
 * This file is a wrapper around the .env file (located at the base of the project) to provide reasonable defaults in the case of the .env file not existing, or certain properties being excluded
 */

const apiGeneralEndpoint = process.env.APP_API_BASE
  ? process.env.APP_API_BASE
  : '/fakeapi'

export default {
  application: {
    name: process.env.APP_NAME ?? 'UOB Theatre',
    support_email: '&#115;upp&#111;rt&#64;uob&#116;h&#101;atre&#46;com',
  },
  api: {
    graphql_endpoint: apiGeneralEndpoint + '/graphql/',
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
      application_id: process.env.APP_SQUARE_APP_ID,
      location_id: process.env.APP_SQUARE_LOC_ID,
    },
  },
}