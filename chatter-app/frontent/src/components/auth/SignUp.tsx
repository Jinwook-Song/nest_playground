import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Auth from './Auth';
import { useCreateUser } from '../../hooks/useCreateUser';

const SignUp = () => {
  const [createUser] = useCreateUser();

  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    await createUser({
      variables: {
        createUserInput: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    });
  };

  return (
    <Auth submitLabel='Sign Up' onSubmit={handleSubmit}>
      <Link to='/login' style={{ textAlign: 'center' }}>
        <MuiLink component={Link} to='/login'>
          Login &rarr;
        </MuiLink>
      </Link>
    </Auth>
  );
};

export default SignUp;
