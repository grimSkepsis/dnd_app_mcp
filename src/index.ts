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

const traitSchema = z.object({
  name: z.string().describe("The name of the trait"),
  description: z.string().optional().describe("The description of the trait"),
});

const getItemTraitsOutputSchema = z.object({
  traits: z.array(traitSchema),
});

server.registerTool(
  "get-item-traits",
  {
    title: "Get list of possible traits for an item",
    description: "Get list of possible traits for an item",
    outputSchema: getItemTraitsOutputSchema.shape,
  },
  () => {
    return Promise.resolve({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            traits: [
              {
                name: "Fire",
                description: "The item is on fire",
              },
              {
                name: "Water",
              },
            ],
          }),
        },
      ],
      structuredContent: {
        traits: [
          {
            name: "Fire",
            description: "The item is on fire",
          },
          {
            name: "Water",
          },
        ],
      },
    });
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
