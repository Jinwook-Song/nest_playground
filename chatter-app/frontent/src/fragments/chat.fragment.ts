import { graphql } from '../gql';

graphql(/* GraphQL */ `
  fragment ChatFragment on Chat {
    _id
    name
    isPrivate
    userIds
    userId
  }
`);
