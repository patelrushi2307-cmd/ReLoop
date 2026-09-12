import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrderImpact, getOrders, getUserBySession } from '@/lib/server-store';

export async function GET() {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  return NextResponse.json({ data: getOrders(user.id) });
}

export async function POST(request: NextRequest) {
  const user = getUserBySession(cookies().get('reloop_session')?.value);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const body = await request.json();
  const productId = String(body.productId);
  const quantity = Number(body.quantity);
  const impact = getOrderImpact(productId, quantity, user);
  if (!impact) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  if (impact.netEmissions <= 0) {
    return NextResponse.json({
      error: 'This shipment would create more transport emissions than it avoids. Increase the quantity to make the order climate-positive.',
      impact,
    }, { status: 422 });
  }
  const order = createOrder({ productId, quantity }, user);
  if (!order) return NextResponse.json({ error: 'Product is unavailable or quantity is below the minimum order' }, { status: 400 });
  return NextResponse.json({ data: order }, { status: 201 });
}