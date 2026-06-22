"use client";
import { useState, useEffect, useRef } from "react";

export function ClientImage({ 
  src, 
  alt, 
  className, 
  containerClassName, 
  fallbackClassName, 
  fallbackText 
}: { 
  src: string, 
  alt: string, 
  className?: string, 
  containerClassName?: string, 
  fallbackClassName?: string, 
  fallbackText: string 
}) {
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth === 0) {
        setImageError(true);
      }
    }
  }, [mounted, src]);

  // Reset error if src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  return (
    <div className={containerClassName}>
      {(!mounted || !src || imageError) ? (
        <div className={fallbackClassName}>
          {fallbackText}
        </div>
      ) : (
        <img 
          ref={imgRef}
          src={src} 
          className={className} 
          alt={alt} 
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
