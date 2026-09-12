import { NextRequest, NextResponse } from 'next/server';
import { getMaterials, getRecommendedMaterials } from '@/lib/server-store';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = getMaterials({
    category: params.get('category') ?? undefined,
    page: Number(params.get('page') ?? 1),
    search: params.get('search') ?? undefined,
    limit: Number(params.get('limit') ?? 15),
  });
  if (params.get('recommended') === 'true') return NextResponse.json({ data: getRecommendedMaterials() });
  return NextResponse.json(result);
}
