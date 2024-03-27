import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/schema.graphql", // URL or local file path to your GraphQL schema
  documents: ["src/**/*.ts"], // Path to your GraphQL operation files
  generates: {
    "./src/gql/": {
      // Output directory for generated files
      preset: "client", // Code generation preset (e.g., 'typescript')
    },
  },
};

export default config;
