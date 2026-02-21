"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function LanguageSwitch() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("mockario-lang") as "pt" | "en" | null;
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === "pt" ? "en" : "pt";
    setLang(newLang);
    localStorage.setItem("mockario-lang", newLang);
    router.refresh();
  };

  if (!mounted) {
    return (
      <button className="p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Language">
        <Globe className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleLang}
      className="p-2 rounded-md hover:bg-secondary transition-colors text-sm font-medium"
      aria-label="Toggle language"
    >
      {lang.toUpperCase()}
    </button>
  );
}
