import { CodegenConfig } from '@graphql-codegen/cli';
import configFn from './config.js';
require('dotenv').config();

const configData = configFn();

const config: CodegenConfig = {
  overwrite: true,
  schema: configData.api.graphql_endpoint_internal,
  documents: './graphql/**/*.gql',
  generates: {
    './graphql/codegen/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
    './graphql/codegen/operations.ts': {
      plugins: ['typescript-vue-apollo-smart-ops'],
    },
  },
};

export default config;
