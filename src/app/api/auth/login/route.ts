import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    const token = sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } else {
    return NextResponse.json(
      { success: false, message: 'Senha inválida' },
      { status: 401 },
    );
  }
}
