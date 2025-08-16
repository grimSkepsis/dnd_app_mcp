import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { graphQLService } from "./graphql-client.js";
import { print } from "graphql";
import {
  GET_CHARACTER_BASIC,
  GET_CHARACTER_INVENTORY,
  GET_CHARACTER_STATS,
  UPDATE_CHARACTER_GOLD,
  ADD_ITEM_TO_INVENTORY,
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DND Inventory Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
