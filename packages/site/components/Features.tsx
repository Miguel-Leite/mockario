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
import { useTranslation } from "@/lib/i18n";

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
  const { t } = useTranslation();

  const features = [
    {
      icon: Database,
      title: t.home.features.schemas.title,
      description: t.home.features.schemas.description,
    },
    {
      icon: Shield,
      title: t.home.features.authentication.title,
      description: t.home.features.authentication.description,
    },
    {
      icon: Send,
      title: t.home.features.httpClient.title,
      description: t.home.features.httpClient.description,
    },
    {
      icon: Zap,
      title: t.home.features.instantSetup.title,
      description: t.home.features.instantSetup.description,
    },
    {
      icon: Wand2,
      title: t.home.features.fakeData.title,
      description: t.home.features.fakeData.description,
    },
    {
      icon: Code2,
      title: t.home.features.developerFriendly.title,
      description: t.home.features.developerFriendly.description,
    },
  ];

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
            {t.home.everythingYouNeed}
          </h2>
          <p className="mt-4 text-neutral-400">
            {t.home.powerfulTools}
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
