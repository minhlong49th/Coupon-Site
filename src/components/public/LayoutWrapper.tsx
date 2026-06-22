"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  categoryNav: React.ReactNode;
  footer: React.ReactNode;
}

export function LayoutWrapper({
  children,
  header,
  categoryNav,
  footer,
}: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 min-w-0 flex flex-col">{children}</main>;
  }

  return (
    <>
      {header}
      {categoryNav}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      {footer}
    </>
  );
}
