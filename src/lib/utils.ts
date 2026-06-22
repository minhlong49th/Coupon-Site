import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTypeLabel(type: string, value: number | null | undefined): string {
  const numValue = value !== null && value !== undefined ? Number(value) : 0;
  switch (type) {
    case "PERCENT":
      return numValue ? `${numValue}% OFF` : "Discount";
    case "FIXED":
      return numValue ? `$${numValue} OFF` : "Discount";
    case "FREE_SHIPPING":
      return "Free Shipping";
    default:
      return "Promo Offer";
  }
}

export function fmt(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  return Number(value).toLocaleString();
}

export function timeAgo(dateString: string | Date | null | undefined): string {
  if (!dateString) return "Just now";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (isNaN(diffMs)) return "Just now";
  
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}


export function getExpiryInfo(expiresAt: string | null | undefined): { text: string; className: string } {
  if (!expiresAt) {
    return { text: "No Expiry", className: "bg-gray-150/40 text-gray-500 border border-gray-200/50" };
  }
  
  const expDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { text: "Expired", className: "bg-red-50 text-red-700 border border-red-250/40" };
  }
  
  if (diffDays === 1) {
    return { text: "Expires Tomorrow", className: "bg-amber-50 text-amber-700 border border-amber-250/40" };
  }
  
  if (diffDays <= 3) {
    return { text: `Expires in ${diffDays} days`, className: "bg-amber-50 text-amber-755 border border-amber-250/30" };
  }
  
  return { text: `Expires in ${diffDays} days`, className: "bg-emerald-50 text-emerald-700 border border-emerald-150/40" };
}
