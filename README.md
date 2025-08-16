# D&D Inventory Manager MCP Server

An MCP (Model Context Protocol) server that provides tools for managing D&D character inventories, with GraphQL integration capabilities.

## Features

- **Inventory Management**: Get character gold amounts
- **GraphQL Integration**: Query external GraphQL servers for character data
- **Environment-based Configuration**: Secure configuration via environment variables

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your GraphQL server configuration:

```env
# Required: GraphQL Server Endpoint
GRAPHQL_ENDPOINT=http://localhost:4000/graphql

# Optional: API Authentication
GRAPHQL_API_KEY=your_api_key_here

# Optional: Bearer Token Authentication
GRAPHQL_AUTH_HEADER=Authorization
GRAPHQL_AUTH_VALUE=Bearer your_token_here

# Optional: Request Timeout (in milliseconds)
GRAPHQL_TIMEOUT=10000
```

### 3. Build the Project

```bash
npm run build
```

### 4. Run the Server

```bash
npm start
```

## Available Tools

### 1. `get-inventory-gold-amount`

Gets the gold amount for a character by ID.

**Input:**

- `characterId` (string): The ID of the character

**Output:**

- `characterId` (string): The character ID
- `goldAmount` (number): The amount of gold

### 2. `query-character-graphql`

Executes GraphQL queries against your configured GraphQL server.

**Input:**

- `characterId` (string): The ID of the character
- `query` (string): The GraphQL query to execute
- `variables` (string, optional): JSON string of variables for the query

**Output:**

- `characterId` (string): The character ID
- `query` (string): The executed query
- `result` (any): The query result
- `success` (boolean): Whether the query succeeded
- `error` (string, optional): Error message if failed

## Example Usage

### Basic Gold Amount Query

```json
{
  "characterId": "char_123"
}
```

### GraphQL Query Example

```json
{
  "characterId": "char_123",
  "query": "query GetCharacter($id: ID!) { character(id: $id) { name level class gold } }",
  "variables": "{\"id\": \"char_123\"}"
}
```

## GraphQL Integration

The server includes a `GraphQLService` class that handles:

- **Authentication**: API keys and bearer tokens
- **Headers**: Automatic Content-Type and custom headers
- **Error Handling**: Graceful error handling with detailed messages
- **Timeout Management**: Configurable request timeouts

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for sensitive information
- Consider using a secrets management service in production
- Validate GraphQL queries on the server side

## Development

### Project Structure

```
src/
├── index.ts          # Main MCP server and tool definitions
├── config.ts         # Environment configuration
├── graphql-client.ts # GraphQL service implementation
└── types.ts          # Type definitions (if needed)
```

### Adding New Tools

1. Define input/output schemas using Zod
2. Register the tool with `server.registerTool()`
3. Implement the tool logic
4. Return both `content` and `structuredContent`

### Testing GraphQL Queries

You can test your GraphQL integration by:

1. Setting up your GraphQL server
2. Configuring the environment variables
3. Using the `query-character-graphql` tool with your queries
4. Checking the structured output for validation

## Troubleshooting

### Common Issues

1. **GraphQL Connection Failed**: Check your `GRAPHQL_ENDPOINT` and network connectivity
2. **Authentication Errors**: Verify your API key or bearer token
3. **Timeout Issues**: Increase `GRAPHQL_TIMEOUT` for slow queries
4. **Schema Validation Errors**: Ensure your GraphQL queries match your server's schema

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=true
```

## License

ISC
