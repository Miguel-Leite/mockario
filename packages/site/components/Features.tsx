"use client";

import { motion } from "framer-motion";
import {
  Database,
  Shield,
  Send,
  Zap,
  Wand2,
  Code2,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Schemas & Relationships",
    description:
      "Criação de schemas e relacionamentos visuais, geração automática de dados mock",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "Suporte a JWT, API Key, Basic & Bearer",
  },
  {
    icon: Send,
    title: "Built-in HTTP Client",
    description: "Testar endpoints sem sair da interface",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Iniciar servidor + web UI com um comando",
  },
  {
    icon: Wand2,
    title: "Fake Data Generator",
    description: "Geração de dados realistas com Faker",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "CLI, Web UI e React Hooks",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-neutral-950 py-20">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tudo que você precisa
          </h2>
          <p className="mt-4 text-neutral-400">
            Ferramentas poderosas para criar e gerenciar suas APIs mock
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-green-600/50 hover:scale-[1.02]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                <feature.icon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
