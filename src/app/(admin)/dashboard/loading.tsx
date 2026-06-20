export default function DashboardLoading() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5 h-28" />
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-[#0F1117] border border-white/[0.06] rounded-xl h-64" />
        <div className="lg:col-span-2 bg-[#0F1117] border border-white/[0.06] rounded-xl h-64" />
      </div>
    </div>
  );
}
