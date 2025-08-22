import { gql } from "graphql-tag";

// This query will be used by GraphQL Code Generator to generate types
export const TRAIT_LISTING_QUERY = gql`
  query traitListing {
    items {
      getTraits {
        name
        description
      }
    }
  }
`;
