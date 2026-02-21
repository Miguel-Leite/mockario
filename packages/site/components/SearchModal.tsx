"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Search, FileText, Command, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { docsPages, searchDocs, getContentSnippet, getPageContent, getPageTitle, getPageSection, DocPage } from "@/lib/docs-data";

export function SearchModal() {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchDocs(query, locale);
  }, [query, locale]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  const handleSearch = (page?: DocPage) => {
    const targetPage = page || results[selectedIndex];
    if (targetPage) {
      router.push(targetPage.slug);
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-green-600 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary rounded-md hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">{t.common.search}</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm isolate" 
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl mx-4 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-3 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.common.searchDocs}
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <kbd 
            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground border border-border px-1.5 py-0.5 rounded"
            onClick={handleClose}
          >
            ESC
          </kbd>
        </div>

        <div 
          ref={resultsRef}
          className="max-h-[60vh] overflow-y-auto"
        >
          {query && results.length > 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
              {results.length} {results.length === 1 ? "result" : "results"} found
            </div>
          )}

          {results.length > 0 ? (
            <div className="py-2">
              {results.map((page, index) => {
                const pageContent = getPageContent(page, locale);
                const pageTitle = getPageTitle(page, locale);
                const pageSection = getPageSection(page, locale);
                return (
                  <button
                    key={page.slug}
                    onClick={() => handleSearch(page)}
                    className={`w-full px-3 py-3 flex items-start gap-3 text-left transition-colors ${
                      index === selectedIndex 
                        ? "bg-green-600/10 dark:bg-green-600/20" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {highlightText(pageTitle, query)}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">
                          {pageSection}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {highlightText(getContentSnippet(pageContent, query), query)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          ) : query ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try searching for something else</p>
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t.common.typeToSearch}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {docsPages.slice(0, 4).map((page) => (
                  <button
                    key={page.slug}
                    onClick={() => {
                      router.push(page.slug);
                      handleClose();
                    }}
                    className="text-xs px-2 py-1 rounded bg-secondary hover:bg-accent transition-colors"
                  >
                    {locale === "pt" ? page.titlePt : page.titleEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
