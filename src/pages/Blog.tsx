import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";

const posts = [
  { tag: "Heart Health", title: "5 daily habits proven to lower blood pressure", time: "6 min read", grad: "from-rose-400/30 to-rose-200/30" },
  { tag: "Pediatrics", title: "When should kids actually start sports? A doctor's guide", time: "4 min read", grad: "from-amber-400/30 to-amber-200/30" },
  { tag: "Mental Health", title: "The science of better sleep — what really works", time: "8 min read", grad: "from-violet-400/30 to-violet-200/30" },
  { tag: "Nutrition", title: "Mediterranean diet: 30-day starter plan", time: "10 min read", grad: "from-emerald-400/30 to-emerald-200/30" },
  { tag: "Preventive", title: "Annual checkups: what's worth it after 30", time: "5 min read", grad: "from-sky-400/30 to-sky-200/30" },
  { tag: "Wellness", title: "Mindful breathing: 4 techniques for busy days", time: "3 min read", grad: "from-teal-400/30 to-teal-200/30" },
];

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Health Tips"
        title={<>Care, <span className="text-gradient">distilled</span>.</>}
        description="Practical, doctor-reviewed insights you can actually use."
      />
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-card border shadow-card overflow-hidden group"
            >
              <div className={`aspect-[16/10] bg-gradient-to-br ${p.grad} relative`}>
                <div className="absolute inset-0 grid place-items-center text-6xl opacity-30 font-display font-bold">
                  {p.tag.charAt(0)}
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{p.tag}</span>
                <h3 className="mt-3 font-semibold text-lg leading-snug">{p.title}</h3>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="size-3.5" /> {p.time}</span>
                  <span className="text-primary font-medium inline-flex items-center group-hover:translate-x-1 transition cursor-pointer">Read <ArrowRight className="size-4 ml-1" /></span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>
    </>
  );
}
