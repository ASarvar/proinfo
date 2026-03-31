"use client";

import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@i18n/i18n-context";
import { locales } from "@i18n/translations";

const languageLabels = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

const LanguageSwitcher = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t } = useI18n();

  const handleLanguageChange = (newLocale) => {
    // Remove current locale from pathname and replace with new one
    const pathSegments = pathname.split("/").filter(Boolean);
    const currentLocale = pathSegments[0];

    // If current path starts with a locale, remove it
    if (locales.includes(currentLocale)) {
      pathSegments.shift();
    }

    // Build new path with new locale
    const newPath = `/${newLocale}/${pathSegments.join("/")}`;
    router.push(newPath);
  };

  return (
    <div className={className}>
      <label htmlFor="locale-select" className="visually-hidden">
        {t("common.language")}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        aria-label={t("common.language")}
        style={{
          border: "1px solid rgba(1, 15, 28, 0.14)",
          borderRadius: "6px",
          padding: "6px 8px",
          backgroundColor: "transparent",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {languageLabels[item]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
