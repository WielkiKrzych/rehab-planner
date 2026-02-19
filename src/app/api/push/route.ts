import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

const pushSubscriptions: Map<string, webpush.PushSubscription> = new Map();

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const subscription = await request.json();
    
    pushSubscriptions.set(subscription.endpoint, subscription as webpush.PushSubscription);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint) {
      pushSubscriptions.delete(endpoint);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscription error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  return NextResponse.json({ 
    publicKey: process.env.VAPID_PUBLIC_KEY || '' 
  });
}

export async function sendPushNotification(title: string, body: string, url?: string) {
  const payload = JSON.stringify({ title, body, url });
  
  for (const subscription of pushSubscriptions.values()) {
    try {
      await webpush.sendNotification(subscription, payload);
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }
}
