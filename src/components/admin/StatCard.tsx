import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  accent?: "violet" | "green" | "amber" | "red" | "blue";
  trend?: { value: number; label: string };
}

const accentMap = {
  violet: "text-violet-400 bg-violet-500/10",
  green:  "text-emerald-400 bg-emerald-500/10",
  amber:  "text-amber-400 bg-amber-500/10",
  red:    "text-red-400 bg-red-500/10",
  blue:   "text-blue-400 bg-blue-500/10",
};

export function StatCard({ label, value, sub, icon, accent = "violet", trend }: StatCardProps) {
  return (
    <div className="bg-[#0F1117] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        {icon && (
          <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentMap[accent])}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      {trend && (
        <p className={cn("text-xs mt-2 font-medium", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
