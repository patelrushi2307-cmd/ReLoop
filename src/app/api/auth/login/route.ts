import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = login(String(body.email ?? ''), String(body.password ?? ''));
  if (!result) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  const response = NextResponse.json({ user: result.user });
  response.cookies.set('reloop_session', result.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' });
  return response;
}
