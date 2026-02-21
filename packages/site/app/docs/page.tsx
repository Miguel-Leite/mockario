import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Shield, Database, Send } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Aprenda os conceitos básicos do Mockario",
    href: "/docs",
  },
  {
    icon: Terminal,
    title: "Installation",
    description: "Como instalar e configurar",
    href: "/docs",
  },
  {
    icon: ArrowRight,
    title: "Quick Start",
    description: "Guia rápido para começar",
    href: "/docs",
  },
  {
    icon: Database,
    title: "Features",
    description: "Endpoints, Schemas, Authentication",
    href: "/docs",
  },
  {
    icon: Send,
    title: "HTTP Client",
    description: "Teste seus endpoints",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "API Reference",
    description: "Referência completa da API",
    href: "/docs",
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Documentação</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tudo que você precisa saber para usar o Mockario
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Link
            key={index}
            href={section.href}
            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <section.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
