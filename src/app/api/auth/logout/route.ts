import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logout } from '@/lib/server-store';

export async function POST() {
  logout(cookies().get('reloop_session')?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.set('reloop_session', '', { expires: new Date(0), path: '/' });
  return response;
}
