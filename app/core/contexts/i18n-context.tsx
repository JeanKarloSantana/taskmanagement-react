import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import en from "~/i18n/en.json";
import es from "~/i18n/es.json";

type Language = "en" | "es";
type TranslationKey =
  | "landing.navBar.navHome"
  | "landing.navBar.navPricing"
  | "landing.navBar.navAbout"
  | "landing.navBar.navLogin"
  | "landing.navBar.navLogout"
  | "landing.navBar.navSignup"
  | "landing.navBar.theme.toggle";

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

function getTranslation(source: typeof en, key: TranslationKey): string | undefined {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

export const i18nContext = createContext<{
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  translation: (key: TranslationKey) => string;
}>({
  language: "en",
  setLanguage: () => {},
  translation: (key) => getTranslation(en, key) ?? key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getBrowserLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function translation(key: TranslationKey) {
    return getTranslation(translations[language], key) ?? getTranslation(en, key) ?? key;
  }

  return (
    <i18nContext.Provider value={{ language, setLanguage, translation }}>
      {children}
    </i18nContext.Provider>
  );
}
