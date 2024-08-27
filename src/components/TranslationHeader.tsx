/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useContext } from "react";
import { LocaleContext } from "../providers/LocaleProvider";

function TranslationHeader({
  item,
  collapseIcon,
}: {
  item: Record<string, any>;
  collapseIcon: React.ReactNode;
}): React.ReactElement {
  const { setRenameKeyModalOpen, locales, setLocales } =
    useContext(LocaleContext);

  function removeItem() {
    const newLocales = { ...locales };
    let current = newLocales;
    const keys = (item.id as string).split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current];
    }
    delete current[keys[keys.length - 1] as keyof typeof current];
    setLocales(newLocales);
  }

  return (
    <div className="flex items-center w-full justify-between font-medium text-xl bg-lime-300/20 text-lime-300 p-4 pl-4 rounded-md mb-2">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-lime-300 rounded-full" />
        <span>{item.text}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setRenameKeyModalOpen(item.text);
          }}
          className="hover:bg-lime-300/20 transition-all p-2 rounded-md"
        >
          <Icon icon="tabler:edit" className="cursor-pointer" />
        </button>
        <button
          onClick={removeItem}
          className="hover:bg-red-500/20 text-red-300 transition-all p-2 rounded-md"
        >
          <Icon icon="tabler:trash" className="cursor-pointer" />
        </button>
        {collapseIcon}
      </div>
    </div>
  );
}

export default TranslationHeader;
