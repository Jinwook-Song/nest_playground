import { getToken } from './token';

export const fetchWithToken = async (
  input: RequestInfo,
  init: RequestInit = {},
) =>
  fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      authorization: getToken(),
    },
  });
