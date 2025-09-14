import { useEffect } from 'react';
import PUBLIC_ROUTES from '../../constants/public-routes';
import { useGetMe } from '../../hooks/useGetMe';
import { authenticatedVar } from '../../constants/authenticated';

interface GuardProps {
  children: React.ReactNode;
}

const Guard = ({ children }: GuardProps) => {
  const { data: user } = useGetMe();

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  console.log('user', user);

  return (
    <>
      {PUBLIC_ROUTES.includes(window.location.pathname)
        ? children
        : user && children}
    </>
  );
};

export default Guard;
