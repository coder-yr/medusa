import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Shield, Star, ArrowRight, CheckCircle2, Stethoscope, HeartPulse, Brain,
  Baby, Bone, Eye, Sparkles, Phone, MessageSquare, Activity, ShieldCheck, Award,
  ChevronDown, Check,
} from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { cn } from "@/lib/utils";

const services = [
  { icon: HeartPulse, title: "Cardiology", desc: "Heart screenings, ECG, and chronic care led by board-certified cardiologists.", color: "from-rose-500/15 to-rose-500/5" },
  { icon: Brain, title: "Neurology", desc: "Migraine, sleep and cognitive consultations with same-week MRI access.", color: "from-violet-500/15 to-violet-500/5" },
  { icon: Baby, title: "Pediatrics", desc: "Gentle care for newborns to teens, with vaccination & growth tracking.", color: "from-amber-500/15 to-amber-500/5" },
  { icon: Bone, title: "Orthopedics", desc: "Joint pain, sports injuries and physiotherapy under one roof.", color: "from-emerald-500/15 to-emerald-500/5" },
  { icon: Eye, title: "Ophthalmology", desc: "Vision tests, LASIK consults and advanced retinal imaging.", color: "from-sky-500/15 to-sky-500/5" },
  { icon: Stethoscope, title: "General Medicine", desc: "Primary care, preventive screenings and chronic disease management.", color: "from-teal-500/15 to-teal-500/5" },
];

const stats = [
  { value: "50K+", label: "Patients treated" },
  { value: "24", label: "Specialists" },
  { value: "18+", label: "Years of care" },
  { value: "4.9", label: "Avg. rating" },
];

const reasons = [
  { icon: ShieldCheck, title: "Board-Certified Doctors", desc: "Every physician is verified, licensed and reviewed by peers." },
  { icon: Activity, title: "Same-Day Appointments", desc: "Real-time slot availability — no phone tag, no waiting rooms." },
  { icon: Sparkles, title: "AI Care Companion", desc: "Instant answers about symptoms, prep and follow-ups, 24/7." },
  { icon: Award, title: "Transparent Pricing", desc: "Know the price before you book. Insurance accepted." },
];

const testimonials = [
  { name: "Karan Malhotra", role: "Vashi, Navi Mumbai", quote: "Extremely seamless booking. Met Dr. Sharma at the Vashi clinic within 2 hours. The digitized health records on the app are incredibly convenient.", rating: 5 },
  { name: "Anjali Deshmukh", role: "Koparkhairane", quote: "Finding a reliable pediatrician in Navi Mumbai used to be a chore. Medora is a lifesaver — no waiting rooms and extremely polite staff.", rating: 5 },
  { name: "Rohan Joshi", role: "Nerul", quote: "Very premium clinic design and tech integration. The AI assistant helped me understand my symptoms before my orthopedics appointment.", rating: 5 },
];

const faqs = [
  { q: "Do you accept insurance?", a: "Yes — we partner with all major Indian providers including Star Health, HDFC Ergo, ICICI Lombard, Niva Bupa and Care Health." },
  { q: "Can I do a video consultation?", a: "Absolutely. Choose 'Video Consult' during booking and you'll receive a secure video consultation link 10 minutes before." },
  { q: "Is the AI assistant a doctor?", a: "No. Medora AI helps with bookings, prep and general guidance. All clinical advice comes from our licensed physicians." },
  { q: "Where are you located?", a: "Our flagship clinic is at Sector 30A, Vashi, Navi Mumbai. We also offer home visits within 10 km." },
];

const specialtyOptions = [
  { value: "General Medicine", label: "General Medicine" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Ophthalmology", label: "Ophthalmology" },
];

const consultOptions = [
  { value: "in-clinic", label: "In-Clinic Visit" },
  { value: "video", label: "Video Consultation" },
];

const dateOptions = [
  { value: "today", label: "Today, ASAP" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
];

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

function CustomSelect({ label, value, onChange, options }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative rounded-2xl border bg-card p-3 flex flex-col justify-center select-none w-full">
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</label>
      <div 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between font-semibold text-sm mt-1 cursor-pointer text-foreground py-0.5"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2", open && "rotate-180")} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border bg-card/95 backdrop-blur-md shadow-glow p-1.5 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <Check className="size-4 shrink-0 ml-2" />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("General Medicine");
  const [selectedConsult, setSelectedConsult] = useState("in-clinic");
  const [selectedDate, setSelectedDate] = useState("today");
  return (
    <>
      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero -z-10" />
        <div className="absolute top-20 -left-40 size-[520px] rounded-full bg-primary/15 blur-3xl -z-10" />
        <div className="absolute bottom-0 -right-40 size-[520px] rounded-full bg-teal/25 blur-3xl -z-10" />

        <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Now accepting new patients · Same-day slots
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Healthcare that<br />feels <span className="text-gradient">personal</span> again.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              Book trusted specialists in minutes, chat with our AI care companion 24/7,
              and get the kind of attentive care your family deserves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/booking">
                <Button size="lg" className="rounded-full h-12 px-6 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 hover:scale-[1.02] transition-transform animate-pulse-subtle">
                  <Calendar className="mr-2 size-4" /> Book Appointment
                </Button>
              </Link>
              <a href="#chat" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLButtonElement>('[aria-label="Open Medora AI"]')?.click(); }}>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-6 hover:bg-muted hover:scale-[1.02] transition-transform">
                  <MessageSquare className="mr-2 size-4 text-primary" /> Ask Medora AI
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2"><Shield className="size-4 text-primary" /> HIPAA Compliant</div>
              <div className="flex items-center gap-2"><Star className="size-4 text-amber-500 fill-amber-500" /> 4.9 from 12,400 reviews</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Insurance accepted</div>
            </motion.div>
          </div>

          {/* Doctor card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-glow bg-gradient-primary aspect-[4/5] max-w-md mx-auto">
              <img src={heroDoctor} alt="Dr. Maya Patel" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <p className="text-sm opacity-90">Featured Specialist</p>
                <p className="text-xl font-semibold">Dr. Maya Patel, MD</p>
                <p className="text-sm opacity-90">Internal Medicine · 12 yrs</p>
              </div>
            </div>

            {/* Floating stat card with animated SVG pulse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="hidden md:flex absolute -left-6 top-10 glass rounded-2xl p-4 shadow-card items-center gap-3 w-64"
            >
              <div className="size-10 grid place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0"><HeartPulse className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">Vitals Today</p>
                <p className="text-sm font-bold text-foreground">72 BPM · Normal</p>
              </div>
              <svg className="w-16 h-8 text-emerald-500 shrink-0 ml-2" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M0 15 H30 L35 5 L40 25 L45 10 L50 20 L55 15 H100" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Floating stat card B */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="hidden md:flex absolute -right-4 bottom-10 glass rounded-2xl p-4 shadow-card items-center gap-3 w-60"
            >
              <div className="size-10 grid place-items-center rounded-xl bg-primary/15 text-primary relative"><Calendar className="size-5" /><span className="absolute top-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-card animate-ping" /></div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">Next Available Slot</p>
                <p className="text-sm font-bold text-foreground">Today · 3:40 PM</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Functional Interactive Booking Intake Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="container-px mx-auto max-w-6xl mt-16"
        >
          <div className="glass rounded-3xl p-4 md:p-6 shadow-card grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
            {/* Specialty Field */}
            <CustomSelect
              label="Specialty"
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
              options={specialtyOptions}
            />

            {/* Consult Type */}
            <CustomSelect
              label="Consult Type"
              value={selectedConsult}
              onChange={setSelectedConsult}
              options={consultOptions}
            />

            {/* Date Urgency */}
            <CustomSelect
              label="Availability"
              value={selectedDate}
              onChange={setSelectedDate}
              options={dateOptions}
            />

            {/* Submit Button */}
            <Button 
              onClick={() => {
                window.location.href = `/booking?specialty=${encodeURIComponent(selectedSpecialty)}&consult=${encodeURIComponent(selectedConsult)}&date=${encodeURIComponent(selectedDate)}`;
              }}
              className="h-14 w-full md:w-auto rounded-2xl bg-gradient-primary text-primary-foreground px-8 shadow-glow hover:opacity-95 font-semibold text-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Find Slots <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <Section className="!py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-6 rounded-2xl bg-card border shadow-card transition-all hover:shadow-glow group"
            >
              <p className="text-3xl md:text-5xl font-bold text-gradient group-hover:scale-105 transition-transform">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section
        eyebrow="Services"
        title={<>Specialty care, <span className="text-gradient">all in one place</span></>}
        description="From everyday checkups to complex specialties — our team is built around what modern families actually need."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group p-6 rounded-3xl bg-card border shadow-card relative overflow-hidden`}
            >
              <div className={`absolute -top-10 -right-10 size-40 rounded-full bg-gradient-to-br ${s.color} blur-2xl opacity-70`} />
              <div className="relative">
                <div className="size-12 grid place-items-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-5 inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                  Learn more <ArrowRight className="ml-1 size-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services"><Button variant="outline" className="rounded-full">View all services</Button></Link>
        </div>
      </Section>

      {/* WHY US */}
      <section className="bg-gradient-soft border-y">
        <Section eyebrow="Why Medora" title={<>Built around <span className="text-gradient">your trust</span></>} description="We've reimagined every step of care — from first click to follow-up.">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {/* Feature 1: Large Bespoke Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 p-8 rounded-3xl bg-card border shadow-card flex flex-col justify-between relative overflow-hidden group min-h-[300px]"
            >
              <div className="absolute -right-16 -top-16 size-48 rounded-full bg-gradient-primary blur-2xl opacity-15" />
              <div>
                <span className="text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">Bespoke Experience</span>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">The new gold standard of modern healthcare.</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  We blend verified medical expertise, luxurious physical clinic design, and instant technology to treat you like family, not a file number.
                </p>
              </div>
              <div className="mt-8 flex gap-4 text-xs font-semibold text-primary">
                <span>✓ ISO 9001 Certified</span>
                <span>•</span>
                <span>✓ 99.8% Patient Smile Rate</span>
              </div>
            </motion.div>

            {/* Staggered Right Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-3xl bg-card border shadow-card relative overflow-hidden transition-all hover:shadow-soft flex flex-col justify-between"
                >
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                  <div className="relative">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 transition-transform group-hover:scale-105">
                      <r.icon className="size-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{r.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* AI PREVIEW */}
      <Section align="left">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/8 px-3 py-1 rounded-full">
              <Sparkles className="size-3.5" /> AI Care Companion
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Answers in seconds.<br /><span className="text-gradient">Doctors in minutes.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Medora AI helps you understand symptoms, prepare for visits and find the right specialist —
              all while keeping your data private and secure.
            </p>
            <ul className="mt-6 space-y-3">
              {["24/7 multilingual support", "Pre-visit symptom intake", "Smart appointment routing", "Medication & lab reminders"].map((b) => (
                <li key={b} className="flex gap-2 text-sm"><CheckCircle2 className="size-5 text-primary shrink-0" /> {b}</li>
              ))}
            </ul>
            <div className="mt-7">
              <button
                onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Open Medora AI"]')?.click()}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-6 h-12 font-medium shadow-soft hover:opacity-95 cursor-pointer"
              >
                Try Medora AI <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="glass rounded-3xl p-6 shadow-glow relative overflow-hidden transition-transform"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center"><Sparkles className="size-5" /></div>
                <div>
                  <p className="font-semibold">Medora AI</p>
                  <p className="text-xs text-muted-foreground">Online now</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="max-w-[80%] bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">Hi! How can I help today?</div>
                <div className="max-w-[80%] ml-auto bg-gradient-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm">I have a mild fever and headache.</div>
                <div className="max-w-[85%] bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                  Got it. I can book you with Dr. Patel in General Medicine today at 3:40 PM. Shall I confirm?
                </div>
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                {["Yes, book it", "Other times", "Video consult"].map((c) => (
                  <span key={c} className="text-xs px-3 py-1.5 rounded-full border bg-card">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section eyebrow="Loved by patients" title={<>Stories from our <span className="text-gradient">community</span></>}>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative p-7 rounded-3xl bg-card border shadow-card overflow-hidden transition-all hover:shadow-soft group"
            >
              <div className="absolute -top-4 -right-2 text-9xl text-primary/5 font-serif select-none pointer-events-none group-hover:text-primary/10 transition-colors">"</div>
              <div className="relative">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="size-4 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-semibold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Questions, answered" align="center">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-card border p-5 shadow-card open:shadow-soft"
            >
              <summary className="cursor-pointer flex justify-between items-center font-medium">
                {f.q}
                <span className="ml-4 size-7 grid place-items-center rounded-full bg-primary/10 text-primary group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </Section>

      {/* EMERGENCY CTA */}
      <Section className="!pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-14 shadow-glow"
        >
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-teal/30 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-80">24/7 Emergency Line</p>
              <h3 className="mt-2 text-3xl md:text-4xl font-bold">When seconds matter, we answer first.</h3>
              <p className="mt-3 opacity-90 max-w-2xl">Call our triage nurses any time — day or night. We'll guide you and dispatch help if needed.</p>
            </div>
            <a href="tel:+918047360000" className="inline-flex items-center gap-3 rounded-2xl bg-white text-primary px-6 h-14 font-semibold shadow-soft hover:scale-[1.02] transition">
              <Phone className="size-5" /> +91 (80) 4736-0000
            </a>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
