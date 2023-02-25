import { CodegenConfig } from '@graphql-codegen/cli';
import publicConfig from './config.public';
require('dotenv').config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GQL_SCHEMA ?? publicConfig().api.graphqlEndpointInternal,
  documents: './graphql/**/*.(gql|graphql)',
  generates: {
    './graphql/codegen/operations.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-vue-apollo'],
      config: {
        vueCompositionApiImportFrom: 'vue',
        scalars: {
          IdInputField: 'string'
        }
      }
    }
  }
};

export default config;
