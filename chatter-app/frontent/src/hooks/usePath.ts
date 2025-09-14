import { useEffect, useState } from 'react';
import router from '../components/Routes';

const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    router.subscribe((location) => {
      setPath(location.location.pathname);
    });
  });

  return { path, isHome: path === '/' };
};

export { usePath };
