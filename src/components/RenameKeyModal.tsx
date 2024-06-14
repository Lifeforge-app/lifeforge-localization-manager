import React, { useContext, useEffect, useRef, useState } from "react";
import { LocaleContext } from "../providers/LocaleProvider";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";

function RenameKeyModal(): React.ReactElement {
  const { renameKeyModalOpen, setRenameKeyModalOpen } =
    useContext(LocaleContext);
  const [newKey, setNewKey] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit() {
    if (!newKey) {
      alert("Please fill in all fields");
      return;
    }

    await axios.patch(
      "https://lifeforge-api-proxy.onrender.com/locales/rename-key",
      {
        oldKey: renameKeyModalOpen,
        newKey: newKey,
      }
    );

    setRenameKeyModalOpen(false);
  }

  useEffect(() => {
    if (renameKeyModalOpen) {
      const newNameKey = renameKeyModalOpen.split(".").slice(0, -1).join(".");
      setNewKey(newNameKey.length > 0 ? newNameKey + "." : newNameKey);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [renameKeyModalOpen]);

  return (
    <Modal isOpen={!!renameKeyModalOpen} minWidth="60%">
      <ModalHeader
        title="Rename Key"
        onClose={() => setRenameKeyModalOpen(false)}
        icon="tabler:edit"
      />
      <div className="flex items-center w-full gap-4">
        <div className="relative w-full bg-zinc-800 rounded-md group">
          <Icon
            icon="uil:key-skeleton"
            className="text-2xl text-zinc-500 shrink-0 group-focus-within:text-teal-300 transition-all absolute top-1/2 -translate-y-1/2 left-4"
          />
          <input
            type="text"
            className="bg-zinc-800 w-full p-4 pl-14 rounded-md transition-all focus:ring-2 focus:outline-none focus:ring-offset-zinc-900 focus:ring-offset-2 focus:ring-teal-300 caret-teal-300"
            placeholder="Current Key"
            value={renameKeyModalOpen || ""}
            disabled
          />
        </div>
        <Icon
          icon="uil:arrow-right"
          className="text-2xl text-teal-300 shrink-0"
        />
        <div className="relative w-full bg-zinc-800 rounded-md group">
          <Icon
            icon="uil:key-skeleton"
            className="text-2xl text-zinc-500 shrink-0 group-focus-within:text-teal-300 transition-all absolute top-1/2 -translate-y-1/2 left-4"
          />
          <input
            type="text"
            ref={inputRef}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="bg-zinc-800 w-full p-4 pl-14 rounded-md transition-all focus:ring-2 focus:outline-none focus:ring-offset-zinc-900 focus:ring-offset-2 focus:ring-teal-300 caret-teal-300"
            placeholder="New Key"
          />
        </div>
      </div>
      <button
        className="bg-teal-300 p-4 mt-8 rounded-md transition-all w-full flex items-center justify-center gap-2 uppercase text-zinc-900 font-semibold hover:bg-teal-400 tracking-widest"
        onClick={() => {
          onSubmit();
        }}
      >
        <Icon icon="tabler:pencil" className="text-xl" />
        rename key
      </button>
    </Modal>
  );
}

export default RenameKeyModal;
