import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

function ListboxInputWrapper({
  value,
  onChange,
  multiple = false,
  className,
  children,
}: {
  value: string | string[] | null;
  onChange: (value: any) => void;
  multiple?: boolean;
  className?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Listbox
      as="div"
      className={clsx(
        "relative flex items-center gap-1 rounded-t-lg border-b-2 border-zinc-500 bg-zinc-200/50 shadow-custom transition-all hover:bg-zinc-200 data-open:border-lime-400! dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80",
        className
      )}
      multiple={multiple}
      value={value}
      onChange={onChange}
    >
      {children}
    </Listbox>
  );
}

export default ListboxInputWrapper;
