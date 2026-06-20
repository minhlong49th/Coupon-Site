import { NextResponse } from 'next/server';
import { deleteMockBrand } from '@/lib/mock-data';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const brandId = (await params).id;
    const deleted = await deleteMockBrand(brandId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
