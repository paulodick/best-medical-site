import { getRequestConfig } from "next-intl/server";

/** Preparado para pt, en e es. Por ora só pt é publicado (sem prefixo de rota). */
export const locales = ["pt", "en", "es"] as const;
export const defaultLocale = "pt";

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
