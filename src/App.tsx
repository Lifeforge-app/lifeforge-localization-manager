/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useEffect, useState } from "react";
import "react-nestable/dist/styles/index.css";
import "./i18n";
import { Icon } from "@iconify/react/dist/iconify.js";
import MainContent from "./pages/MainContent";
import { useTranslation } from "react-i18next";
import { LifeforgeUIProvider, LoadingScreen } from "@lifeforge/ui";

const LocaleAdmin = (): React.ReactElement => {
  const { i18n } = useTranslation();
  const [isAuthed, setIsAuthed] = useState(false);

  const failAuth = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthed(false);
  };

  const verifyToken = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (!token) {
      failAuth();
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/user/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      failAuth();
    }

    const data = await res.json();

    if (data.state === "success") {
      setIsAuthed(true);
      i18n.changeLanguage(data.userData.language);
    } else {
      failAuth();
    }
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("token")) {
      document.cookie = `token=${new URLSearchParams(
        window.location.search
      ).get("token")}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}`;

      window.location.replace(window.location.origin);
    }

    if (document.cookie.includes("token")) {
      verifyToken();
    }
  }, []);

  return (
    <LifeforgeUIProvider
      personalization={{
        bgTemp: "zinc",
        theme: "dark",
        language: i18n.language,
        themeColor: "lime",
      }}
    >
      <main className="w-full theme-lime min-h-dvh bg-zinc-950 flex flex-col text-zinc-100 p-24">
        <Suspense fallback={<LoadingScreen />}>
          {isAuthed ? (
            <MainContent />
          ) : (
            <div className="w-full h-full flex flex-1 items-center flex-col justify-center">
              <Icon icon="tabler:lock-access" className="text-9xl mb-4" />
              <h2 className="text-4xl">Unauthorized Personnel</h2>
              <p className="text-lg text-zinc-500 text-center mt-4">
                Please authenticate through single sign-on (SSO) in the system
                to access the locale editor.
              </p>
              <a
                href={import.meta.env.VITE_FRONTEND_URL}
                className="bg-lime-300 p-4 px-6 mt-16 rounded-md transition-all flex items-center justify-center gap-2 uppercase text-zinc-900 font-semibold hover:bg-lime-400 tracking-widest"
              >
                <Icon icon="tabler:hammer" className="text-2xl" />
                Go to System
              </a>
            </div>
          )}
        </Suspense>
      </main>
    </LifeforgeUIProvider>
  );
};

export default LocaleAdmin;
