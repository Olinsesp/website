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
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, getJwtSecret());

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-equipe-id', payload.id as string);
    requestHeaders.set('x-equipe-role', payload.role as string);
    requestHeaders.set('x-equipe-orgao', payload.orgaoDeOrigem as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware JWT verification error:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('session', '', { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: '/Dashboard/:path*',
};
