"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function LanguageSwitch() {
  const { locale, setLocale } = useTranslation();

  const toggleLang = () => {
    setLocale(locale === "pt" ? "en" : "pt");
  };

  return (
    <button
      onClick={toggleLang}
      className="p-2 rounded-md hover:bg-secondary transition-colors text-sm font-medium"
      aria-label="Toggle language"
    >
      {locale.toUpperCase()}
    </button>
  );
}
