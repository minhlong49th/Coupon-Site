'use client';
export default function BrandPicker({ value, onChange }: any) {
  return (
    <div className="mt-6">
      <label className="block text-xs font-medium text-gray-400 mb-2">Đính kèm Brand</label>
      <div className="p-3 border border-dashed border-white/20 rounded-lg text-center text-sm text-gray-500 hover:border-violet-500 hover:text-violet-400 cursor-pointer">
        + Chọn Brand
      </div>
      <div className="mt-2 space-y-2">
        {value.map((v: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10 text-sm">
            <span>{v.brandId} {v.isPrimary && '(Primary)'}</span>
            <button onClick={() => onChange(value.filter((_: any, idx: number) => idx !== i))} className="text-red-400 hover:text-red-300">X</button>
          </div>
        ))}
      </div>
    </div>
  )
}
