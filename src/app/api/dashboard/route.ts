import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDashboardData, getUserBySession } from '@/lib/server-store';

export async function GET() {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  return NextResponse.json(getDashboardData(user.id));
}
