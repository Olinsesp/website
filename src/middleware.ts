import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login') {
    return NextResponse.next();
  }
  if (
    pathname.toLowerCase().startsWith('/dashboard') &&
    !pathname.startsWith('/Dashboard')
  ) {
    const newPath = '/Dashboard' + pathname.substring('/dashboard'.length);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, getJwtSecret());

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-equipe-id', String(payload.id));
    requestHeaders.set('x-equipe-role', String(payload.role));
    requestHeaders.set('x-equipe-orgao', String(payload.orgaoDeOrigem));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('session', '', { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: [
    '/Dashboard/:path*',
    '/dashboard/:path*',
    '/Dashboard',
    '/dashboard',
  ],
};
