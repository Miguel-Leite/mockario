"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20">
      <div className="absolute inset-0 bg-grid-dots opacity-30" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Comece a desenvolver sem dependências externas hoje mesmo
          </p>
          <div className="mt-8">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-4 text-lg font-medium text-white hover:bg-green-600/90 transition-colors"
            >
              Ver Documentação
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
