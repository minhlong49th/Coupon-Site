import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fmt = (n: number) => n.toLocaleString();

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getExpiryInfo(date: string | null): { text: string; className: string } {
  if (!date) return { text: "No expiry", className: "text-gray-500" };
  const daysLeft = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (daysLeft < 0)  return { text: "Expired",          className: "text-red-400" };
  if (daysLeft <= 7) return { text: `${daysLeft}d left`, className: "text-amber-400" };
  return {
    text: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    className: "text-gray-400",
  };
}

export function getTypeLabel(type: string, val: number | null): string {
  if (type === "PERCENT")    return `${val}% OFF`;
  if (type === "FIXED")      return `$${val} OFF`;
  if (type === "FREE_SHIPPING") return "FREE SHIP";
  if (type === "BOGO")       return "BOGO";
  return "DEAL";
}
