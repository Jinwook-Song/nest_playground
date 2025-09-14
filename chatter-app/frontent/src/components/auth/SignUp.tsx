import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Auth from './Auth';
import { useCreateUser } from '../../hooks/useCreateUser';
import { extractErrorMessage } from '../../utils/errors';
import { useLogin } from '../../hooks/useLogin';

const SignUp = () => {
  const [createUser, { error }] = useCreateUser();
  const { login } = useLogin();

  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await createUser({ variables: { createUserInput: { email, password } } });
    await login({ email, password });
  };

  return (
    <Auth
      submitLabel='Sign Up'
      onSubmit={handleSubmit}
      error={error === undefined ? undefined : extractErrorMessage(error)}
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
