import { API_URL } from '../constants/urls';
import { onLogout } from '../utils/logout';

const useLogout = () => {
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
        throw new Error('Failed to logout');
      }
      onLogout();
    } catch (error) {
      throw error;
    }
  };

  return { logout };
};

export { useLogout };
