import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import type { QueryChatsArgs } from '../gql/graphql';

export const getChatsDocument = graphql(/* GraphQL */ `
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFragment
    }
  }
`);

const useGetChats = (variables: QueryChatsArgs) => {
  return useQuery(getChatsDocument, { variables });
};

export { useGetChats };
