import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/server-store';

export async function GET() {
  const data = getNotifications();
  return NextResponse.json({ data, unreadCount: data.filter((item) => !item.read).length });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const data = body.all ? markAllNotificationsRead() : body.id ? [markNotificationRead(String(body.id))].filter(Boolean) : null;
  if (!data) return NextResponse.json({ error: 'id or all is required' }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const input = await request.json();
  const notification = {
    ...input,
    id: `notif_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  getNotifications().unshift(notification);
  return NextResponse.json({ data: notification }, { status: 201 });
}
