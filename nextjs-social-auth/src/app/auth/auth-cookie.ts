import { jwtDecode } from 'jwt-decode';

export const AUTH_COOKIE = 'Authentication';
export const REFRESH_COOKIE = 'Refresh';

export const getAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get('Set-Cookie');
  if (!setCookieHeader) {
    return;
  }
  const accessToken = setCookieHeader
    .split(';')
    .find((c) => c.includes(AUTH_COOKIE))
    ?.split('=')[1];

  const refreshToken = setCookieHeader
    .split(';')
    .find((c) => c.includes(REFRESH_COOKIE))
    ?.split('=')[1];

  return {
    accessToken: accessToken && {
      name: AUTH_COOKIE,
      value: accessToken,
      httpOnly: true,
      secure: true,
      expires: new Date(jwtDecode(accessToken).exp! * 1000),
    },
    refreshToken: refreshToken && {
      name: REFRESH_COOKIE,
      value: refreshToken,
      httpOnly: true,
      secure: true,
      expires: new Date(jwtDecode(refreshToken).exp! * 1000),
    },
  };
};
