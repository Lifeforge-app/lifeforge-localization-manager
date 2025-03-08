import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
} from "./components/inputs";

function MainContent(): React.ReactElement {
  const [namespace, setNamespace] = useState<"common" | "modules">("common");

  return (
    <div>
      <header className="w-full flex items-center">
        <h1 className="flex items-center gap-2">
          <Icon icon="hugeicons:translate" className="text-5xl text-lime-400" />
          <div>
            <div className="text-2xl font-medium">
              Lifeforge<span className="text-lime-400">.</span>
            </div>
            <div className="text-zinc-500">Locale Manager</div>
          </div>
        </h1>
      </header>
      <div className="mt-6">
        <ListboxOrComboboxInput
          type="listbox"
          icon="tabler:category-2"
          name="category"
          value={namespace}
          setValue={setNamespace}
          buttonContent={<p className="text-zinc-500">Select a namespace</p>}
          namespace=""
        >
          {["common", "modules"].map((ns) => (
            <ListboxOrComboboxOption
              key={ns}
              value={ns}
              text={ns}
              icon="tabler:category-2"
            />
          ))}
        </ListboxOrComboboxInput>
      </div>
    </div>
  );
}

export default MainContent;
