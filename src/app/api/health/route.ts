import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, service: 'reloop-3d-api', timestamp: new Date().toISOString() });
}
