import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Auth from './Auth';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const { login, error } = useLogin();

  return (
    <Auth submitLabel='Login' onSubmit={login} error={error}>
      <Link to='/signup' style={{ textAlign: 'center' }}>
        <MuiLink component={Link} to='/signup'>
          Sign Up &rarr;
        </MuiLink>
      </Link>
    </Auth>
  );
};

export default Login;
