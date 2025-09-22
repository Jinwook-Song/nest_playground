import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';

const getMeDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      ...UserFragment
    }
  }
`);

const useGetMe = () => {
  return useQuery(getMeDocument);
};

export { useGetMe };
