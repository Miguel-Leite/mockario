"use client";

import Link from "next/link";
import { Github, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LanguageSwitch, SearchModal } from "./";
import { AnimatedThemeToggler } from "./ui";

const menu = [
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Playground",
    href: "/#playground",
  },
  {
    label: "Blog",
    href: "/#blog",
  },
  {
    label: "Roadmap",
    href: "/#roadmap",
  },
];

export function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky z-50 top-0 w-full border-b border-border dark:bg-background/80 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image src="/logo.png" alt="Mockario" width={100} height={32} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {menu.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchModal />
          <LanguageSwitch />
          {mounted && (
            // <button
            //   onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            //   className="p-2 rounded-md hover:bg-secondary transition-colors"
            //   aria-label="Toggle theme"
            // >
            // </button>
            <AnimatedThemeToggler duration={400} />
          )}
          <a
            href="https://github.com/Miguel-Leite/mockario"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
