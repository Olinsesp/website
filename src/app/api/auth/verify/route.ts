import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session');

  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    verify(token.value, SECRET_KEY);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
