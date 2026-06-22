"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SubmitFormContainer } from "./SubmitFormContainer";
import type { Brand } from "@/types";

interface SubmitModalProps {
  onClose: () => void;
  brands: Omit<Brand, "createdAt" | "updatedAt">[];
}

export function SubmitModal({ onClose, brands }: SubmitModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-905">Submit Coupon Code</h3>
              <p className="text-xs text-gray-500">Share discounts with thousands of users</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              id="close-submit-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto">
            <SubmitFormContainer brands={brands} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
