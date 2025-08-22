import { GraphQLClient, RequestOptions } from 'graphql-request';
import { DocumentNode } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Inventory = {
  __typename?: 'Inventory';
  capacity: Scalars['Int']['output'];
  cp: Scalars['Int']['output'];
  gp: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pp: Scalars['Int']['output'];
  sp: Scalars['Int']['output'];
  uuid: Scalars['String']['output'];
};

export type InventoryCurrencyChangeInput = {
  cp: Scalars['Int']['input'];
  gp: Scalars['Int']['input'];
  pp: Scalars['Int']['input'];
  sp: Scalars['Int']['input'];
};

export type InventoryItem = {
  __typename?: 'InventoryItem';
  activationCost?: Maybe<Scalars['String']['output']>;
  bulk?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayBulk?: Maybe<Scalars['String']['output']>;
  displayValue?: Maybe<Scalars['String']['output']>;
  effect?: Maybe<Scalars['String']['output']>;
  isConsumable: Scalars['Boolean']['output'];
  level?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  traits?: Maybe<Array<Scalars['String']['output']>>;
  usageRequirements?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['ID']['output'];
  value?: Maybe<Scalars['Int']['output']>;
};

export type InventoryItemMutation = {
  __typename?: 'InventoryItemMutation';
  addOrRemoveItemsFromInventory: Scalars['Boolean']['output'];
  sellItems: Scalars['Boolean']['output'];
};


export type InventoryItemMutationAddOrRemoveItemsFromInventoryArgs = {
  inventoryId: Scalars['String']['input'];
  items: Array<InventoryItemQuantityAdjustmentParams>;
};


export type InventoryItemMutationSellItemsArgs = {
  inventoryId: Scalars['String']['input'];
  items: Array<InventoryItemQuantityAdjustmentParams>;
};

export type InventoryItemQuantityAdjustmentParams = {
  itemId: Scalars['String']['input'];
  quantityChange: Scalars['Int']['input'];
};

export type InventoryItemQuery = {
  __typename?: 'InventoryItemQuery';
  getInventoryItems?: Maybe<PaginatedInventoryItemResponse>;
};


export type InventoryItemQueryGetInventoryItemsArgs = {
  filter: ItemQueryFilter;
  inventoryId: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
  pageIndex: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type InventoryMutation = {
  __typename?: 'InventoryMutation';
  updateInventoryCurrency?: Maybe<Inventory>;
};


export type InventoryMutationUpdateInventoryCurrencyArgs = {
  inventoryId: Scalars['String']['input'];
  params: InventoryCurrencyChangeInput;
};

export type InventoryQuery = {
  __typename?: 'InventoryQuery';
  getChracterInventory?: Maybe<Inventory>;
  getInventories: PaginatedInventoryResponse;
  getInventory?: Maybe<Inventory>;
  getInventoryByOwner?: Maybe<Inventory>;
  getInventoryByOwnerName?: Maybe<Inventory>;
};


export type InventoryQueryGetChracterInventoryArgs = {
  id: Scalars['String']['input'];
};


export type InventoryQueryGetInventoryArgs = {
  id: Scalars['String']['input'];
};


export type InventoryQueryGetInventoryByOwnerArgs = {
  id: Scalars['String']['input'];
};


export type InventoryQueryGetInventoryByOwnerNameArgs = {
  nameTerm: Scalars['String']['input'];
};

export type InventoryWithItems = {
  __typename?: 'InventoryWithItems';
  inventory: Inventory;
  items: PaginatedInventoryItemResponse;
};

export type InventoryWithItemsQuery = {
  __typename?: 'InventoryWithItemsQuery';
  getInventoryWithItemsById?: Maybe<InventoryWithItems>;
  getInventoryWithItemsByOwnerName?: Maybe<InventoryWithItems>;
};


export type InventoryWithItemsQueryGetInventoryWithItemsByIdArgs = {
  filter: ItemQueryFilter;
  id: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
  pageIndex: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type InventoryWithItemsQueryGetInventoryWithItemsByOwnerNameArgs = {
  filter: ItemQueryFilter;
  nameTerm: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
  pageIndex: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type Item = {
  __typename?: 'Item';
  activationCost?: Maybe<Scalars['String']['output']>;
  bulk?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayBulk?: Maybe<Scalars['String']['output']>;
  displayValue?: Maybe<Scalars['String']['output']>;
  effect?: Maybe<Scalars['String']['output']>;
  isConsumable: Scalars['Boolean']['output'];
  level?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  traits?: Maybe<Array<Scalars['String']['output']>>;
  usageRequirements?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['ID']['output'];
  value?: Maybe<Scalars['Int']['output']>;
};

export type ItemMutation = {
  __typename?: 'ItemMutation';
  createItem?: Maybe<Item>;
  updateItem?: Maybe<Item>;
};


export type ItemMutationCreateItemArgs = {
  params: ItemProperties;
};


export type ItemMutationUpdateItemArgs = {
  itemUuid: Scalars['String']['input'];
  params: ItemProperties;
};

export type ItemProperties = {
  activationCost?: InputMaybe<Scalars['String']['input']>;
  bulk?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  effect?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  traits?: InputMaybe<Array<Scalars['String']['input']>>;
  usageRequirements?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type ItemQuery = {
  __typename?: 'ItemQuery';
  getItem?: Maybe<Item>;
  getItems?: Maybe<PaginatedItemResponse>;
  getTraits: Array<Trait>;
};


export type ItemQueryGetItemArgs = {
  id: Scalars['String']['input'];
};


export type ItemQueryGetItemsArgs = {
  filter: ItemQueryFilter;
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
  pageIndex: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type ItemQueryFilter = {
  excludedTraits?: InputMaybe<Array<Scalars['String']['input']>>;
  includedTraits?: InputMaybe<Array<Scalars['String']['input']>>;
  searchValue?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  inventory: InventoryMutation;
  inventoryItems: InventoryItemMutation;
  items: ItemMutation;
};

export type PaginatedInventoryItemResponse = {
  __typename?: 'PaginatedInventoryItemResponse';
  entities: Array<InventoryItem>;
  pageIndex: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalEntities: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedInventoryResponse = {
  __typename?: 'PaginatedInventoryResponse';
  entities: Array<Inventory>;
  pageIndex: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalEntities: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedItemResponse = {
  __typename?: 'PaginatedItemResponse';
  entities: Array<Item>;
  pageIndex: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalEntities: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  inventory: InventoryQuery;
  inventoryItems: InventoryItemQuery;
  inventoryWithItems: InventoryWithItemsQuery;
  items: ItemQuery;
};

export type Trait = {
  __typename?: 'Trait';
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type TraitListingQueryVariables = Exact<{ [key: string]: never; }>;


export type TraitListingQuery = { __typename?: 'QueryRoot', items: { __typename?: 'ItemQuery', getTraits: Array<{ __typename?: 'Trait', name: string, description?: string | null }> } };


export const TraitListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"traitListing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTraits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    traitListing(variables?: TraitListingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TraitListingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TraitListingQuery>({ document: TraitListingDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'traitListing', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;