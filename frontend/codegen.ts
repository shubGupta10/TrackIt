import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/graphql/**/*.{ts,tsx}",
  generates: {
    "src/generated/graphql.tsx": { 
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"          
      ]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"] 
    }
  }
};

export default config;
