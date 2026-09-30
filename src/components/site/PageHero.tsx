import { motion } from "framer-motion";
import { type ReactNode } from "react";

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: ReactNode; description?: ReactNode }) {
  return (
    <section className="relative pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-hero -z-10" />
      <div className="absolute -top-32 -right-32 size-[480px] rounded-full bg-teal/20 blur-3xl -z-10" />
      <div className="container-px mx-auto max-w-5xl text-center">
        {eyebrow && (
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex text-xs uppercase tracking-wider font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="mt-4 text-4xl md:text-6xl font-bold tracking-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
