import {
  ListboxOptions as HeadlessListboxOptions,
  ComboboxOptions as HeadlessComboBoxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import React from "react";

function ListboxOrComboboxOptions({
  type = "listbox",
  children,
  customWidth,
  lighter = false,
}: {
  type?: "listbox" | "combobox";
  children: React.ReactNode;
  customWidth?: string;
  lighter?: boolean;
}): React.ReactElement {
  const Element =
    type === "listbox" ? HeadlessListboxOptions : HeadlessComboBoxOptions;

  return (
    <Element
      transition
      anchor="bottom start"
      className={clsx(
        customWidth ??
          (type === "listbox"
            ? "w-[var(--button-width)]"
            : "w-[var(--input-width)]"),
        "z-9999 divide-y divide-zinc-200 overflow-auto rounded-md border border-zinc-200 dark:border-zinc-700",
        lighter ? "bg-zinc-50" : "bg-zinc-100",
        "text-base text-zinc-500 shadow-lg transition duration-100 ease-out",
        type === "listbox" ? "[--anchor-gap:12px]" : "[--anchor-gap:22px]",
        "empty:invisible focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:divide-zinc-700/50 dark:border-zinc-700 dark:bg-zinc-800"
      )}
    >
      {children}
    </Element>
  );
}

export default ListboxOrComboboxOptions;
