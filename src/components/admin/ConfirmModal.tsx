"use client";

import React from "react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="confirm-modal-overlay">
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="bg-[#1A1D26] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-[#141720] border-t border-white/[0.04] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-650 hover:bg-red-700 text-white transition"
            id="modal-confirm-action"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
