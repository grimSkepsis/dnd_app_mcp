# GraphQL Code Generation Setup

This project now uses **GraphQL Code Generator** to automatically generate TypeScript types from your GraphQL schema. This solves the linting issues where TypeScript couldn't determine the structure of GraphQL responses.

## What This Solves

- **No more linting errors** about properties not existing on GraphQL results
- **Full type safety** for all GraphQL operations
- **Automatic type generation** from your GraphQL schema
- **IntelliSense support** in your IDE for GraphQL responses

## How It Works

1. **Schema Introspection**: The tool connects to your GraphQL server and introspects the schema
2. **Type Generation**: It generates TypeScript types based on your actual GraphQL schema
3. **Operation Types**: It creates specific types for each query/mutation you define
4. **Type Safety**: Your code now has full type safety for GraphQL operations

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with your GraphQL server configuration:

```bash
# .env file
GRAPHQL_ENDPOINT=http://your-server:port/graphql
GRAPHQL_API_KEY=your_api_key_if_needed
GRAPHQL_AUTH_HEADER=Authorization
GRAPHQL_AUTH_VALUE=Bearer your_token_if_needed
GRAPHQL_TIMEOUT=10000
```

### 2. Configure Your GraphQL Endpoint

The code generator automatically pulls the GraphQL endpoint from your environment variables. Set the `GRAPHQL_ENDPOINT` environment variable in your `.env` file:

```bash
# .env file
GRAPHQL_ENDPOINT=http://your-server:port/graphql
GRAPHQL_API_KEY=your_api_key_if_needed
GRAPHQL_AUTH_HEADER=Authorization
GRAPHQL_AUTH_VALUE=Bearer your_token_if_needed
```

The `codegen.ts` file automatically uses these environment variables, so no hardcoding is needed!

### 2. Generate Types

Run the code generation command:

```bash
npm run codegen
```

This will:

- Connect to your GraphQL server
- Introspect the schema
- Generate TypeScript types in `src/generated/graphql.ts`

### 3. Use Generated Types

Import and use the generated types in your code:

```typescript
import {
  GetCharacterInventoryQuery,
  GetCharacterInventoryQueryVariables,
} from "./generated/graphql.js";

async function getInventory(characterId: string) {
  const variables: GetCharacterInventoryQueryVariables = { id: characterId };

  // TypeScript now knows the exact structure of the response
  const result = await graphQLService.query<GetCharacterInventoryQuery>(
    query,
    variables
  );

  // No more linting errors - TypeScript knows items exists
  const items = result.character?.inventory?.items;

  return result;
}
```

## Available Scripts

- `npm run codegen` - Generate types once
- `npm run codegen:watch` - Watch for changes and regenerate automatically

## File Structure

```
src/
├── generated/
│   └── graphql.ts          # Auto-generated types (don't edit manually)
├── graphql-client.ts        # Your GraphQL client
├── queries.ts              # Your GraphQL queries
└── example-usage.ts        # Examples of using generated types
```

## Benefits

### Before (Manual Typing)

```typescript
// ❌ TypeScript doesn't know the structure
const result = await graphQLService.query(query, variables);
// Linting error: Property 'items' does not exist on type 'unknown'
const items = result.character?.inventory?.items;
```

### After (Generated Types)

```typescript
// ✅ Full type safety
const result = await graphQLService.query<GetCharacterInventoryQuery>(
  query,
  variables
);
// TypeScript knows exactly what properties exist
const items = result.character?.inventory?.items; // No errors!
```

## Advanced Usage

### Using the Generated SDK

For even better type safety, use the generated SDK:

```typescript
import { createSdk } from "./generated/graphql.js";

const typedService = createSdk(graphQLService);

// Fully typed method calls
const result = await typedService.GetCharacterInventory({ id: characterId });
```

### Custom Scalars

If your GraphQL schema uses custom scalar types, configure them in `codegen.ts`:

```typescript
scalars: {
  ID: 'string',
  DateTime: 'string',
  JSON: 'Record<string, any>',
  // Add your custom scalars here
  CustomScalar: 'YourCustomType',
},
```

## Troubleshooting

### Schema Connection Issues

If the code generator can't connect to your GraphQL server:

1. Check your `.env` file and verify `GRAPHQL_ENDPOINT` is set correctly
2. Verify your server is running at the specified endpoint
3. Check authentication headers in your `.env` file
4. Ensure introspection is enabled on your server
5. Verify the environment variables are being loaded (check that your `.env` file exists)

### Type Generation Issues

If types aren't generating correctly:

1. Check the GraphQL schema for syntax errors
2. Verify your queries use valid GraphQL syntax
3. Run `npm run codegen` with verbose output to see detailed errors

### Linting Still Failing

If you still get linting errors:

1. Make sure you're importing the generated types
2. Use the generic type parameter: `query<YourQueryType>(...)`
3. Check that the generated types file exists and is up to date

## Keeping Types Updated

- Run `npm run codegen` whenever you change your GraphQL schema
- Use `npm run codegen:watch` during development for automatic updates
- Commit the generated types file to version control
- Regenerate types after pulling schema changes from your team

## Next Steps

1. Update the schema URL in `codegen.ts` to point to your server
2. Run `npm run codegen` to generate your first set of types
3. Update your existing code to use the generated types
4. Enjoy full type safety and no more linting errors!
