import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
dotenv.config();
const infoSchema = z.object({
  content: z.string().describe("The information to be returned"),
  category: z.string().describe("The category of the information"),
});

const getTopicalInfoInputSchema = z.object({
  question: z.string().describe("The question to be answered"),
  category: z.string().describe("The category of the information"),
});

const getTopicalInfoOutputSchema = z.object({
  info: z.array(infoSchema),
});

/**
 * Returns a list of possible item traits
 * @param server
 */
export function registerGetTopicalInfoTool(server: McpServer) {
  server.registerTool(
    "get-topical-info",
    {
      title: "Get topical information",
      description: "Get topical information.",
      inputSchema: getTopicalInfoInputSchema.shape,
      outputSchema: getTopicalInfoOutputSchema.shape,
    },
    async ({ question }) => {
      // Initialize a Pinecone client with your API key
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY ?? "<no-key>",
      });

      // Create a dense index with integrated embedding
      const indexName = "quickstart-js";

      // Target the index
      const index = pc.index(indexName).namespace("example-namespace");

      // Define the query
      //   const query = "Famous historical structures and monuments";

      // Search the dense index
      const rerankedResults = await index.searchRecords({
        query: {
          topK: 10,
          inputs: { text: question },
        },
        rerank: {
          model: "bge-reranker-v2-m3",
          topN: 10,
          rankFields: ["chunk_text"],
        },
      });

      const fields = rerankedResults.result.hits.map((hit) => hit.fields);
      if (isTopicalInfoList(fields)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                info: fields.map((field) => ({
                  content: field.chunk_text,
                  category: field.category,
                })),
              }),
            },
          ],
          structuredContent: {
            info: fields.map((field) => ({
              content: field.chunk_text,
              category: field.category,
            })),
          },
        };
      } else {
        throw new Error("No topical info found");
      }
    }
  );
}
type TopicalInfo = {
  chunk_text: string;
  category: string;
};

function isTopicalInfoList(fields: unknown): fields is TopicalInfo[] {
  return Array.isArray(fields) && fields.every(isTopicalInfo);
}

function isTopicalInfo(fields: unknown): fields is TopicalInfo {
  return (
    typeof fields === "object" &&
    fields !== null &&
    "chunk_text" in fields &&
    "category" in fields
  );
}
