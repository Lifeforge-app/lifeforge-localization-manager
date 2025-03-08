export const generateBaseClass = (
  hasChildren: boolean,
  iconAtEnd: boolean
): string =>
  `flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg p-4 ${
    hasChildren && (iconAtEnd ? "pl-5" : "pr-5")
  } font-medium tracking-wide transition-all disabled:cursor-not-allowed`;

export const generateColorClass = (isRed: boolean, variant: string): string => {
  if (isRed) {
    return variant !== "no-bg"
      ? "bg-red-500 hover:bg-red-600 text-zinc-50 dark:text-zinc-800"
      : "text-red-500 hover:text-red-600 hover:bg-red-500/10";
  }

  switch (variant) {
    case "primary":
      return "bg-lime-400 shadow-custom hover:bg-lime-500 text-zinc-50 dark:text-zinc-800 disabled:bg-zinc-500 disabled:hover:bg-zinc-500";
    case "no-bg":
      return "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-50 disabled:hover:text-zinc-500 disabled:dark:hover:text-zinc-500 disabled:dark:hover:bg-transparent disabled:text-zinc-500";
    case "secondary":
    default:
      return "bg-zinc-300 shadow-custom text-zinc-500 dark:text-zinc-800 dark:bg-zinc-600 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/80";
  }
};

export const generateClassName = (
  hasChildren: boolean,
  iconAtEnd: boolean,
  isRed: boolean,
  variant: string,
  className: string
): string =>
  `${generateBaseClass(hasChildren, iconAtEnd)} ${generateColorClass(
    isRed,
    variant
  )} ${className}`;
