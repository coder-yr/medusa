import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

const doctors = [
  { name: "Dr. Maya Patel, MD", role: "Internal Medicine · 12 yrs", initials: "MP", rating: "4.9" },
  { name: "Dr. Daniel Cohen, MD", role: "Cardiology · 18 yrs", initials: "DC", rating: "5.0" },
  { name: "Dr. Aisha Khan, MD", role: "Pediatrics · 9 yrs", initials: "AK", rating: "4.9" },
  { name: "Dr. James Wright, DO", role: "Orthopedics · 14 yrs", initials: "JW", rating: "4.8" },
];

const values = [
  { icon: HeartHandshake, title: "Compassion first", desc: "We treat people, not charts. Every visit starts with listening." },
  { icon: ShieldCheck, title: "Uncompromising safety", desc: "HIPAA-compliant systems and rigorous clinical protocols." },
  { icon: Users, title: "Built for families", desc: "Care for every age, in one connected health record." },
  { icon: Award, title: "World-class team", desc: "Top 1% physicians from Stanford, Hopkins and Mayo." },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Medora"
        title={<>Care that's <span className="text-gradient">human</span>, powered by tech.</>}
        description="Founded in 2014, Medora set out to make world-class healthcare effortless — combining the warmth of a family doctor with the precision of modern medicine."
      />

      <Section eyebrow="Our values" title="What we stand for">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="p-6 rounded-3xl bg-card border shadow-card"
            >
              <v.icon className="size-7 text-primary" />
              <h3 className="mt-4 font-semibold text-lg">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <section className="bg-gradient-soft border-y">
        <Section eyebrow="Meet the team" title={<>Specialists you can <span className="text-gradient">trust</span></>}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctors.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-card border shadow-card text-center"
              >
                <div className="size-20 mx-auto rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-bold shadow-soft">
                  {d.initials}
                </div>
                <h3 className="mt-4 font-semibold">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.role}</p>
                <p className="text-xs mt-3 inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> Available today · ★ {d.rating}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/booking"><Button className="rounded-full bg-gradient-primary text-primary-foreground">Book with a specialist</Button></Link>
          </div>
        </Section>
      </section>
    </>
  );
}
