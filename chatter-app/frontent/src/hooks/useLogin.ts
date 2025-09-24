import { useState } from 'react';
import { API_URL } from '../constants/urls';
import client from '../constants/apollo-client';
import { UNKNOWN_ERROR_MESSAGE } from '../constants/errors';
import { setToken } from '../utils/token';
import { fetchWithToken } from '../utils/fetch';

interface LoginRequest {
  email: string;
  password: string;
}

const useLogin = () => {
  const [error, setError] = useState('');

  const login = async (loginRequest: LoginRequest) => {
    try {
      const res = await fetchWithToken(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함하여 요청
        body: JSON.stringify(loginRequest),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid credentials');
        } else {
          setError(UNKNOWN_ERROR_MESSAGE);
        }
        return;
      }
      setToken(await res.text());
      setError('');
      await client.refetchQueries({ include: 'active' });
    } catch (error) {
      setError(UNKNOWN_ERROR_MESSAGE);
    }
  };

  return { login, error };
};

export { useLogin };
