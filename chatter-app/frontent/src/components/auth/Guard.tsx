import { useEffect } from 'react';
import PUBLIC_ROUTES from '../../constants/public-routes';
import { useGetMe } from '../../hooks/useGetMe';
import { authenticatedVar } from '../../constants/authenticated';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { snackVar } from '../../constants/snack';
import { UNKNOWN_ERROR_SNACK_MESSAGE } from '../../constants/errors';
import { usePath } from '../../hooks/usePath';

interface GuardProps {
  children: React.ReactNode;
}

const Guard = ({ children }: GuardProps) => {
  const { data: user, error } = useGetMe();
  usePath();

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  useEffect(() => {
    if (error && !CombinedGraphQLErrors.is(error)) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
    }
  }, [error]);

  return (
    <>
      {PUBLIC_ROUTES.includes(window.location.pathname)
        ? children
        : user && children}
    </>
  );
};

export default Guard;
