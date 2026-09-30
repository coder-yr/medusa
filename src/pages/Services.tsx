import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse, Brain, Baby, Bone, Eye, Stethoscope, Activity, Syringe, Microscope, Pill, ShieldPlus, Video,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

const all = [
  { icon: HeartPulse, title: "Cardiology", price: "₹899", desc: "ECG, echo, stress tests and chronic heart care." },
  { icon: Brain, title: "Neurology", price: "₹1,299", desc: "Migraine, seizures, sleep and cognitive consults." },
  { icon: Baby, title: "Pediatrics", price: "₹599", desc: "Newborn-to-teen care including vaccinations." },
  { icon: Bone, title: "Orthopedics", price: "₹999", desc: "Joint pain, sports injuries, physiotherapy." },
  { icon: Eye, title: "Ophthalmology", price: "₹799", desc: "Eye exams, retinal imaging, LASIK consults." },
  { icon: Stethoscope, title: "General Medicine", price: "₹499", desc: "Primary care for adults and seniors." },
  { icon: Activity, title: "Diagnostics & Labs", price: "from ₹249", desc: "Blood work, imaging, same-day reports." },
  { icon: Syringe, title: "Vaccinations", price: "from ₹199", desc: "Flu, travel, COVID, childhood schedule." },
  { icon: Microscope, title: "Health Checkups", price: "from ₹999", desc: "Essential, Comprehensive, Executive plans." },
  { icon: Pill, title: "Pharmacy & Refills", price: "free", desc: "Online refills with home delivery." },
  { icon: ShieldPlus, title: "Insurance Help", price: "free", desc: "We file claims with most major providers." },
  { icon: Video, title: "Video Consultation", price: "₹299", desc: "Secure, tele-visits." },
];

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Everything your family needs, <span className="text-gradient">under one roof</span>.</>}
        description="Transparent pricing. Same-day availability. Insurance accepted."
      />
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ delay: (i % 6) * 0.04 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-3xl bg-card border shadow-card relative overflow-hidden group transition-all duration-300 hover:shadow-soft"
            >
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="size-12 grid place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 duration-300">
                    <s.icon className="size-6" />
                  </div>
                  <span className="text-sm font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full">{s.price}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <Link to={`/booking?specialty=${encodeURIComponent(s.title)}`}>
                  <Button variant="outline" className="mt-6 w-full rounded-xl h-11 border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-[1.01] transition-all">
                    Book Specialty Consultation
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
