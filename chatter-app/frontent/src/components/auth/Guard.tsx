import PUBLIC_ROUTES from '../../constants/public-routes';
import { useGetMe } from '../../hooks/useGetMe';

interface GuardProps {
  children: React.ReactNode;
}

const Guard = ({ children }: GuardProps) => {
  const { data: user } = useGetMe();

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
