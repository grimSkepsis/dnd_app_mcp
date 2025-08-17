// Example usage of generated types with your GraphQL client
import { graphQLService } from "./graphql-client.js";
import {
  GetCharacterInventoryQuery,
  GetCharacterInventoryQueryVariables,
  GetCharacterInventoryDocument,
  UpdateCharacterGoldMutation,
  UpdateCharacterGoldMutationVariables,
  UpdateCharacterGoldDocument,
} from "./generated/graphql.js";

// Example: Get character inventory with full type safety
async function getCharacterInventory(
  characterId: string
): Promise<GetCharacterInventoryQuery> {
  const variables: GetCharacterInventoryQueryVariables = { id: characterId };

  // Now you have full type safety - TypeScript knows exactly what this returns
  const result = await graphQLService.query<GetCharacterInventoryQuery>(
    GetCharacterInventoryDocument,
    variables
  );

  // TypeScript now knows that result.character?.inventory?.items exists
  // No more linting errors about 'items' not existing on 'result'
  const items = result.character?.inventory?.items;

  if (items) {
    items.forEach((item) => {
      if (item) {
        console.log(
          `${item.name}: ${item.quantity} (${item.weight} lbs, ${item.value} gold)`
        );
      }
    });
  }

  return result;
}

// Example: Update character gold with full type safety
async function updateCharacterGold(
  characterId: string,
  newGoldAmount: number
): Promise<UpdateCharacterGoldMutation> {
  const variables: UpdateCharacterGoldMutationVariables = {
    id: characterId,
    gold: newGoldAmount,
  };

  const result = await graphQLService.mutation<UpdateCharacterGoldMutation>(
    UpdateCharacterGoldDocument,
    variables
  );

  // TypeScript knows the exact structure of the response
  const updatedCharacter = result.updateCharacterGold;
  if (updatedCharacter) {
    console.log(
      `Character ${updatedCharacter.id} now has ${updatedCharacter.gold} gold`
    );
    console.log(`Last updated: ${updatedCharacter.updatedAt}`);
  }

  return result;
}

// Example: Type-safe access to nested properties
function processCharacterData(result: GetCharacterInventoryQuery) {
  const character = result.character;

  if (!character) {
    console.log("Character not found");
    return;
  }

  console.log(`Character: ${character.name} (ID: ${character.id})`);

  const inventory = character.inventory;
  if (inventory) {
    console.log(`Gold: ${inventory.gold}`);

    // TypeScript knows items is an array of Item objects
    const items = inventory.items;
    if (items && items.length > 0) {
      console.log("Items:");
      items.forEach((item) => {
        if (item) {
          console.log(`  - ${item.name} (x${item.quantity})`);
        }
      });
    }

    // TypeScript knows equipment is an array of Equipment objects
    const equipment = inventory.equipment;
    if (equipment && equipment.length > 0) {
      console.log("Equipment:");
      equipment.forEach((eq) => {
        if (eq) {
          const status = eq.equipped ? "equipped" : "unequipped";
          console.log(`  - ${eq.name} (${eq.slot}, ${status})`);
        }
      });
    }
  }
}

// Example: Using the generated SDK for even better type safety
import { createSdk } from "./generated/graphql.js";

// Create a typed SDK instance
const typedGraphQLService = createSdk(graphQLService);

// Now you can use the SDK with full type safety
async function useTypedSDK(characterId: string) {
  // This method is fully typed - TypeScript knows the exact return type
  const result = await typedGraphQLService.GetCharacterInventory({
    id: characterId,
  });

  // No more linting errors - TypeScript knows the exact structure
  const items = result.character?.inventory?.items;

  if (items) {
    items.forEach((item) => {
      if (item) {
        // TypeScript knows item has id, name, quantity, weight, and value
        console.log(`Item: ${item.name} (${item.quantity})`);
      }
    });
  }

  return result;
}

export {
  getCharacterInventory,
  updateCharacterGold,
  processCharacterData,
  useTypedSDK,
};
