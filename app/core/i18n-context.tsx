import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import en from "~/i18n/en.json";
import es from "~/i18n/es.json";

type Language = "en" | "es";
type TranslationKey = keyof typeof en;

const translations: Record<Language, typeof en> = {
  en,
  es,
};

function getBrowserLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "en";
  }

  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

export const i18nContext = createContext<{
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  translation: (key: TranslationKey) => string;
  t: (key: TranslationKey) => string;
}>({
  language: "en",
  setLanguage: () => {},
  translation: (key) => en[key],
  t: (key) => en[key],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getBrowserLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function translation(key: TranslationKey) {
    return translations[language][key] ?? en[key];
  }

  return (
    <i18nContext.Provider value={{ language, setLanguage, translation, t: translation }}>
      {children}
    </i18nContext.Provider>
  );
}
