import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/server-store';

export async function GET() {
  return NextResponse.json({ data: getCategories() });
}
