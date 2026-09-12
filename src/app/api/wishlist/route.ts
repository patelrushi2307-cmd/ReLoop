import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addWishlistItem, getProduct, getUserBySession, getWishlist, removeWishlistItem } from '@/lib/server-store';

function userId() {
  return getUserBySession(cookies().get('reloop_session')?.value)?.id;
}

export async function GET() {
  const id = userId();
  if (!id) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const items = getWishlist(id);
  return NextResponse.json({ data: items, products: items.map((item) => getProduct(item.productId)).filter(Boolean) });
}

export async function POST(request: NextRequest) {
  const id = userId();
  if (!id) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { productId } = await request.json();
  const items = addWishlistItem(id, String(productId));
  if (!items) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ data: items }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = userId();
  if (!id) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  return NextResponse.json({ data: removeWishlistItem(id, productId) });
}
