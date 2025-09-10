import { createBrowserRouter } from 'react-router-dom';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Home from '../home/Home';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/',
    element: <Home />,
  },
]);

export default router;
