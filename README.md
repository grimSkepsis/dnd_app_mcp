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

### 3. `query-character-predefined`

Executes predefined GraphQL queries using `gql` template literals for common character operations.

**Input:**

- `characterId` (string): The ID of the character
- `queryType` (string): The type of predefined query to execute:
  - `"basic"` - Get basic character info (name, level, class, gold)
  - `"inventory"` - Get character inventory with items and equipment
  - `"stats"` - Get character stats and skills
  - `"updateGold"` - Update character gold amount
  - `"addItem"` - Add item to character inventory
- `variables` (string, optional): JSON string of additional variables:
  - For `updateGold`: `{"gold": 1000}`
  - For `addItem`: `{"itemId": "sword_001", "quantity": 1}`

**Output:**

- `characterId` (string): The character ID
- `queryType` (string): The type of query executed
- `query` (string): The actual GraphQL query that was executed
- `result` (any): The query result
- `success` (boolean): Whether the query succeeded
- `error` (string, optional): Error message if failed

### 4. `introspect-graphql-schema`

Discovers the available GraphQL schema by running introspection against the endpoint.

**Input:**

- `endpoint` (string, optional): Custom GraphQL endpoint to introspect (defaults to configured endpoint)
- `includeTypes` (boolean, optional): Whether to include detailed type information (default: true)

**Output:**

- `endpoint` (string): The endpoint that was introspected
- `queries` (array): Available queries with names, descriptions, arguments, and return types
- `mutations` (array): Available mutations with names, descriptions, arguments, and return types
- `types` (array): Available types with names, descriptions, kinds, and field information
- `success` (boolean): Whether the introspection was successful
- `error` (string, optional): Error message if introspection failed

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

### Predefined GraphQL Query Examples

#### Basic Character Info

```json
{
  "characterId": "char_123",
  "queryType": "basic"
}
```

#### Character Inventory

```json
{
  "characterId": "char_123",
  "queryType": "inventory"
}
```

#### Update Character Gold

```json
{
  "characterId": "char_123",
  "queryType": "updateGold",
  "variables": "{\"gold\": 1500}"
}
```

#### Add Item to Inventory

```json
{
  "characterId": "char_123",
  "queryType": "addItem",
  "variables": "{\"itemId\": \"sword_001\", \"quantity\": 1}"
}
```

#### Introspect GraphQL Schema

```json
{
  "includeTypes": true
}
```

**Or with a custom endpoint:**

```json
{
  "endpoint": "https://api.example.com/graphql",
  "includeTypes": false
}
```

## GraphQL Integration

The server includes a `GraphQLService` class that handles:

- **Authentication**: API keys and bearer tokens
- **Headers**: Automatic Content-Type and custom headers
- **Error Handling**: Graceful error handling with detailed messages
- **Timeout Management**: Configurable request timeouts

### Benefits of `gql` Template Literals

The server uses `graphql-tag`'s `gql` template literal for several advantages:

- **Syntax Highlighting**: GraphQL queries get proper syntax highlighting in most editors
- **Validation**: Queries are validated at build time for syntax errors
- **Type Safety**: Better TypeScript integration and type checking
- **IntelliSense**: Enhanced autocomplete and error detection in IDEs
- **Maintainability**: Queries are centralized and reusable
- **Performance**: Queries can be optimized and cached by GraphQL clients

### Predefined Queries

The server comes with several predefined queries for common operations:

- **Character Management**: Basic info, inventory, stats
- **Inventory Operations**: Add items, update gold amounts
- **Extensible**: Easy to add new predefined queries
- **Dynamic**: Support for custom variables and parameters

### GraphQL Introspection

The server includes a powerful introspection tool that allows you to:

- **Discover Available Operations**: See all queries and mutations in the schema
- **Understand Data Types**: Explore the structure of objects, inputs, and enums
- **Validate Queries**: Ensure your queries match the actual schema
- **Documentation**: Access field descriptions and argument information
- **Schema Evolution**: Keep track of changes in your GraphQL API

**Benefits of Introspection:**

- **Self-Documenting**: GraphQL APIs are self-documenting through introspection
- **Tool Integration**: Many GraphQL tools use introspection for better UX
- **Development**: Faster development with schema discovery
- **Testing**: Validate queries against the actual schema
- **Debugging**: Understand why queries might be failing

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
