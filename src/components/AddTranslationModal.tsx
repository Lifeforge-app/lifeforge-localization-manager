import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import axios from "axios";
import { LocaleContext } from "../providers/LocaleProvider";
import { languages } from "./SearchBar";

function AddTranslationModal(): React.ReactElement {
  const { addTranslationModalOpen, setAddTranslationModalOpen } =
    useContext(LocaleContext);
  const [data, setData] = useState({
    key: "",
    translations: Object.fromEntries(
      languages.map((language) => [language.id, ""])
    ),
  });
  const [aiGenerating, setAiGenerating] = useState(false);

  const updateTranslation = (language: string, value: string) => {
    setData((prev) => ({
      ...prev,
      translations: Object.fromEntries(
        Object.entries(prev.translations).map(([key, val]) => [
          key,
          key === language ? value : val,
        ])
      ),
    }));
  };

  async function onSubmit() {
    if (!data.key || Object.values(data.translations).some((v) => !v)) {
      alert("Please fill in all fields");
      return;
    }

    await axios.post(`${import.meta.env.VITE_API_HOST}/locales`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + document.cookie.split("token=")[1].split(";")[0],
      },
    });

    setData({
      key: "",
      translations: Object.fromEntries(
        languages.map((language) => [language.id, ""])
      ),
    });

    setAddTranslationModalOpen(false);
  }

  async function AIGenerate() {
    if (!data.key) {
      alert("Please fill in the key field");
      return;
    }

    setAiGenerating(true);
    const response = await axios.post(
      `${import.meta.env.VITE_API_HOST}/locales/ai-generate`,
      { key: data.key },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + document.cookie.split("token=")[1].split(";")[0],
        },
      }
    );

    setData((prev) => ({
      ...prev,
      translations: Object.fromEntries(
        Object.entries(prev.translations).map(([key, val]) => [
          key,
          response.data.data[key] || val,
        ])
      ),
    }));
    setAiGenerating(false);
  }

  useEffect(() => {
    if (!addTranslationModalOpen) {
      setData({
        key: "",
        translations: Object.fromEntries(
          languages.map((language) => [language.id, ""])
        ),
      });
    }
  }, [addTranslationModalOpen]);

  return (
    <Modal isOpen={addTranslationModalOpen} minWidth="60%">
      <ModalHeader
        title="New Entry"
        icon="tabler:plus"
        onClose={() => {
          setAddTranslationModalOpen(false);
        }}
      />
      <div className="flex flex-col gap-4">
        <div className="relative bg-zinc-800 rounded-md group">
          <Icon
            icon="uil:key-skeleton"
            className="text-2xl text-zinc-500 shrink-0 group-focus-within:text-lime-300 transition-all absolute top-1/2 -translate-y-1/2 left-4"
          />
          <input
            type="text"
            value={data.key}
            onChange={(e) =>
              setData((prev) => ({ ...prev, key: e.target.value }))
            }
            placeholder="key.of.the.translation"
            className="w-full bg-transparent p-4 px-14 tracking-wider placeholder-zinc-500 transition-all rounded-md focus:ring-2 focus:outline-none focus:ring-offset-zinc-900 focus:ring-offset-2 focus:ring-lime-300 caret-lime-300"
          />
          <button
            onClick={AIGenerate}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lime-300 hover:bg-lime-300/10 p-2 rounded-md font-medium transition-all"
          >
            <Icon
              icon={aiGenerating ? "svg-spinners:3-dots-scale" : "mage:stars-c"}
              className="text-xl"
            />
          </button>
        </div>
        {languages.map((language) => (
          <div
            key={language.id}
            className="relative bg-zinc-800 rounded-md group"
          >
            <Icon
              icon={language.icon}
              className="text-2xl text-zinc-500 shrink-0 group-focus-within:text-lime-300 transition-all absolute top-1/2 -translate-y-1/2 left-4"
            />
            <input
              type="text"
              value={data.translations[language.id]}
              onChange={(e) => updateTranslation(language.id, e.target.value)}
              placeholder={`Translation for ${language.name}`}
              className="w-full bg-transparent p-4 px-14 tracking-wider placeholder-zinc-500 transition-all rounded-md focus:ring-2 focus:outline-none focus:ring-offset-zinc-900 focus:ring-offset-2 focus:ring-lime-300 caret-lime-300"
            />
          </div>
        ))}
        <button
          className="bg-lime-300 p-4 mt-6 rounded-md transition-all w-full flex items-center justify-center gap-2 uppercase text-zinc-900 font-semibold hover:bg-lime-400 tracking-widest"
          onClick={() => {
            onSubmit();
          }}
        >
          <Icon icon="tabler:plus" className="text-xl" />
          Add Translation
        </button>
      </div>
    </Modal>
  );
}

export default AddTranslationModal;
