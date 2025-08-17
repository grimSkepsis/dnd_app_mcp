import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { graphQLService } from "../graphql-client.js";
import { getSdk } from "../generated/graphql.js";

const traitSchema = z.object({
  name: z.string().describe("The name of the trait"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("The description of the trait"),
});

const getItemTraitsOutputSchema = z.object({
  traits: z.array(traitSchema),
  success: z.boolean().describe("Whether the query was successful"),
  error: z.string().optional().describe("Error message if the query failed"),
});

/**
 * Returns a list of possible item traits
 * @param server
 */
export function registerGetItemTraitsTool(server: McpServer) {
  server.registerTool(
    "get-item-traits",
    {
      title: "Get list of possible traits for an item",
      description:
        "Get list of possible traits for an item by querying the GraphQL server",
      outputSchema: getItemTraitsOutputSchema.shape,
    },
    async () => {
      try {
        // Use the generated SDK for type-safe GraphQL operations
        const typedGraphQLService = getSdk(graphQLService.client);
        const result = await typedGraphQLService.traitListing();

        // Extract traits from the nested structure with full type safety
        const traits = result.items.getTraits;

        return Promise.resolve({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                traits: traits.map((trait) => ({
                  name: trait.name,
                  description: trait.description,
                })),
                success: true,
              }),
            },
          ],
          structuredContent: {
            traits: traits.map((trait) => ({
              name: trait.name,
              description: trait.description,
            })),
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
              text: `Failed to retrieve item traits: ${errorMessage}`,
            },
          ],
          structuredContent: {
            traits: [],
            success: false,
            error: errorMessage,
          },
        });
      }
    }
  );
}
