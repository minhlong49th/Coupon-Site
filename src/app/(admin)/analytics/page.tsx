import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics", robots: { index: false } };

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0">
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-6">
           <h3 className="text-gray-400 font-medium mb-6">Traffic Overview (placeholder)</h3>
           <div className="h-64 flex items-end gap-2 border-b border-l border-white/10 p-4">
              {[40, 70, 45, 90, 65, 120, 85].map((h, i) => (
                <div key={i} className="bg-violet-500/50 hover:bg-violet-500 w-full rounded-t-sm transition-colors relative group" style={{height: `${h}%`}}></div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-gray-500 mt-4 px-4">
             <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-6">
           <h3 className="text-gray-400 font-medium mb-6">Top Converting Brands (placeholder)</h3>
           <div className="space-y-4">
              {[ {n:'Nike', v:84}, {n:'Udemy', v:72}, {n:'Sephora', v:65}, {n:'Adidas', v:51} ].map(b => (
                 <div key={b.n}>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                       <span>{b.n}</span>
                       <span className="font-mono">{b.v}% CVR</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{width: `${b.v}%`}}></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
