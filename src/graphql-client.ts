import { GraphQLClient } from "graphql-request";
import { graphQLConfig } from "./config.js";
// Import generated types (these will be created after running codegen)
// import { GeneratedTypes } from "./generated/graphql.js";

export class GraphQLService {
  private _client: GraphQLClient;

  constructor() {
    // Set up headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API key if provided
    if (graphQLConfig.apiKey) {
      headers["X-API-Key"] = graphQLConfig.apiKey;
    }

    // Add authentication header if provided
    if (graphQLConfig.authHeader && graphQLConfig.authValue) {
      headers[graphQLConfig.authHeader] = graphQLConfig.authValue;
    }

    this._client = new GraphQLClient(graphQLConfig.endpoint, {
      headers,
    });
  }

  // Getter for the GraphQL client (needed for generated SDK)
  get client(): GraphQLClient {
    return this._client;
  }

  // Generic query method with better typing
  async query<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    try {
      const result = await this._client.request<T>(query, variables);
      return result;
    } catch (error) {
      console.error("GraphQL query failed:", error);
      throw new Error(
        `GraphQL query failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Generic mutation method with better typing
  async mutation<T = unknown>(
    mutation: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    try {
      const result = await this._client.request<T>(mutation, variables);
      return result;
    } catch (error) {
      console.error("GraphQL mutation failed:", error);
      throw new Error(
        `GraphQL mutation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Typed query method using generated types
  // async typedQuery<TData, TVariables>(
  //   document: string,
  //   variables?: TVariables
  // ): Promise<TData> {
  //   return this.query<TData>(document, variables);
  // }

  // Typed mutation method using generated types
  // async typedMutation<TData, TVariables>(
  //   document: string,
  //   variables?: TVariables
  // ): Promise<TData> {
  //   return this.mutation<TData>(document, variables);
  // }
}

// Export singleton instance
export const graphQLService = new GraphQLService();
