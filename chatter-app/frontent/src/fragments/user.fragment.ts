import { graphql } from '../gql';

export const userFragment = graphql(/* GraphQL */ `
  fragment UserFragment on User {
    _id
    email
    username
    imageUrl
  }
`);
