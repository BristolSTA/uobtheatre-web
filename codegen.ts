import { CodegenConfig } from "@graphql-codegen/cli";
import configFn from "./config.js";
require("dotenv").config();

const configData = configFn();

const config: CodegenConfig = {
  overwrite: true,
  schema: configData.api.graphql_endpoint_internal,
  documents: "./graphql/**/*.gql",
  generates: {
    "./graphql/codegen/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
