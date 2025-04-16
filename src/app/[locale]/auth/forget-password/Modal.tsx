import React from 'react';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;