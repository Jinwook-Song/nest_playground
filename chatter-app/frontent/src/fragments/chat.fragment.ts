import { graphql } from '../gql';

export const chatFragment = graphql(/* GraphQL */ `
  fragment ChatFragment on Chat {
    _id
    name
    latestMessage {
      ...MessageFragment
    }
  }
`);
