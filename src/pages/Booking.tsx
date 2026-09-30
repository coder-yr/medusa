import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Check, ChevronLeft, Calendar, Clock, User, Sparkles, CheckCircle2, ArrowRight, Stethoscope, HeartPulse, Brain, Baby, Bone, Eye
} from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const specializations = ["General Medicine", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Ophthalmology"];
const specIcons: Record<string, any> = {
  "General Medicine": Stethoscope,
  "Cardiology": HeartPulse,
  "Neurology": Brain,
  "Pediatrics": Baby,
  "Orthopedics": Bone,
  "Ophthalmology": Eye
};
const doctors = [
  { name: "Dr. Maya Patel", spec: "General Medicine", rating: 4.9, exp: "12 yrs" },
  { name: "Dr. Rajesh Sharma", spec: "Cardiology", rating: 5.0, exp: "18 yrs" },
  { name: "Dr. Aisha Khan", spec: "Pediatrics", rating: 4.9, exp: "9 yrs" },
  { name: "Dr. Aditya Verma", spec: "Orthopedics", rating: 4.8, exp: "14 yrs" },
  { name: "Dr. Priya Nair", spec: "Neurology", rating: 4.9, exp: "11 yrs" },
  { name: "Dr. Vikram Malhotra", spec: "Ophthalmology", rating: 4.8, exp: "10 yrs" },
];

const slots = ["09:00", "09:30", "10:00", "11:00", "11:30", "13:00", "14:30", "15:00", "15:40", "16:30", "17:00", "18:00"];
const unavailable = new Set(["10:00", "13:00", "17:00"]);

const steps = ["Specialty", "Doctor", "Date & Time", "Your details", "Confirm"] as const;

function next7Days() {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(d);
  }
  return out;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get("specialty");

  const [step, setStep] = useState(0);
  const [spec, setSpec] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [done, setDone] = useState(false);

  // Initialize from search parameters if present
  useEffect(() => {
    if (specialtyParam && specializations.includes(specialtyParam)) {
      setSpec(specialtyParam);
      setStep(1); // Skip specialty selection step if passed via query param
    }
  }, [specialtyParam]);

  const days = useMemo(() => next7Days(), []);
  const filtered = doctor ? doctors.filter((d) => d.name === doctor) : doctors.filter((d) => !spec || d.spec === spec);

  const canNext =
    (step === 0 && !!spec) ||
    (step === 1 && !!doctor) ||
    (step === 2 && !!date && !!slot) ||
    (step === 3 && form.name && form.email && form.phone) ||
    step === 4;

  const goNext = () => {
    if (step === 4) {
      setDone(true);
      toast.success("Appointment confirmed! Check your email for details.");
    } else setStep((s) => s + 1);
  };

  return (
    <>
      <section className="pt-28 md:pt-32 pb-6 bg-hero">
        <div className="container-px mx-auto max-w-5xl text-center">
          <span className="inline-flex text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">Book in 60 seconds</span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Reserve your <span className="text-gradient">appointment</span></h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">Real-time availability — same-day slots included.</p>
        </div>
      </section>

      <Section className="!pt-6 sm:!pt-10">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="glass rounded-2xl p-3 md:p-4 shadow-card mb-8">
            <div className="text-center mb-3 md:hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Step {step + 1} of {steps.length}
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {steps[step]}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 md:gap-2">
              {steps.map((s, i) => {
                const active = i === step;
                const complete = i < step || done;
                return (
                  <div key={s} className={cn("flex items-center gap-1 md:gap-2 min-w-0", i < steps.length - 1 ? "flex-1" : "")}>
                    <div className={cn(
                      "size-7 sm:size-8 rounded-full grid place-items-center text-xs font-semibold shrink-0 transition",
                      complete ? "bg-gradient-primary text-primary-foreground" :
                      active ? "bg-primary/15 text-primary ring-2 ring-primary/30" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {complete ? <Check className="size-4" /> : i + 1}
                    </div>
                    <span className={cn("text-xs md:text-sm font-medium truncate hidden md:block", active ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                    {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border rounded-3xl shadow-card p-4 sm:p-6 md:p-8 min-h-[420px]">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                    className="size-20 mx-auto rounded-full bg-gradient-primary grid place-items-center shadow-glow"
                  >
                    <CheckCircle2 className="size-10 text-primary-foreground" />
                  </motion.div>
                  <h2 className="mt-6 text-3xl font-bold">You're all set, {form.name.split(" ")[0] || "friend"}!</h2>
                  <p className="mt-2 text-muted-foreground">A confirmation has been sent to <span className="font-medium text-foreground">{form.email}</span> and via SMS to {form.phone}.</p>
                  <div className="mt-6 inline-block text-left bg-muted/60 rounded-2xl p-5">
                    <p className="text-sm"><span className="text-muted-foreground">Specialty:</span> <b>{spec}</b></p>
                    <p className="text-sm mt-1"><span className="text-muted-foreground">Doctor:</span> <b>{doctor}</b></p>
                    <p className="text-sm mt-1"><span className="text-muted-foreground">When:</span> <b>{date} · {slot}</b></p>
                  </div>
                  <div className="mt-7">
                    <Button onClick={() => { setDone(false); setStep(0); setSpec(null); setDoctor(null); setDate(null); setSlot(null); }} className="rounded-full bg-gradient-primary text-primary-foreground">Book another</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {step === 0 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><Sparkles className="size-5 text-primary" /> What do you need help with?</h2>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1">Choose a specialty to see matching doctors.</p>
                      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {specializations.map((s) => {
                          const Icon = specIcons[s] || Stethoscope;
                          return (
                            <button
                              key={s}
                              onClick={() => setSpec(s)}
                              className={cn(
                                "p-3 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-28 sm:h-32 cursor-pointer w-full",
                                spec === s ? "border-primary bg-primary/8 ring-2 ring-primary/20" : "hover:bg-muted hover:shadow-soft hover:-translate-y-1"
                              )}
                            >
                              <div className="flex items-start justify-between w-full">
                                <div className={cn("size-9 sm:size-10 rounded-xl grid place-items-center transition-transform group-hover:scale-110", spec === s ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                                  <Icon className="size-4 sm:size-5" />
                                </div>
                                {spec === s && <Check className="size-4 text-primary" />}
                              </div>
                              <div>
                                <p className="font-bold text-foreground text-xs sm:text-sm tracking-tight">{s}</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">From ₹499 · Today</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><User className="size-5 text-primary" /> Pick a doctor</h2>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1">All physicians are board-certified.</p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-3">
                        {filtered.map((d) => (
                          <button
                            key={d.name}
                            onClick={() => setDoctor(d.name)}
                            className={cn(
                              "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all duration-300 w-full cursor-pointer",
                              doctor === d.name ? "border-primary bg-primary/8 ring-2 ring-primary/20" : "hover:bg-muted hover:shadow-soft hover:-translate-y-1"
                            )}
                          >
                            <div className="size-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold shrink-0">{d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm sm:text-base truncate">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.spec} · {d.exp}</p>
                              <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">★ {d.rating} · Available today</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><Calendar className="size-5 text-primary" /> Choose date & time</h2>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1">Real-time slot availability.</p>
                      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {days.map((d) => {
                          const key = d.toDateString();
                          const dayName = d.toLocaleDateString(undefined, { weekday: "short" });
                          const dayNum = d.getDate();
                          const month = d.toLocaleDateString(undefined, { month: "short" });
                          const active = date === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setDate(key)}
                              className={cn(
                                "shrink-0 px-4 py-3 rounded-2xl border text-center min-w-[78px] transition-all duration-300 cursor-pointer",
                                active ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-muted hover:-translate-y-1"
                              )}
                            >
                              <p className="text-[11px] uppercase tracking-wider opacity-80">{dayName}</p>
                              <p className="text-xl font-bold leading-none mt-1">{dayNum}</p>
                              <p className="text-[11px] mt-1 opacity-80">{month}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-semibold flex items-center gap-2"><Clock className="size-4 text-primary" /> Available slots</p>
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {slots.map((s) => {
                            const off = unavailable.has(s);
                            const active = slot === s;
                            return (
                              <button
                                key={s}
                                disabled={off}
                                onClick={() => setSlot(s)}
                                className={cn(
                                  "px-3 py-2 rounded-xl text-sm border transition-all duration-300 w-full cursor-pointer",
                                  off ? "opacity-40 cursor-not-allowed line-through" :
                                  active ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow" : "hover:bg-muted hover:border-primary/50 hover:shadow-sm"
                                )}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><User className="size-5 text-primary" /> Your details</h2>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1">We'll only use this for your appointment.</p>
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {[
                          { k: "name", label: "Full name", placeholder: "Jane Doe" },
                          { k: "email", label: "Email", placeholder: "jane@email.com", type: "email" },
                          { k: "phone", label: "Phone", placeholder: "+1 555 0100", type: "tel" },
                        ].map((f) => (
                          <label key={f.k} className="block">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{f.label}</span>
                            <input
                              type={f.type ?? "text"}
                              value={(form as any)[f.k]}
                              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                              placeholder={f.placeholder}
                              className="mt-1 w-full h-12 rounded-xl border bg-background px-4 outline-none focus:ring-2 ring-primary/30 text-base"
                            />
                          </label>
                        ))}
                        <label className="block sm:col-span-2">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Anything we should know? (optional)</span>
                          <textarea
                            rows={3}
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder="Symptoms, allergies, history…"
                            className="mt-1 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 ring-primary/30 text-base"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">Confirm your booking</h2>
                      <p className="text-muted-foreground text-sm sm:text-base mt-1">Please review the details below.</p>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {[
                          { k: "Specialty", v: spec, full: false },
                          { k: "Doctor", v: doctor, full: false },
                          { k: "Date", v: date, full: false },
                          { k: "Time", v: slot, full: false },
                          { k: "Name", v: form.name, full: true },
                          { k: "Email", v: form.email, full: true },
                          { k: "Phone", v: form.phone, full: true },
                        ].map((r) => (
                          <div key={r.k} className={cn("rounded-2xl border p-3 md:p-4 bg-muted/30", r.full ? "col-span-2" : "col-span-1")}>
                            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground">{r.k}</p>
                            <p className="font-semibold text-sm sm:text-base mt-1 break-words">{r.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!done && (
              <div className="mt-8 flex justify-between gap-3">
                <Button
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-full"
                >
                  <ChevronLeft className="size-4 mr-1" /> Back
                </Button>
                <Button
                  disabled={!canNext}
                  onClick={goNext}
                  className="rounded-full bg-gradient-primary text-primary-foreground px-6"
                >
                  {step === 4 ? "Confirm booking" : "Continue"} <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
