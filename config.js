/**
 * CAUTION: You shouldn't need to directly edit this file!
 */

export default () => {
  return {
    application: {
      name: process.env.APP_NAME ?? 'UOB Theatre',
      support_email: '&#115;upp&#111;rt&#64;uob&#116;h&#101;atre&#46;com',
    },
    api: {
      graphql_endpoint: process.env.APP_API_BASE + '/graphql/',
    },
    auth: {
      cookie: 'uobtheatre-auth',
    },
    services: {
      square: {
        script:
          process.env.NODE_ENV !== 'production' ||
          process.env.APP_SQUARE_APP_ID.startsWith('sandbox')
            ? 'https://js.squareupsandbox.com/v2/paymentform'
            : 'https://js.squareup.com/v2/paymentform',
        application_id: process.env.APP_SQUARE_APP_ID,
        location_id: process.env.APP_SQUARE_LOC_ID,
      },
    },
  }
}
