import { Combobox } from "@headlessui/react";
import React from "react";

function ComboboxInputWrapper({
  value,
  onChange,
  setQuery,
  children,
}: {
  value: string | string[] | undefined;
  onChange: (value: any) => void;
  setQuery: (query: string) => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Combobox
      as="div"
      className="relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-zinc-500 bg-zinc-200/50 pl-6 shadow-custom transition-all hover:bg-zinc-200 data-open:border-lime-400! dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80"
      value={value}
      onChange={onChange}
      onClose={() => {
        setQuery("");
      }}
    >
      {children}
    </Combobox>
  );
}

export default ComboboxInputWrapper;
