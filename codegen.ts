import { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

// Load environment variables
dotenvConfig();

const config: CodegenConfig = {
  schema: {
    // Pull GraphQL endpoint from environment variable
    [process.env.GRAPHQL_ENDPOINT || "http://localhost:3002/graphql"]: {
      headers: {
        // Add any headers your server needs
        ...(process.env.GRAPHQL_API_KEY && {
          "X-API-Key": process.env.GRAPHQL_API_KEY,
        }),
        ...(process.env.GRAPHQL_AUTH_HEADER &&
          process.env.GRAPHQL_AUTH_VALUE && {
            [process.env.GRAPHQL_AUTH_HEADER]: process.env.GRAPHQL_AUTH_VALUE,
          }),
      },
    },
    // Option 2: Use introspection query from your existing queries.ts
    // './src/queries.ts': {
    //   operations: ['INTROSPECTION_QUERY'],
    // },
  },
  documents: ["src/**/*.ts"], // Scan all TypeScript files for GraphQL operations
  generates: {
    "./src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        // Generate hooks for React if you're using it
        // withHooks: true,
        // Generate types for fragments
        withFragmentTypes: true,
        // Skip type name validation
        skipTypename: false,
        // Use enums instead of unions for better type safety
        enumsAsTypes: true,
        // Generate input types
        inputMaybeValue: "T | null | undefined",
        // Generate scalars
        scalars: {
          ID: "string",
          DateTime: "string",
          JSON: "Record<string, any>",
        },
      },
    },
  },
  // Watch for changes and regenerate
  watch: true,
  // Verbose output
  verbose: true,
};

export default config;
