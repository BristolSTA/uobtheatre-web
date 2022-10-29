export default () => ({
  api: {
    graphqlEndpoint:
      (process.env.API_BASE || 'http://localhost:9000') + '/graphql/',
    graphqlEndpointInternal:
      (process.env.API_BASE_INTERNAL ||
        process.env.API_BASE ||
        'http://uobtheatre-api:8000') + '/graphql/',
    uploadEndpoint:
      (process.env.API_BASE || 'http://localhost:9000') + '/upload/'
  },
  auth: {
    cookieName: 'uobtheatre-auth',
    refreshTokenKey: 'uobtheatre-refresh-auth',
    rememberKey: 'uobtheatre-remember-auth'
  },
  services: {
    square: {
      script:
        process.env.NODE_ENV !== 'production' ||
        !process.env.SQUARE_APP_ID ||
        process.env.SQUARE_APP_ID.startsWith('sandbox')
          ? 'https://sandbox.web.squarecdn.com/v1/square.js'
          : 'https://web.squarecdn.com/v1/square.js',
      applicationId: process.env.SQUARE_APP_ID,
      locationId: process.env.SQUARE_LOC_ID
    },
    googleAnalytics: {
      id: process.env.GA_ID
    },
    sentry: {
      dsn: process.env.SENTRY_DSN
    }
  }
});
