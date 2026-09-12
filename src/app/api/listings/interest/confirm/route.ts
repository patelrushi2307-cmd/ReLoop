import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { confirmBuyerInterest, getUserBySession } from '@/lib/server-store';

export async function POST(request: NextRequest) {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { productId } = await request.json();
  const order = confirmBuyerInterest(String(productId), user);
  if (!order) return NextResponse.json({ error: 'Buyer interest is unavailable or already confirmed' }, { status: 409 });
  return NextResponse.json({ data: order }, { status: 201 });
}