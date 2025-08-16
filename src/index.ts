import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DND Inventory Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
