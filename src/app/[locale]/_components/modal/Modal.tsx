import React, { useEffect, useRef } from 'react';
import { CgClose } from 'react-icons/cg';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative z-50 w-[90%] max-w-3xl rounded-lg bg-white p-4 shadow-xl 
          transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-[18px] lg:text-[24px] font-[600] text-[#17181B]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="rounded-[4px] p-2 text-[#292D32] hover:bg-[#F4F5F6]"
          >
            <CgClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;