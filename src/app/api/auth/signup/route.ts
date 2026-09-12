import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  const result = signup(await request.json());
  if (!result) return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  const response = NextResponse.json({ user: result.user }, { status: 201 });
  response.cookies.set('reloop_session', result.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' });
  return response;
}
