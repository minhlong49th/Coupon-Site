"use client";

import { useState } from "react";
import { SubmitModal } from "@/components/public/SubmitModal";
import type { Brand } from "@/types";

interface SubmitCodeButtonProps {
  brandName: string;
  brandId: string;
  brands: Omit<Brand, "createdAt" | "updatedAt">[];
}

export function SubmitCodeButton({ brandName, brandId, brands }: SubmitCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-violet-600 text-white rounded-lg py-2.5 font-bold hover:bg-violet-700 transition"
      >
        Submit Code
      </button>

      {isOpen && (
        <SubmitModal 
          onClose={() => setIsOpen(false)} 
          brands={brands} 
        />
      )}
    </>
  );
}
