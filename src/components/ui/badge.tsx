"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    ACTIVE: {
      text: "Active",
      styles: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    PENDING: {
      text: "Pending",
      styles: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    EXPIRED: {
      text: "Expired",
      styles: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    REJECTED: {
      text: "Rejected",
      styles: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border inline-block whitespace-nowrap", config.styles)}>
      {config.text}
    </span>
  );
}

interface TypeBadgeProps {
  type: string;
  value?: number | null;
}

export function TypeBadge({ type, value }: TypeBadgeProps) {
  let label = "";

  switch (type) {
    case "PERCENT":
      label = value ? `${value}% Off` : "% Discount";
      break;
    case "FIXED":
      label = value ? `$${value} Off` : "$ Discount";
      break;
    case "FREE_SHIPPING":
      label = "Free Shipping";
      break;
    case "BOGO":
      label = "BOGO Deal";
      break;
    default:
      label = "Promo Offer";
  }

  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#1C1F2A] text-violet-400 border border-violet-500/20 whitespace-nowrap inline-block">
      {label}
    </span>
  );
}
