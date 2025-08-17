import { gql } from "graphql-tag";

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
