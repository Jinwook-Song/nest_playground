import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Auth from './Auth';

const SignUp = () => {
  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    console.log(credentials);
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
