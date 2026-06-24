"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",      label: "Dashboard",    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { href: "/admin/blog",       label: "Blog",         icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { href: "/admin/media",      label: "Media",        icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" },
];

export function AdminSidebar({ pendingCount = 0 }: { pendingCount?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`flex flex-col bg-[#0F1117] border-r border-white/[0.06] transition-all duration-200 flex-shrink-0 relative ${collapsed ? "w-16" : "w-56"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06] ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        {!collapsed && <span className="text-sm font-semibold text-white">CouponAdmin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href) && href !== "/admin" || (href === "/admin" && pathname === "/admin");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${collapsed ? "justify-center px-0" : ""} ${active ? "bg-violet-500/15 text-violet-400 font-medium" : "text-gray-400 hover:text-white hover:bg-white/[0.05]"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d={icon}/>
              </svg>
              {!collapsed && <span className="flex-1">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-[#1A1D26] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/>
        </svg>
      </button>

      {/* User */}
      <div className={`p-2 border-t border-white/[0.06] ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">A</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white">Admin</p><p className="text-xs text-gray-500">Super Admin</p></div>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">A</div>
        )}
      </div>
    </aside>
  );
}
