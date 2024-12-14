import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  motionProps?: {
    variants?: {
      enter: object;
      exit: object;
    };
    transition?: object;
  };
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  motionProps = {
    variants: {
      enter: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    transition: { duration: 0.3 }
  }
}: ModalProps) => {
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={motionProps.variants?.enter}
            exit={motionProps.variants?.exit}
            transition={motionProps.transition}
            className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
