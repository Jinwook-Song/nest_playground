import { useSubscription } from '@apollo/client/react';
import { graphql } from '../gql';
import type { SubscriptionMessageCreatedArgs } from '../gql/graphql';
import { updateMessages } from '../cache/messages';

const messageCreatedDocument = graphql(/* GraphQL */ `
  subscription messageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

const useMessageCreated = (variables: SubscriptionMessageCreatedArgs) => {
  return useSubscription(messageCreatedDocument, {
    variables,
    onData: ({ client, data }) => {
      if (data.data?.messageCreated) {
        updateMessages(client.cache, data.data.messageCreated);
      }
    },
  });
};

export { useMessageCreated };
