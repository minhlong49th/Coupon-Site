"use client";
import { useState, useCallback } from "react";

export function useCopyCode() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const trackClick = (id: string) => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'coupon_click', id })
    }).catch(console.error);
  };

  const copyCode = useCallback(async (id: string, code: string, affiliateUrl: string) => {
    trackClick(id);

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("input");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch (err) {}
      document.body.removeChild(el);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    setTimeout(() => window.open(affiliateUrl || "#", "_blank", "noopener,noreferrer"), 500);
  }, []);

  const openDeal = useCallback((id: string, affiliateUrl: string) => {
    trackClick(id);
    window.open(affiliateUrl || "#", "_blank", "noopener,noreferrer");
  }, []);

  return { copiedId, copyCode, openDeal };
}
