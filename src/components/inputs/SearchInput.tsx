import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { toCamelCase } from "../../utils/strings";

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch,
  onKeyUp,
  customIcon,
  hasTopMargin = true,
  onFilterIconClick,
  filterAmount,
  sideButtonIcon,
  onSideButtonClick,
  className,
  namespace,
  tKey = "",
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stuffToSearch: string;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  customIcon?: string;
  hasTopMargin?: boolean;
  onFilterIconClick?: () => void;
  filterAmount?: number;
  sideButtonIcon?: string;
  onSideButtonClick?: () => void;
  className?: string;
  namespace: string;
  tKey?: string;
}): React.ReactElement {
  const { t } = useTranslation(["common.misc", namespace]);
  const componentBgLighterWithHover =
    "bg-zinc-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80 hover:bg-zinc-50/50 transition-all";

  return (
    <search
      className={clsx(
        "flex min-h-14 w-full cursor-text items-center gap-4 rounded-lg px-4 shadow-custom transition-all",
        componentBgLighterWithHover,
        hasTopMargin && "mt-4",
        className
      )}
      onClick={(e) => {
        e.currentTarget.querySelector("input")?.focus();
      }}
    >
      <Icon
        className="size-5 shrink-0 text-zinc-500"
        icon={customIcon ?? "tabler:search"}
      />
      <input
        className="w-full bg-transparent caret-lime-400 placeholder:text-zinc-500"
        placeholder={t(`search`, {
          item: t([
            `${namespace}:${[tKey, "items", toCamelCase(stuffToSearch)]
              .filter((e) => e)
              .join(".")}`,
            stuffToSearch,
          ]),
        })}
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyUp={onKeyUp}
      />
      {onFilterIconClick !== undefined && (
        <button
          className={clsx(
            "flex items-center gap-1 rounded-lg p-2",
            filterAmount !== undefined && filterAmount > 0
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
            "transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
          )}
          onClick={onFilterIconClick}
        >
          <Icon className="text-xl" icon="tabler:filter" />
          {filterAmount !== undefined && filterAmount > 0 && (
            <span className="-mt-0.5">({filterAmount})</span>
          )}
        </button>
      )}
      {sideButtonIcon !== undefined && onSideButtonClick !== undefined && (
        <button
          className="flex items-center gap-1 rounded-lg p-2 text-zinc-500 transition-all hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100"
          onClick={onSideButtonClick}
        >
          <Icon className="text-xl" icon={sideButtonIcon} />
        </button>
      )}
    </search>
  );
}

export default SearchInput;
