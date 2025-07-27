"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeInAnimation } from "@/utils/animations";
import { useOutsideClick } from "@/hooks";
import cn from "@/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  closeOnOutsideClick = true,
}: ModalProps) => {
  const modalOutsideClickRef = closeOnOutsideClick
    ? useOutsideClick<HTMLDivElement>(() => {
        if (isOpen) onClose();
      }, isOpen)
    : undefined;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-zinc-950/50 flex items-center justify-center p-4"
        {...fadeInAnimation()}
      >
        <div
          ref={modalOutsideClickRef}
          className={cn("box xs:gap-6 gap-5 xs:p-6 p-5 bg-default", className)}
        >
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
