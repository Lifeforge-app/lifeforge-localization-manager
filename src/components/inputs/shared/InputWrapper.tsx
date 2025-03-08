import clsx from "clsx";
import React from "react";

function InputWrapper({
  darker = false,
  className = "",
  disabled = false,
  inputRef,
  children,
}: {
  darker?: boolean;
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  children: React.ReactNode;
}): React.ReactElement {
  const componentBgWithHover =
    "bg-zinc-50/50 dark:bg-zinc-900 dark:hover:bg-zinc-800/70 hover:bg-zinc-200/50 transition-all";

  const componentBgLighterWithHover =
    "bg-zinc-100/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80 hover:bg-zinc-200/50 transition-all";

  function focusInput(e: React.MouseEvent | React.FocusEvent) {
    if ((e.target as HTMLElement).tagName === "BUTTON") {
      return;
    }

    if (inputRef?.current !== undefined && inputRef.current !== null) {
      inputRef.current.focus();
      if ((e.target as HTMLElement).tagName !== "INPUT") {
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length
        );
      }
    }
  }

  return (
    <div
      className={clsx(
        "group relative flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 border-zinc-500 bg-zinc-200/50 pl-6 shadow-custom transition-all focus-within:border-lime-400! hover:bg-zinc-200",
        darker ? componentBgLighterWithHover : componentBgWithHover,
        className,
        disabled ? "pointer-events-none! opacity-50" : "cursor-text"
      )}
      role="button"
      tabIndex={0}
      onClick={focusInput}
      onFocus={focusInput}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (inputRef?.current !== undefined && inputRef.current !== null) {
            inputRef.current.focus();
          }
        }
      }}
    >
      {children}
    </div>
  );
}

export default InputWrapper;
