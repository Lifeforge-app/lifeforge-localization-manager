/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebounce } from "@uidotdev/usehooks";

export const LocaleContext = createContext<{
  locales: any;
  setLocales: React.Dispatch<React.SetStateAction<any>>;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  saveLocales: () => void;
  filteredLocales: any;
  keyFilter: string;
  setKeyFilter: (value: string) => void;
  addTranslationModalOpen: boolean;
  setAddTranslationModalOpen: (value: boolean) => void;
  renameKeyModalOpen: string | false;
  setRenameKeyModalOpen: (value: string | false) => void;
}>({
  locales: {},
  setLocales: () => {},
  selectedLanguage: "en",
  setSelectedLanguage: () => {},
  saveLocales: () => {},
  filteredLocales: {},
  keyFilter: "",
  setKeyFilter: () => {},
  addTranslationModalOpen: false,
  setAddTranslationModalOpen: () => {},
  renameKeyModalOpen: false,
  setRenameKeyModalOpen: () => {},
});

export default function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locales, _setLocales] = useState({});
  const localesRef = useRef(locales);
  const [selectedLanguage, _setSelectedLanguage] = useState("en");
  const selectedLanguageRef = useRef(selectedLanguage);
  const [keyFilter, setKeyFilter] = useState<string>("");
  const debouncedKeyFilter = useDebounce(keyFilter, 500);
  const [filteredLocales, _setFilteredLocales] = useState(locales);
  const filteredLocalesRef = useRef(filteredLocales);
  const [addTranslationModalOpen, setAddTranslationModalOpen] = useState(false);
  const [renameKeyModalOpen, setRenameKeyModalOpen] = useState<string | false>(
    false
  );

  const setLocales = useCallback((value: any) => {
    localesRef.current = value;
    _setLocales(value);
  }, []);

  const setSelectedLanguage = useCallback((value: string) => {
    selectedLanguageRef.current = value;
    _setSelectedLanguage(value);
  }, []);

  const setFilteredLocales = useCallback((value: any) => {
    filteredLocalesRef.current = value;
    _setFilteredLocales(value);
  }, []);

  function filterLocales(key: string, items: any) {
    return Object.keys(items).reduce((acc, currentKey) => {
      if (currentKey.toLowerCase().includes(key.toLowerCase())) {
        acc[currentKey] = items[currentKey];
      } else if (typeof items[currentKey] === "object") {
        acc[currentKey] = filterLocales(key, items[currentKey]);
      }
      return acc;
    }, {} as Record<string, any>);
  }

  function removeEmptyObject(obj: Record<string, any>) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        removeEmptyObject(obj[key]);
      }
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    });
  }

  useEffect(() => {
    if (!debouncedKeyFilter) {
      setFilteredLocales(localesRef.current);
      return;
    }

    const filtered = filterLocales(debouncedKeyFilter, localesRef.current);
    removeEmptyObject(filtered);

    setFilteredLocales(filtered);
  }, [debouncedKeyFilter, locales]);

  async function saveLocales() {
    await axios.put(
      `https://lifeforge-api-proxy.onrender.com/locales/update/${selectedLanguageRef.current}`,
      {
        data: localesRef.current,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + document.cookie.split("token=")[1].split(";")[0],
        },
      }
    );
    alert("Saved!");
  }

  async function fetchLocales() {
    const response = await fetch(
      `https://lifeforge-api-proxy.onrender.com/locales/${selectedLanguage}`
    ).then((res) => res.json());
    setLocales(response);
  }

  useEffect(() => {
    fetchLocales();
  }, [selectedLanguage, setLocales]);

  useEffect(() => {
    if (!addTranslationModalOpen) {
      fetchLocales();
    }
  }, [addTranslationModalOpen]);

  useEffect(() => {
    if (!renameKeyModalOpen) {
      fetchLocales();
    }
  }, [renameKeyModalOpen]);

  useEffect(() => {
    async function saveOnKeyPress(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveLocales();
      }
    }
    document.onkeydown = saveOnKeyPress;

    return () => {
      document.onkeydown = null;
    };
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        locales: localesRef.current,
        setLocales,
        selectedLanguage: selectedLanguageRef.current,
        setSelectedLanguage,
        saveLocales,
        filteredLocales,
        keyFilter,
        setKeyFilter,
        addTranslationModalOpen,
        setAddTranslationModalOpen,
        renameKeyModalOpen,
        setRenameKeyModalOpen,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
