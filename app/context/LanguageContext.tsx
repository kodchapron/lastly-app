"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "th" | "en";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("th");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lastly_lang") as Lang;
    if (saved === "th" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("lastly_lang", newLang);
  };

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
