/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { LocaleContext } from "../providers/LocaleProvider";
import transformDataFormat from "../helpers/transformDataFormat";
import { Icon } from "@iconify/react/dist/iconify.js";
import Nestable from "react-nestable";
import moveItemToTarget from "../helpers/moveItemToTarget";
import TranslationHeader from "./TranslationHeader";
import TranslationInput from "./TranslationInput";

function MainList(): React.ReactElement {
  const { locales, setLocales, filteredLocales } = useContext(LocaleContext);
  return (
    <Nestable
      className="w-full"
      items={transformDataFormat(filteredLocales)}
      renderItem={({
        item,
        collapseIcon,
      }: {
        item: Record<string, any>;
        collapseIcon: React.ReactNode;
      }) => {
        return typeof item.value !== "string" ? (
          <TranslationHeader item={item} collapseIcon={collapseIcon} />
        ) : (
          <TranslationInput item={item} />
        );
      }}
      disableDrag={({ item }) => typeof item.value === "string"}
      onChange={({ items, dragItem, targetPath }) =>
        moveItemToTarget({
          items,
          dragItem,
          targetPath,
          locales,
          setLocales,
        })
      }
      collapsed
      renderCollapseIcon={({ isCollapsed }) => (
        <button className="hover:bg-lime-300/20 transition-all p-2 rounded-md">
          <Icon
            icon={isCollapsed ? "tabler:chevron-down" : "tabler:chevron-up"}
            className="cursor-pointer"
          />
        </button>
      )}
    />
  );
}

export default MainList;
