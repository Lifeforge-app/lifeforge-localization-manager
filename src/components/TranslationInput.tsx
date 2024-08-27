/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "../providers/LocaleProvider";
import { Icon } from "@iconify/react/dist/iconify.js";

function TranslationInput({ item }: { item: Record<string, any> }) {
  const { locales, setLocales, setRenameKeyModalOpen } =
    useContext(LocaleContext);
  const [innerContent, setInnerContent] = useState<string>(item.value);

  const commitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocales = { ...locales };
    let current = newLocales;
    const keys = (item.id as string).split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current];
    }
    current[keys[keys.length - 1] as keyof typeof current] = e.target.value;
    setLocales(newLocales);
  };

  const removeItem = () => {
    const newLocales = { ...locales };
    let current = newLocales;
    const keys = (item.id as string).split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current];
    }
    delete current[keys[keys.length - 1] as keyof typeof current];
    setLocales(newLocales);
  };

  useEffect(() => {
    setInnerContent(item.value);
  }, [item.value]);

  return (
    <div className="bg-zinc-900 p-4 pl-8 w-full rounded-md mb-2">
      <div className="flex justify-between w-full items-center gap-8">
        <div
          className="w-1/4 truncate shrink-0"
          aria-label={item.text}
          title={item.text}
        >
          {item.text}
        </div>
        <div className="flex w-3/4 items-center gap-2">
          <input
            className=" bg-zinc-800 w-full p-4 border border-zinc-700 rounded-md transition-all focus:ring-2 focus:outline-none focus:ring-offset-zinc-900 focus:ring-offset-2 focus:ring-lime-300 caret-lime-300"
            type="text"
            value={innerContent}
            onChange={(e) => setInnerContent(e.target.value)}
            onBlur={commitChange}
          />
          <button
            onClick={() => {
              setRenameKeyModalOpen(item.text);
            }}
            className="bg-lime-300 p-4 rounded-md text-zinc-900 font-medium hover:bg-lime-400 transition-all text-lg"
          >
            <Icon icon="tabler:edit" className="text-xl" />
          </button>
          <button
            onClick={removeItem}
            className="bg-red-300 p-4 rounded-md text-zinc-900 font-medium hover:bg-red-400 transition-all text-lg"
          >
            <Icon icon="tabler:trash" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TranslationInput;
