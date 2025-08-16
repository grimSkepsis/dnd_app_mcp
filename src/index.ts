import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { graphQLService } from "./graphql-client.js";
import { print } from "graphql";
import { graphQLConfig } from "./config.js";
import {
  GET_CHARACTER_BASIC,
  GET_CHARACTER_INVENTORY,
  GET_CHARACTER_STATS,
  UPDATE_CHARACTER_GOLD,
  ADD_ITEM_TO_INVENTORY,
  INTROSPECTION_QUERY,
} from "./queries.js";

// Create server instance
const server = new McpServer({
  name: "dnd-inventory-manager-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const GetInventoryGoldAmountInputSchema = z.object({
  characterId: z
    .string()
    .describe("The ID of the character to get inventory for"),
});
type GetInventoryGoldAmountInput = z.infer<
  typeof GetInventoryGoldAmountInputSchema
>;

const getInventoryGoldAmountOutputSchema = z.object({
  characterId: z
    .string()
    .describe("The ID of the character to get inventory for"),
  goldAmount: z.number().describe("The amount of gold in the inventory"),
});

type GetInventoryGoldAmountOutput = z.infer<
  typeof getInventoryGoldAmountOutputSchema
>;

server.registerTool(
  "get-inventory-gold-amount",
  {
    title: "Get inventory gold amount for a character by character id",
    description: "Get inventory gold amount for a character by character id",
    inputSchema: GetInventoryGoldAmountInputSchema.shape,
    outputSchema: getInventoryGoldAmountOutputSchema.shape,
  },
  ({ characterId }: GetInventoryGoldAmountInput) => {
    return Promise.resolve({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            characterId,
            goldAmount: 532,
          }),
        },
      ],
      structuredContent: {
        characterId,
        goldAmount: 532,
      },
    });
  }
);

// Add a new GraphQL query tool
const QueryCharacterInputSchema = z.object({
  characterId: z.string().describe("The ID of the character to query"),
  query: z.string().describe("The GraphQL query to execute"),
  variables: z
    .string()
    .optional()
    .describe("JSON string of variables for the GraphQL query"),
});

type QueryCharacterInput = z.infer<typeof QueryCharacterInputSchema>;

const QueryCharacterOutputSchema = z.object({
  characterId: z.string().describe("The ID of the character that was queried"),
  query: z.string().describe("The GraphQL query that was executed"),
  result: z.any().describe("The result from the GraphQL query"),
  success: z.boolean().describe("Whether the query was successful"),
  error: z.string().optional().describe("Error message if the query failed"),
});

type QueryCharacterOutput = z.infer<typeof QueryCharacterOutputSchema>;

server.registerTool(
  "query-character-graphql",
  {
    title: "Query character data using GraphQL",
    description:
      "Execute a GraphQL query to fetch character data from the GraphQL server",
    inputSchema: QueryCharacterInputSchema.shape,
    outputSchema: QueryCharacterOutputSchema.shape,
  },
  async ({ characterId, query, variables }: QueryCharacterInput) => {
    try {
      let parsedVariables: Record<string, any> | undefined;

      if (variables) {
        try {
          parsedVariables = JSON.parse(variables);
        } catch (e) {
          return Promise.resolve({
            content: [
              {
                type: "text",
                text: `Invalid JSON in variables: ${variables}`,
              },
            ],
            structuredContent: {
              characterId,
              query,
              result: null,
              success: false,
              error: `Invalid JSON in variables: ${variables}`,
            },
          });
        }
      }

      const result = await graphQLService.query(query, parsedVariables);

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Successfully queried character ${characterId}. Result: ${JSON.stringify(
              result,
              null,
              2
            )}`,
          },
        ],
        structuredContent: {
          characterId,
          query,
          result,
          success: true,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Failed to query character ${characterId}: ${errorMessage}`,
          },
        ],
        structuredContent: {
          characterId,
          query,
          result: null,
          success: false,
          error: errorMessage,
        },
      });
    }
  }
);

// Add a tool that uses predefined GraphQL queries
const PredefinedQueryInputSchema = z.object({
  characterId: z.string().describe("The ID of the character to query"),
  queryType: z
    .enum(["basic", "inventory", "stats", "updateGold", "addItem"])
    .describe("The type of predefined query to execute"),
  variables: z
    .string()
    .optional()
    .describe(
      "JSON string of additional variables (e.g., gold amount for updateGold, itemId and quantity for addItem)"
    ),
});

type PredefinedQueryInput = z.infer<typeof PredefinedQueryInputSchema>;

const PredefinedQueryOutputSchema = z.object({
  characterId: z.string().describe("The ID of the character that was queried"),
  queryType: z.string().describe("The type of query that was executed"),
  query: z.string().describe("The actual GraphQL query that was executed"),
  result: z.any().describe("The result from the GraphQL query"),
  success: z.boolean().describe("Whether the query was successful"),
  error: z.string().optional().describe("Error message if the query failed"),
});

type PredefinedQueryOutput = z.infer<typeof PredefinedQueryOutputSchema>;

server.registerTool(
  "query-character-predefined",
  {
    title: "Query character data using predefined GraphQL queries",
    description:
      "Execute predefined GraphQL queries for common character operations using gql template literals",
    inputSchema: PredefinedQueryInputSchema.shape,
    outputSchema: PredefinedQueryOutputSchema.shape,
  },
  async ({ characterId, queryType, variables }: PredefinedQueryInput) => {
    try {
      let query: string;
      let parsedVariables: Record<string, any> = { id: characterId };

      // Select the appropriate predefined query
      switch (queryType) {
        case "basic":
          query = print(GET_CHARACTER_BASIC);
          break;
        case "inventory":
          query = print(GET_CHARACTER_INVENTORY);
          break;
        case "stats":
          query = print(GET_CHARACTER_STATS);
          break;
        case "updateGold":
          query = print(UPDATE_CHARACTER_GOLD);
          if (variables) {
            try {
              const { gold } = JSON.parse(variables);
              parsedVariables = { id: characterId, gold };
            } catch (e) {
              return Promise.resolve({
                content: [
                  {
                    type: "text",
                    text: `Invalid variables for updateGold. Expected: {"gold": number}`,
                  },
                ],
                structuredContent: {
                  characterId,
                  queryType,
                  query: print(UPDATE_CHARACTER_GOLD),
                  result: null,
                  success: false,
                  error: `Invalid variables for updateGold. Expected: {"gold": number}`,
                },
              });
            }
          }
          break;
        case "addItem":
          query = print(ADD_ITEM_TO_INVENTORY);
          if (variables) {
            try {
              const { itemId, quantity } = JSON.parse(variables);
              parsedVariables = { characterId, itemId, quantity };
            } catch (e) {
              return Promise.resolve({
                content: [
                  {
                    type: "text",
                    text: `Invalid variables for addItem. Expected: {"itemId": "string", "quantity": number}`,
                  },
                ],
                structuredContent: {
                  characterId,
                  queryType,
                  query: print(ADD_ITEM_TO_INVENTORY),
                  result: null,
                  success: false,
                  error: `Invalid variables for addItem. Expected: {"itemId": "string", "quantity": number}`,
                },
              });
            }
          }
          break;
        default:
          throw new Error(`Unknown query type: ${queryType}`);
      }

      const result = await graphQLService.query(query, parsedVariables);

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Successfully executed ${queryType} query for character ${characterId}. Result: ${JSON.stringify(
              result,
              null,
              2
            )}`,
          },
        ],
        structuredContent: {
          characterId,
          queryType,
          query,
          result,
          success: true,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Failed to execute ${queryType} query for character ${characterId}: ${errorMessage}`,
          },
        ],
        structuredContent: {
          characterId,
          queryType,
          query: "",
          result: null,
          success: false,
          error: errorMessage,
        },
      });
    }
  }
);

// Add a GraphQL introspection tool
const IntrospectionInputSchema = z.object({
  endpoint: z
    .string()
    .optional()
    .describe(
      "Optional custom GraphQL endpoint to introspect (defaults to configured endpoint)"
    ),
  includeTypes: z
    .boolean()
    .optional()
    .describe("Whether to include detailed type information (default: true)"),
});

type IntrospectionInput = z.infer<typeof IntrospectionInputSchema>;

const IntrospectionOutputSchema = z.object({
  endpoint: z.string().describe("The endpoint that was introspected"),
  queries: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        args: z.array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            type: z.string(),
          })
        ),
        returnType: z.string(),
      })
    )
    .describe("Available queries in the schema"),
  mutations: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        args: z.array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            type: z.string(),
          })
        ),
        returnType: z.string(),
      })
    )
    .describe("Available mutations in the schema"),
  types: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        kind: z.string(),
        fields: z
          .array(
            z.object({
              name: z.string(),
              description: z.string().optional(),
              type: z.string(),
            })
          )
          .optional(),
      })
    )
    .describe("Available types in the schema"),
  success: z.boolean().describe("Whether the introspection was successful"),
  error: z
    .string()
    .optional()
    .describe("Error message if introspection failed"),
});

type IntrospectionOutput = z.infer<typeof IntrospectionOutputSchema>;

server.registerTool(
  "introspect-graphql-schema",
  {
    title: "Introspect GraphQL schema to discover available operations",
    description:
      "Run GraphQL introspection to see what queries, mutations, and types are available in the schema",
    inputSchema: IntrospectionInputSchema.shape,
    outputSchema: IntrospectionOutputSchema.shape,
  },
  async ({ endpoint, includeTypes = true }: IntrospectionInput) => {
    try {
      const targetEndpoint = endpoint || graphQLConfig.endpoint;
      const query = print(INTROSPECTION_QUERY);

      const result = await graphQLService.query(query);

      // Parse and format the introspection result
      const schema = result.__schema;
      const queries = schema.queryType?.fields || [];
      const mutations = schema.mutationType?.fields || [];
      const types = includeTypes ? schema.types || [] : [];

      // Format queries
      const formattedQueries = queries.map((q: any) => ({
        name: q.name,
        description: q.description,
        args: (q.args || []).map((arg: any) => ({
          name: arg.name,
          description: arg.description,
          type: getTypeName(arg.type),
        })),
        returnType: getTypeName(q.type),
      }));

      // Format mutations
      const formattedMutations = mutations.map((m: any) => ({
        name: m.name,
        description: m.description,
        args: (m.args || []).map((arg: any) => ({
          name: arg.name,
          description: arg.description,
          type: getTypeName(arg.type),
        })),
        returnType: getTypeName(m.type),
      }));

      // Format types
      const formattedTypes = types.map((t: any) => ({
        name: t.name,
        description: t.description,
        kind: t.kind,
        fields: t.fields
          ? t.fields.map((f: any) => ({
              name: f.name,
              description: f.description,
              type: getTypeName(f.type),
            }))
          : undefined,
      }));

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Successfully introspected GraphQL schema at ${targetEndpoint}.\n\nAvailable Queries: ${formattedQueries.length}\nAvailable Mutations: ${formattedMutations.length}\nAvailable Types: ${formattedTypes.length}`,
          },
        ],
        structuredContent: {
          endpoint: targetEndpoint,
          queries: formattedQueries,
          mutations: formattedMutations,
          types: formattedTypes,
          success: true,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return Promise.resolve({
        content: [
          {
            type: "text",
            text: `Failed to introspect GraphQL schema: ${errorMessage}`,
          },
        ],
        structuredContent: {
          endpoint: endpoint || graphQLConfig.endpoint,
          queries: [],
          mutations: [],
          types: [],
          success: false,
          error: errorMessage,
        },
      });
    }
  }
);

// Helper function to extract type names from GraphQL types
function getTypeName(type: any): string {
  if (type.kind === "NON_NULL") {
    return `${getTypeName(type.ofType)}!`;
  }
  if (type.kind === "LIST") {
    return `[${getTypeName(type.ofType)}]`;
  }
  return type.name || type.kind;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DND Inventory Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
