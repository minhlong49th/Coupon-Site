import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getMockStats } from "@/lib/mock-data";
import { Toaster } from "sonner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const stats = await getMockStats();
  return (
    <div className="flex h-screen bg-[#080B10] text-white overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar pendingCount={stats.moderation.pendingCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 w-52">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Quick search…" className="bg-transparent text-sm text-white placeholder-gray-600 outline-none flex-1"/>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}
