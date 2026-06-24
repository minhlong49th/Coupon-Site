'use client';
import { useState, useEffect } from 'react';

export default function CouponPicker({ value, onChange }: any) {
  // Mock for now
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">Đính kèm Coupon</label>
      <div className="p-3 border border-dashed border-white/20 rounded-lg text-center text-sm text-gray-500 hover:border-violet-500 hover:text-violet-400 cursor-pointer">
        + Chọn Coupon
      </div>
      <div className="mt-2 space-y-2">
        {value.map((v: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10 text-sm">
            <span>{v.couponId}</span>
            <button onClick={() => onChange(value.filter((_: any, idx: number) => idx !== i))} className="text-red-400 hover:text-red-300">X</button>
          </div>
        ))}
      </div>
    </div>
  )
}
