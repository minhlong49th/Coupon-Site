"use client";

import { ReactNode } from "react";

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  brandId: string;
  eventType?: string;
  children: ReactNode;
}

export function TrackedLink({ href, brandId, eventType = 'visit_store', children, className, ...props }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Fire tracking event asynchronously
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: eventType, id: brandId })
    }).catch(console.error);
    
    if (props.onClick) {
      props.onClick(e as any);
    }
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="sponsored nofollow noopener noreferrer" 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
