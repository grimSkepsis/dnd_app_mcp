import { gql } from "graphql-tag";

// Example GraphQL queries using gql template literals
export const GET_CHARACTER_BASIC = gql`
  query GetCharacterBasic($id: ID!) {
    character(id: $id) {
      id
      name
      level
      class
      gold
    }
  }
`;

export const GET_CHARACTER_INVENTORY = gql`
  query GetCharacterInventory($id: ID!) {
    character(id: $id) {
      id
      name
      inventory {
        gold
        items {
          id
          name
          quantity
          weight
          value
        }
        equipment {
          id
          name
          slot
          equipped
        }
      }
    }
  }
`;

export const GET_CHARACTER_STATS = gql`
  query GetCharacterStats($id: ID!) {
    character(id: $id) {
      id
      name
      stats {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
      }
      skills {
        name
        modifier
        proficient
      }
    }
  }
`;

export const UPDATE_CHARACTER_GOLD = gql`
  mutation UpdateCharacterGold($id: ID!, $gold: Int!) {
    updateCharacterGold(id: $id, gold: $gold) {
      id
      gold
      updatedAt
    }
  }
`;

export const ADD_ITEM_TO_INVENTORY = gql`
  mutation AddItemToInventory(
    $characterId: ID!
    $itemId: ID!
    $quantity: Int!
  ) {
    addItemToInventory(
      characterId: $characterId
      itemId: $itemId
      quantity: $quantity
    ) {
      id
      inventory {
        items {
          id
          name
          quantity
        }
      }
    }
  }
`;

// You can also create dynamic queries by combining static parts
export const createCharacterQuery = (fields: string[]) => gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      ${fields.join("\n      ")}
    }
  }
`;

// Example usage of dynamic query creation
export const GET_CHARACTER_CUSTOM = (fields: string[]) => gql`
  query GetCharacterCustom($id: ID!) {
    character(id: $id) {
      ${fields.join("\n      ")}
    }
  }
`;
