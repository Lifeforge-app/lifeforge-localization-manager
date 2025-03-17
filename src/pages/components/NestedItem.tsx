/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import LocaleInput from "./LocaleInput";
import { isFolder } from "../../utils/locales";
import { Button } from "@lifeforge/ui";

function NestedItem({
  name,
  value,
  path,
  setValue,
  changedKeys,
  setChangedKeys,
  oldLocales,
  searchQuery,
  onCreateEntry,
  onRenameEntry,
  onDeleteEntry,
  fetchSuggestions,
}: {
  name: string;
  value: Record<string, any>;
  path: string[];
  setValue: (lng: string, path: string[], value: string) => void;
  changedKeys: string[];
  setChangedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  oldLocales: Record<string, any> | "loading" | "error";
  searchQuery: string;
  onCreateEntry: (parent: string) => void;
  onDeleteEntry: (path: string) => void;
  onRenameEntry: (path: string) => void;
  fetchSuggestions: (path: string) => Promise<void>;
}): React.ReactElement {
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <li
      className={`border-l-2 shadow-md my-4 w-full ${
        changedKeys.some((key) => key.startsWith(path.join(".")))
          ? "border-yellow-500"
          : collapsed
          ? "border-zinc-500"
          : "border-zinc-100"
      }`}
    >
      <button
        onClick={() => {
          setCollapsed(!collapsed);
        }}
        className="flex-between gap-8 w-full hover:bg-zinc-900 transition-all p-4"
      >
        <code className="flex items-center gap-2">
          <Icon
            icon={!isFolder(value) ? "tabler:file-text" : "tabler:folder"}
            className="size-6"
          />
          {name}
        </code>
        <div className="flex items-center gap-2">
          {!isFolder(value) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSuggestionsLoading(true);
                fetchSuggestions(path.join(".")).finally(() => {
                  setSuggestionsLoading(false);
                });
              }}
              loading={suggestionsLoading}
              variant="plain"
              icon="mage:stars-c"
              className="p-2!"
            />
          )}
          {isFolder(value) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateEntry(path.join("."));
              }}
              variant="plain"
              icon="tabler:plus"
              className="p-2!"
            />
          )}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRenameEntry(path.join("."));
            }}
            variant="plain"
            icon="tabler:pencil"
            className="p-2!"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteEntry(path.join("."));
            }}
            variant="plain"
            icon="tabler:trash"
            className="p-2!"
            isRed
          />
          <div className="p-2">
            <Icon
              icon={collapsed ? "tabler:chevron-up" : "tabler:chevron-down"}
              className="size-5 text-zinc-500"
            />
          </div>
        </div>
      </button>
      {!collapsed && (
        <ul className="space-y-2 px-4 mt-4">
          {Object.entries(value)
            .filter(([key]) => {
              return (
                path.concat(key).join(".").startsWith(searchQuery) ||
                searchQuery.startsWith(path.concat(key).join("."))
              );
            })
            .sort((a, b) => {
              if (typeof a[1] === "string" && typeof b[1] === "string") {
                return 0;
              }
              const aIsFolder = isFolder(a[1]);
              const bIsFolder = isFolder(b[1]);

              if (aIsFolder === bIsFolder) {
                return a[0].localeCompare(b[0]);
              }

              return aIsFolder ? -1 : 1;
            })
            .map(([key, value]) =>
              typeof value === "string" ? (
                <li key={key} className="flex items-center gap-2">
                  <LocaleInput
                    name={key}
                    path={path}
                    value={value}
                    setValue={setValue}
                    setChangedKeys={setChangedKeys}
                    oldLocales={oldLocales}
                  />
                </li>
              ) : (
                <NestedItem
                  key={key}
                  name={key}
                  value={value}
                  path={path.concat(key)}
                  setValue={setValue}
                  changedKeys={changedKeys}
                  setChangedKeys={setChangedKeys}
                  oldLocales={oldLocales}
                  searchQuery={searchQuery}
                  onCreateEntry={onCreateEntry}
                  onRenameEntry={onRenameEntry}
                  onDeleteEntry={onDeleteEntry}
                  fetchSuggestions={fetchSuggestions}
                />
              )
            )}
        </ul>
      )}
    </li>
  );
}

export default NestedItem;
