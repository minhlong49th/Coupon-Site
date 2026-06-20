"use client";

export function ClientImage({ src, alt, className, containerClassName, fallbackClassName, fallbackText }: { src: string, alt: string, className?: string, containerClassName?: string, fallbackClassName?: string, fallbackText: string }) {
  return (
    <div className={containerClassName}>
      <img 
        src={src} 
        className={className} 
        alt={alt} 
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className={`hidden ${fallbackClassName || ""}`}>
        {fallbackText}
      </div>
    </div>
  );
}
