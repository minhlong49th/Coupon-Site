import { NextResponse } from 'next/server';
import { deleteMockCoupon, updateMockCouponStatus } from '@/lib/mock-data';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const couponId = params.id;
    const deleted = await deleteMockCoupon(couponId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const couponId = params.id;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Missing status parameter" }, { status: 400 });
    }

    const updated = await updateMockCouponStatus(couponId, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
