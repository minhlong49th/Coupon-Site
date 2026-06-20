import { NextResponse } from 'next/server';
import { deleteMockCoupon } from '@/lib/mock-data';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const couponId = (await params).id;
    const deleted = await deleteMockCoupon(couponId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
