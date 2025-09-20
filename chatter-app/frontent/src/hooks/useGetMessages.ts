import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import type { MessagesQueryVariables } from '../gql/graphql';

export const getMessagesDocument = graphql(/* GraphQL */ `
  query Messages($chatId: String!, $skip: Int!, $limit: Int!) {
    messages(chatId: $chatId, skip: $skip, limit: $limit) {
      ...MessageFragment
    }
  }
`);

const useGetMessages = (variables: MessagesQueryVariables) => {
  return useQuery(getMessagesDocument, { variables });
};

export { useGetMessages };
