"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden dark:bg-neutral-950 bg-neutral-100 py-20">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl dark:text-white text-neutral-900">
            {t.home.testimonials}
          </h2>
          <p className="mt-4 dark:text-neutral-400 text-neutral-600">
            {t.home.testimonialsSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-lg rounded-lg border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900 bg-white p-8 text-center"
        >
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-green-600 opacity-50" />
          <p className="text-lg dark:text-neutral-300 text-neutral-700 italic mb-4">
            &ldquo;{t.home.communityFeedback}&rdquo;
          </p>
          <p className="text-sm dark:text-neutral-500 text-neutral-500">
            — Mockario Community
          </p>
        </motion.div>
      </div>
    </section>
  );
}
