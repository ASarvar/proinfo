"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, locales, translations } from "./translations";

const I18nContext = createContext({
  locale: defaultLocale,
  t: (key) => key,
});

function getByPath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

export function I18nProvider({ children, initialLocale = defaultLocale }) {
  const params = useParams();
  const [locale, setLocaleState] = useState(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (params?.locale && locales.includes(params.locale)) {
      setLocaleState(params.locale);
      document.documentElement.lang = params.locale;
    } else {
      document.documentElement.lang = defaultLocale;
    }
    setMounted(true);
  }, [params]);

  const t = useCallback((key) => {
    const selected = getByPath(translations[locale], key);
    if (selected !== undefined) return selected;
    const fallback = getByPath(translations[defaultLocale], key);
    return fallback !== undefined ? fallback : key;
  }, [locale]);

  const value = useMemo(() => ({ locale, t, mounted }), [locale, t, mounted]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
