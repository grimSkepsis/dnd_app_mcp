import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { registerGetItemTraitsTool } from "./tools/get-item-traits.js";
import { registerGetInventoryGoldAmountTool } from "./tools/get-inventory-gold-amount.js";

// Create server instance
const server = new McpServer({
  name: "dnd-inventory-manager-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

registerGetInventoryGoldAmountTool(server);
registerGetItemTraitsTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DND Inventory Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
