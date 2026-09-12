import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/server-store';

export async function GET(_request: Request, { params }: { params: { identifier: string } }) {
  const order = getOrder(params.identifier);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ data: order });
}
