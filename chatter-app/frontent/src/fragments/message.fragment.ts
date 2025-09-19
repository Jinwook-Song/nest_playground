import { graphql } from '../gql';

export const messageFragment = graphql(/* GraphQL */ `
  fragment MessageFragment on Message {
    _id
    content
    createdAt
    chatId
    user {
      _id
      email
      username
    }
  }
`);
