/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback, useEffect, useState } from "react";
import NamespaceSelector from "./components/NamespaceSelector";
import LocaleEditor from "./components/LocaleEditor";
import Button from "../components/Button";
import fetchAPI from "../utils/fetchAPI";
import { SearchInput } from "../components/inputs";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import CreateEntryModal from "./components/CreateEntryModal";
import EmptyStateScreen from "../components/screens/EmptyStateScreen";

function MainContent(): React.ReactElement {
  const { t } = useTranslation("utils.localeAdmin");
  const [namespace, setNamespace] = useState<
    null | "common" | "modules" | "utils"
  >(null);
  const [subNamespace, setSubNamespace] = useState<string | null>(null);
  const [oldLocales, setOldLocales] = useState<
    Record<string, any> | "loading" | "error"
  >({});
  const [locales, setLocales] = useState<
    Record<string, any> | "loading" | "error"
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [changedKeys, setChangedKeys] = useState<string[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [targetEntry, setTargetEntry] = useState<string | null>(null);
  const [createEntryModalOpen, setCreateEntryModalOpen] = useState(false);

  async function syncWithServer() {
    if (typeof locales === "string") {
      return;
    }

    setSyncLoading(true);
    try {
      const data = Object.fromEntries(
        changedKeys.map((key) => {
          const final: Record<string, string> = {};
          for (const lng of Object.keys(locales)) {
            final[lng] = key
              .split(".")
              .reduce((acc, k) => acc[k], locales[lng]);
          }
          return [key, final];
        })
      );

      await fetchAPI(`/locales/sync/${namespace}/${subNamespace}`, {
        method: "POST",
        body: {
          data,
        },
      });
      setChangedKeys([]);
    } catch {
      alert("Failed to sync with server");
    }
    setOldLocales(JSON.parse(JSON.stringify(locales)));
    setSyncLoading(false);
  }

  function setValue(lng: string, path: string[], value: string) {
    if (typeof locales === "string") {
      return;
    }
    const newData = { ...locales };
    const target = path
      .slice(0, -1)
      .reduce((acc, key) => acc[key], newData[lng]);
    target[path[path.length - 1]] = value;

    setLocales(newData);
  }

  async function renameEntry(path: string) {
    if (changedKeys.includes(path)) {
      alert("Please sync changes with the server before renaming");
      return;
    }

    const newName = prompt("Enter the new name");
    if (!newName) {
      return;
    }

    try {
      await fetchAPI(`/locales/rename/${namespace}/${subNamespace}`, {
        method: "POST",
        body: {
          path,
          newName,
        },
      });

      [setLocales, setOldLocales].forEach((e) => {
        e((prev) => {
          if (typeof prev === "string") {
            return prev;
          }

          const newData = JSON.parse(JSON.stringify(prev));

          for (const lng in newData) {
            let targetObject = newData[lng];
            const pathArray = path.split(".");
            for (let i = 0; i < pathArray.length; i++) {
              if (i === pathArray.length - 1) {
                targetObject[newName] = targetObject[pathArray[i]];
                delete targetObject[pathArray[i]];
              } else {
                targetObject = targetObject[pathArray[i]];
              }
            }
          }

          return newData;
        });
      });
    } catch {
      alert("Failed to rename entry");
    }
  }

  async function deleteEntry(path: string) {
    if (typeof locales === "string") {
      return;
    }

    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      await fetchAPI(`/locales/delete/${namespace}/${subNamespace}`, {
        method: "POST",
        body: {
          path,
        },
      });

      [setLocales, setOldLocales].forEach((e) => {
        e((prev) => {
          if (typeof prev === "string") {
            return prev;
          }

          const newData = JSON.parse(JSON.stringify(prev));

          for (const lng in newData) {
            let targetObject = newData[lng];
            const pathArray = path.split(".");
            for (let i = 0; i < pathArray.length; i++) {
              if (i === pathArray.length - 1) {
                delete targetObject[pathArray[i]];
              } else {
                targetObject = targetObject[pathArray[i]];
              }
            }
          }

          return newData;
        });
      });
    } catch {
      alert("Failed to delete entry");
    }
  }

  async function fetchSuggestions(path: string) {
    if (typeof locales === "string") {
      return;
    }

    const hint = prompt("Enter the suggestion");

    try {
      const data = await fetchAPI<Record<string, string>>(
        `/locales/suggestions/${namespace}/${subNamespace}`,
        {
          method: "POST",
          body: {
            path,
            hint: hint ?? "",
          },
        }
      );

      setLocales((prev) => {
        if (typeof prev === "string") {
          return prev;
        }

        const newData = JSON.parse(JSON.stringify(prev));

        for (const lng in data) {
          let targetObject = newData[lng];
          const pathArray = path.split(".");
          for (let i = 0; i < pathArray.length; i++) {
            if (i === pathArray.length - 1) {
              targetObject[pathArray[i]] = data[lng];
            } else {
              targetObject = targetObject[pathArray[i]];
            }
          }
        }

        return newData;
      });

      setChangedKeys((prev) => {
        if (prev.includes(path)) {
          return prev;
        }

        return [...prev, path];
      });
    } catch {
      alert("Failed to fetch suggestions");
    }
  }

  const fetchLocales = useCallback(async () => {
    setLocales("loading");
    try {
      const data = await fetchAPI<Record<string, any>>(
        `/locales/list/${namespace}/${subNamespace}`
      );
      setLocales(data);
      setOldLocales(JSON.parse(JSON.stringify(data)));
    } catch {
      setLocales("error");
    }
  }, [namespace, subNamespace]);

  useEffect(() => {
    if (namespace && subNamespace) {
      fetchLocales();
    }
  }, [namespace, subNamespace, fetchLocales]);

  useEffect(() => {
    setChangedKeys([]);
    setSearchQuery;
  }, [namespace, subNamespace]);

  return (
    <div className="h-full flex flex-col flex-1">
      <header className="w-full flex items-center justify-between">
        <h1 className="flex items-center gap-2">
          <Icon icon="hugeicons:translate" className="text-5xl text-lime-400" />
          <div>
            <div className="text-2xl font-semibold">
              Lifeforge<span className="text-lime-400">.</span>
            </div>
            <div className="text-zinc-500 font-medium">{t("title")}</div>
          </div>
        </h1>
        {namespace && subNamespace && typeof locales !== "string" && (
          <div className="flex items-center gap-2">
            <Button
              icon="tabler:plus"
              tProps={{
                item: t("items.entry"),
              }}
              variant="no-bg"
              onClick={() => {
                setTargetEntry("");
                setCreateEntryModalOpen(true);
              }}
            >
              new
            </Button>
            <Button
              icon="tabler:refresh"
              loading={syncLoading}
              onClick={syncWithServer}
              disabled={changedKeys.length === 0}
              namespace="utils.localeAdmin"
            >
              Sync with Server
            </Button>
          </div>
        )}
      </header>
      <NamespaceSelector
        namespace={namespace}
        setNamespace={setNamespace}
        subNamespace={subNamespace}
        setSubNamespace={setSubNamespace}
        showWarning={changedKeys.length > 0}
      />

      {namespace && subNamespace ? (
        <div className="flex-1 h-full flex flex-col">
          <SearchInput
            namespace="utils.localeAdmin"
            stuffToSearch="entry"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <LocaleEditor
            oldLocales={oldLocales}
            locales={locales}
            setValue={setValue}
            changedKeys={changedKeys}
            setChangedKeys={setChangedKeys}
            searchQuery={debouncedSearchQuery}
            onCreateEntry={(parent) => {
              setTargetEntry(parent);
              setCreateEntryModalOpen(true);
            }}
            onRenameEntry={renameEntry}
            onDeleteEntry={deleteEntry}
            fetchSuggestions={fetchSuggestions}
          />
        </div>
      ) : (
        <EmptyStateScreen
          icon={namespace ? "tabler:cube-off" : "tabler:apps-off"}
          name={namespace ? "subNamespace" : "namespace"}
          namespace="utils.localeAdmin"
        />
      )}
      <CreateEntryModal
        isOpen={createEntryModalOpen}
        onClose={() => setCreateEntryModalOpen(false)}
        target={[namespace ?? "", subNamespace ?? "", targetEntry ?? ""]}
        setLocales={setLocales}
        setOldLocales={setOldLocales}
      />
    </div>
  );
}

export default MainContent;
