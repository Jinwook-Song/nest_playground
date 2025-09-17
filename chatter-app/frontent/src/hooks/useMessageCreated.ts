import { useSubscription } from '@apollo/client/react';
import { graphql } from '../gql';
import type { SubscriptionMessageCreatedArgs } from '../gql/graphql';

const messageCreatedDocument = graphql(/* GraphQL */ `
  subscription messageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

const useMessageCreated = (variables: SubscriptionMessageCreatedArgs) => {
  return useSubscription(messageCreatedDocument, { variables });
};

export { useMessageCreated };
