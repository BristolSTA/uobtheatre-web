import { CodegenConfig } from '@graphql-codegen/cli';
import publicConfig from './config.public';
require('dotenv').config();

const config: CodegenConfig = {
  overwrite: true,
  schema: publicConfig().api.graphqlEndpointInternal,
  documents: './graphql/**/*.gql',
  generates: {
    './graphql/codegen/operations.ts': {
      // preset: 'client',
      plugins: ['typescript', 'typescript-operations', 'typescript-vue-apollo']
    }
  }
};

export default config;
