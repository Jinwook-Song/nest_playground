import { useMutation } from '@apollo/client/react';
import { graphql } from '../gql';

const createChatDocument = graphql(/* GraphQL */ `
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      _id
      userId
      isPrivate
      name
      userIds
    }
  }
`);

const useCreateChat = () => {
  return useMutation(createChatDocument);
};

export { useCreateChat };
