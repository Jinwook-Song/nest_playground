import { createBrowserRouter } from 'react-router-dom';
import Login from './auth/Login';
import SignUp from './auth/SignUp';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

export default router;
