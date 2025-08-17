import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

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

/**
 * returns gold amount for a given inventory (stubbed test tool)
 * @param server
 */
export function registerGetInventoryGoldAmountTool(server: McpServer) {
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
              goldAmount: 534,
            }),
          },
        ],
        structuredContent: {
          characterId,
          goldAmount: 534,
        },
      });
    }
  );
}
