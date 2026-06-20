"use client";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#1A1D26] border border-white/10 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-300 text-sm">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
