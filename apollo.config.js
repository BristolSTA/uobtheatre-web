const path = require('path')

module.exports = {
  client: {
    includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql}'],
  },
  service: {
    localSchemaFile: path.resolve(__dirname, './fakeApi/schema.graphql'),
  },
  engine: {
    endpoint: process.env.APOLLO_ENGINE_API_ENDPOINT,
  },
}
