import { useState } from 'react';
import { API_URL } from '../constants/urls';
import client from '../constants/apollo-client';
import { onLogout } from '../utils/logout';

const useLogout = () => {
  const [error, setError] = useState('');

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid credentials');
        } else {
          setError('Unknown error occurred');
        }
        return;
      }
      setError('');
      await client.refetchQueries({ include: 'active' });
      onLogout();
    } catch (error) {
      setError('Unknown error occurred');
    }
  };

  return { logout, error };
};

export { useLogout };
