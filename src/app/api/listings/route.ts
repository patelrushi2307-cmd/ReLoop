import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createProduct, getUserBySession } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const input = await request.json();
  const product = createProduct(input, user);
  return NextResponse.json({ data: product }, { status: 201 });
}
