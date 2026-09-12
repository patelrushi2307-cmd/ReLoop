import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserBySession } from '@/lib/server-store';

export async function GET() {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  return NextResponse.json({ user: user ?? null });
}
