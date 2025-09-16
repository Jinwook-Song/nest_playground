import { useMutation } from '@apollo/client/react';
import { graphql } from '../gql';

const createMessageDocument = graphql(/* GraphQL */ `
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

const useCreateMessage = () => {
  return useMutation(createMessageDocument);
};

export { useCreateMessage };
