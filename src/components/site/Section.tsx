import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "center",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <section id={id} className={cn("container-px mx-auto max-w-7xl py-20 md:py-28", className)}>
      {(eyebrow || title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={cn("max-w-3xl mb-12", align === "center" ? "mx-auto text-center" : "")}
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/8 px-3 py-1 rounded-full">
              {eyebrow}
            </span>
          )}
          {title && <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
