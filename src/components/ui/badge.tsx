import { cn } from "@/lib/utils";
import type { CouponStatus } from "@/types";

const statusStyles: Record<CouponStatus, string> = {
  ACTIVE:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  EXPIRED:  "bg-gray-500/15 text-gray-400 border-gray-500/20",
  PENDING:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
};

export function StatusBadge({ status }: { status: CouponStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
      statusStyles[status]
    )}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function TypeBadge({ type, value }: { type: string; value: number | null }) {
  const label = type === "PERCENT" ? `${value}% OFF`
    : type === "FIXED" ? `$${value} OFF`
    : type === "FREE_SHIPPING" ? "FREE SHIP"
    : type === "BOGO" ? "BOGO" : "DEAL";
  return (
    <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20">
      {label}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full", className)}>
      {children}
    </span>
  );
}
