"use client";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary:   "bg-violet-600 hover:bg-violet-500 text-white",
  secondary: "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]",
  ghost:     "text-gray-400 hover:text-white hover:bg-white/[0.05]",
  danger:    "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20",
  success:   "bg-emerald-600 hover:bg-emerald-500 text-white",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </button>
  )
);
Button.displayName = "Button";
