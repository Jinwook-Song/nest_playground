import { useMutation } from '@apollo/client/react';
import { graphql } from '../gql';
import { getMessagesDocument } from './useGetMessages';

const createMessageDocument = graphql(/* GraphQL */ `
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

const useCreateMessage = (chatId: string) => {
  return useMutation(createMessageDocument, {
    update: (cache, { data }) => {
      const messagesQueryOptions = {
        query: getMessagesDocument,
        variables: { chatId },
      };
      const messages = cache.readQuery({
        ...messagesQueryOptions,
      });
      if (!data?.createMessage) return;

      cache.writeQuery({
        ...messagesQueryOptions,
        data: {
          messages:
            messages === null
              ? [data?.createMessage]
              : messages?.messages.concat(data?.createMessage),
        },
      });
    },
  });
};

export { useCreateMessage };
