import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import type { User } from '../models/User';

interface CreateUserInput {
  createUserInput: {
    email: string;
    password: string;
  };
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      email
    }
  }
`;

const useCreateUser = () => {
  return useMutation<User, CreateUserInput>(CREATE_USER_MUTATION);
};

export { useCreateUser };
