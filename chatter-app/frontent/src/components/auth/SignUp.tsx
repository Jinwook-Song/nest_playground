import { Link } from 'react-router-dom';
import { Link as MuiLink, TextField } from '@mui/material';
import Auth from './Auth';
import { useCreateUser } from '../../hooks/useCreateUser';
import { extractErrorMessage } from '../../utils/errors';
import { useLogin } from '../../hooks/useLogin';
import { useState } from 'react';

const SignUp = () => {
  const [createUser, { error }] = useCreateUser();
  const [username, setUsername] = useState('');
  const { login } = useLogin();

  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await createUser({
      variables: { createUserInput: { email, username, password } },
    });
    await login({ email, password });
  };

  return (
    <Auth
      submitLabel='Sign Up'
      onSubmit={handleSubmit}
      error={error === undefined ? undefined : extractErrorMessage(error)}
      extraFields={[
        <TextField
          type='text'
          label='Username'
          variant='outlined'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!error}
          helperText={
            error === undefined ? undefined : extractErrorMessage(error)
          }
        />,
      ]}
    >
      <Link to='/login' style={{ textAlign: 'center' }}>
        <MuiLink component={Link} to='/login'>
          Login &rarr;
        </MuiLink>
      </Link>
    </Auth>
  );
};

export default SignUp;
