import { I18nProvider } from "@i18n/i18n-context";
import { locales, defaultLocale } from "@i18n/translations";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: `ProInfo - Library Automation Solutions [${locale.toUpperCase()}]`,
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return null;
  }

  return (
    <I18nProvider initialLocale={locale}>
      {children}
    </I18nProvider>
  );
}
