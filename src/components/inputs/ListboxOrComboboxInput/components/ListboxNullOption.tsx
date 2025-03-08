import { ListboxOption } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";

function ListboxNullOption({
  icon,
  value = "",
  hasBgColor = false,
  text = "None",
}: {
  icon: string;
  value?: any;
  hasBgColor?: boolean;
  text?: string;
}): React.ReactElement {
  return (
    <ListboxOption
      key="none"
      className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
      value={value}
    >
      {({ selected }) => (
        <>
          <div
            className={clsx(
              "flex items-center font-medium",
              hasBgColor ? "gap-4" : "gap-2",
              selected && "text-zinc-800 dark:text-zinc-100"
            )}
          >
            <span
              className={clsx(
                "rounded-md",
                hasBgColor
                  ? "bg-zinc-200 p-2 text-zinc-500 dark:bg-zinc-700/50"
                  : "pr-2"
              )}
            >
              <Icon className="size-5" icon={icon} />
            </span>
            <span>{text}</span>
          </div>
          {selected && (
            <Icon className="block text-lg text-lime-400" icon="tabler:check" />
          )}
        </>
      )}
    </ListboxOption>
  );
}

export default ListboxNullOption;
