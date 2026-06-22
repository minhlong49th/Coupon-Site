"use client";

import React from "react";

interface TrackedLinkProps {
  href?: string;
  brandId?: string;
  couponId?: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedLink({ href, brandId, couponId, className, children }: TrackedLinkProps) {
  const handleClick = async () => {
    if (!href) return;
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, couponId, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      // Safe fallback if tracking endpoint doesn't exist
    }
  };

  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
