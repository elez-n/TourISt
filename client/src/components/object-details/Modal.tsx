import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        className="
    relative
    bg-white
    w-full
    max-w-4xl
    max-h-[90vh]
    rounded-2xl
    shadow-2xl
    overflow-hidden
  "
      >
        <div className="p-6 overflow-y-auto max-h-[90vh]">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-semibold"
          >
            ✕
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};
