"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { href: "/coupons",    label: "Coupons",      icon: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" },
  { href: "/brands",     label: "Brands",       icon: "M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" },
  { href: "/moderation", label: "Moderation",   icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", badge: true },
  { href: "/analytics",  label: "Analytics",    icon: "M18 20V10 M12 20V4 M6 20v-6" },
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
        {NAV.map(({ href, label, icon, badge }) => {
          const active = pathname.startsWith(href);
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
              {!collapsed && badge && pendingCount > 0 && (
                <span className="ml-auto text-xs bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingCount}
                </span>
              )}
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
