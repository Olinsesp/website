import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return new TextEncoder().encode(secret);
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session');

  if (!token) {
    return NextResponse.json(
      { success: false, role: null, equipeId: null, equipeNome: null },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(token.value, getJwtSecret());
    return NextResponse.json({
      success: true,
      role: payload.role,
      equipeId: payload.equipeId,
      equipeNome: payload.equipeNome,
    });
  } catch {
    return NextResponse.json(
      { success: false, role: null, equipeId: null, equipeNome: null },
      { status: 401 },
    );
  }
}
