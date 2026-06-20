"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    toast.error("A database or server error occurred", {
      description: error.message || "Please try again later.",
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0F1117] border border-white/[0.06] rounded-xl p-8 text-center max-w-2xl mx-auto mt-12">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        We encountered an error while communicating with the database. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
