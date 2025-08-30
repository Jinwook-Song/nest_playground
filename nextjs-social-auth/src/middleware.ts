import {
  AUTH_COOKIE,
  getAuthCookie,
  REFRESH_COOKIE,
} from '@/app/auth/auth-cookie';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login', '/auth/register'];

export async function middleware(req: NextRequest) {
  const authenticated = !!(await cookies()).get(AUTH_COOKIE)?.value;

  if (!authenticated && (await cookies()).get(REFRESH_COOKIE)) {
    const refreshResponse = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    const authCookies = getAuthCookie(refreshResponse);
    if (authCookies?.accessToken) {
      const response = NextResponse.redirect(req.url);
      response.cookies.set(authCookies.accessToken);
      return response;
    }
  }

  if (
    !authenticated &&
    !publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return Response.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
