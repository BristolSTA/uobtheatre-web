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
      graphql_endpoint:
        (process.env.API_BASE || 'http://localhost:9000') + '/graphql/',
    },
    auth: {
      cookie: 'uobtheatre-auth',
      refreshTokenKey: 'uobtheatre-refresh-auth',
      rememberKey: 'uobtheatre-remember-auth',
    },
    services: {
      square: {
        script:
          process.env.NODE_ENV !== 'production' ||
          process.env.SQUARE_APP_ID.startsWith('sandbox')
            ? 'https://sandbox.web.squarecdn.com/v1/square.js'
            : 'https://web.squarecdn.com/v1/square.js',
        application_id: process.env.SQUARE_APP_ID,
        location_id: process.env.SQUARE_LOC_ID,
      },
    },
  }
}
