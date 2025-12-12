import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return new TextEncoder().encode(secret);
};

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();

    const jwt = await new SignJWT({
      id: user.id,
      role: user.role,
      orgaoDeOrigem: user.orgaoDeOrigem,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(getJwtSecret());

    cookieStore.set('session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
