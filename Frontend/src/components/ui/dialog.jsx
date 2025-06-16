import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/0.25"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative bg-white w-full max-w-2xl max-h-[90vh] p-6 rounded-lg shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => (
  <div className="h-full">{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="border-b pb-2 mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);
