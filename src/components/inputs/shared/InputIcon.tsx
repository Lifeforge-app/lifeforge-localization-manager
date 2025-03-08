import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { memo } from "react";

function InputIcon({
  icon,
  active,
  isListbox,
}: {
  icon: string;
  active: boolean;
  isListbox?: boolean;
}): React.ReactElement {
  return (
    <Icon
      className={clsx(
        "size-6 shrink-0 transition-all",
        !active && "text-zinc-500",
        isListbox === true
          ? "group-data-open:text-lime-400!"
          : "group-focus-within:text-lime-400!"
      )}
      icon={icon}
    />
  );
}

export default memo(InputIcon);
