import { config } from "dotenv";

// Load environment variables
config();

export interface GraphQLConfig {
  endpoint: string;
  apiKey?: string;
  authHeader?: string;
  authValue?: string;
  timeout: number;
}

export const graphQLConfig: GraphQLConfig = {
  endpoint: process.env.GRAPHQL_ENDPOINT || "http://localhost:3002/graphql",
  apiKey: process.env.GRAPHQL_API_KEY,
  authHeader: process.env.GRAPHQL_AUTH_HEADER,
  authValue: process.env.GRAPHQL_AUTH_VALUE,
  timeout: parseInt(process.env.GRAPHQL_TIMEOUT || "10000"),
};

// Validate required configuration
if (!graphQLConfig.endpoint) {
  throw new Error("GRAPHQL_ENDPOINT environment variable is required");
}
