import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import type { ChatQueryVariables } from '../gql/graphql';

const getChatDocument = graphql(/* GraphQL */ `
  query Chat($_id: String!) {
    chat(_id: $_id) {
      ...ChatFragment
    }
  }
`);

const useGetChat = (variables: ChatQueryVariables) => {
  return useQuery(getChatDocument, { variables });
};

export { useGetChat };
