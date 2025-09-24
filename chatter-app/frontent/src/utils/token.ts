const TOKEN_KEY = 'token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? `Bearer ${token}` : '';
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
