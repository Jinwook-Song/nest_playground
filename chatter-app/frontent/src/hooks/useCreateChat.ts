import { useMutation } from '@apollo/client/react';
import { graphql } from '../gql';

const createChatDocument = graphql(/* GraphQL */ `
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      ...ChatFragment
    }
  }
`);

const useCreateChat = () => {
  return useMutation(createChatDocument);
};

export { useCreateChat };
