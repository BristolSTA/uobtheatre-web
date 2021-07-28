module.exports = {
  client: {
    includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql}'],
    service: {
      name: 'uobtheatre-api',
      url: 'http://uobtheatre-api:8000/graphql/',
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
}
