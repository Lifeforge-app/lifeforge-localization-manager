import React, { useContext } from "react";
import { LocaleContext } from "../providers/LocaleProvider";
import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddTranslationModal from "./AddTranslationModal";

export const languages = [
  { id: "en", name: "English", icon: "emojione:flag-for-united-kingdom" },
  { id: "ms", name: "Malay", icon: "emojione:flag-for-malaysia" },
  {
    id: "zh-CN",
    name: "Chinese (Simplified)",
    icon: "emojione:flag-for-china",
  },
  {
    id: "zh-TW",
    name: "Chinese (Traditional)",
    icon: "emojione:flag-for-taiwan",
  },
];

function SearchBar(): React.ReactElement {
  const {
    selectedLanguage,
    setSelectedLanguage,
    keyFilter,
    setKeyFilter,
    setAddTranslationModalOpen,
  } = useContext(LocaleContext);

  return (
    <>
      <div className="flex sticky top-0 z-50 bg-zinc-950 items-center gap-2 py-8 w-full">
        <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
          <div className="relative">
            <ListboxButton className="bg-zinc-900 p-4 w-72 rounded-md flex items-center justify-start">
              <div className="flex items-center justify-start">
                <Icon
                  icon={
                    languages.find(
                      (language) => language.id === selectedLanguage
                    )?.icon || ""
                  }
                  className="text-2xl inline-block mr-2"
                />
                {languages.find((language) => language.id === selectedLanguage)
                  ?.name || ""}
              </div>
              <Icon
                icon="tabler:chevron-down"
                className="text-xl text-zinc-500 ml-auto"
              />
            </ListboxButton>
            <Transition
              enter="duration-200 ease-out"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="duration-300 ease-out"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <ListboxOptions className="absolute z-50 top-14 mt-1 w-full bg-zinc-900 rounded-md shadow-lg">
                {languages.map((language) => (
                  <ListboxOption key={language.id} value={language.id}>
                    {({ selected }) => (
                      <div
                        className={`p-4 cursor-pointer transition-all ${
                          selected
                            ? "bg-lime-300 text-zinc-900 hover:bg-lime-400"
                            : "text-zinc-100 hover:bg-zinc-700/50"
                        }`}
                      >
                        <Icon
                          icon={language.icon}
                          className="text-2xl inline-block mr-2"
                        />
                        {language.name}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
        <search className="flex items-center gap-2 w-full bg-zinc-900 px-4 rounded-md">
          <Icon icon="tabler:search" className="text-xl text-zinc-500" />
          <input
            type="text"
            placeholder="Search for a key..."
            className="w-full bg-transparent p-4 px-2 focus:outline-none"
            value={keyFilter}
            onChange={(e) => setKeyFilter(e.target.value)}
          />
        </search>
        <button
          className="bg-lime-300 p-4 px-6 flex items-center gap-2 uppercase whitespace-nowrap rounded-md text-zinc-900 font-semibold transition-all tracking-widest hover:bg-lime-400"
          onClick={() => {
            setAddTranslationModalOpen(true);
          }}
        >
          <Icon icon="tabler:plus" className="text-xl" />
          new Entry
        </button>
      </div>
      <AddTranslationModal />
    </>
  );
}

export default SearchBar;
