import { NextResponse } from 'next/server';
import { trackEventClick } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, id } = body;
    
    // In a real app, this would write to the database (e.g. incrementing a click count).
    // For our mock implementation, we update the in-memory mock data.
    await trackEventClick(type, id);
    console.log(`[Event Tracked] ${type}: ${id}`);
    
    return NextResponse.json({ success: true, tracked: { type, id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
