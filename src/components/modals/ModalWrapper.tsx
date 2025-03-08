import clsx from "clsx";
import React, { useEffect, useState } from "react";

function ModalWrapper({
  isOpen,
  children,
  minWidth,
  minHeight,
  maxWidth,
  className,
  modalRef,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  className?: string;
  modalRef?: React.RefObject<HTMLDivElement>;
}): React.ReactElement {
  const [innerIsOpen, setInnerIsOpen] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (!isOpen && !firstTime) {
      setTimeout(() => {
        setInnerIsOpen(false);
      }, 500);
    } else {
      setInnerIsOpen(true);
    }
    setFirstTime(false);
  }, [isOpen, setInnerIsOpen, firstTime]);

  return (
    <div
      ref={modalRef}
      className={clsx(
        "fixed left-0 top-0 h-dvh w-full overscroll-contain bg-black/10 backdrop-blur-xs transition-opacity ease-linear dark:bg-zinc-950/40",
        isOpen
          ? "z-9990 opacity-100"
          : "z-[-1] opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]"
      )}
    >
      <div
        className={clsx(
          "absolute top-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] -translate-y-1/2 translate-x-1/2 flex-col overflow-auto rounded-xl bg-zinc-100 p-6 shadow-2xl transition-all duration-500 dark:bg-zinc-900 sm:max-w-[calc(100vw-8rem)] lg:w-auto",
          isOpen ? "right-1/2" : "right-[-100dvw]",
          className
        )}
        style={{
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth,
        }}
      >
        {innerIsOpen && children}
      </div>
    </div>
  );
}

export default ModalWrapper;
