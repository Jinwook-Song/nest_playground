import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Auth from './Auth';

const Login = () => {
  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    console.log(credentials);
  };
  return (
    <Auth submitLabel='Login' onSubmit={handleSubmit}>
      <Link to='/signup' style={{ textAlign: 'center' }}>
        <MuiLink component={Link} to='/signup'>
          Sign Up &rarr;
        </MuiLink>
      </Link>
    </Auth>
  );
};

export default Login;
