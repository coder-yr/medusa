import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "bot"; text: string };

const suggested = [
  "Book an appointment",
  "Clinic timings",
  "Available doctors",
  "Fees details",
  "Emergency contact",
  "Health checkup packages",
  "Where is the clinic located?",
  "What treatments are available?",
];

const reply = (q: string): string => {
  const t = q.toLowerCase();
  if (t.includes("book") || t.includes("appoint")) return "You can book in under 60 seconds on our Booking page. Want me to open it for you?";
  if (t.includes("timing") || t.includes("hours")) return "We're open Mon–Sat, 8:00 AM – 9:00 PM. Sunday: 9:00 AM – 2:00 PM (emergency 24/7).";
  if (t.includes("doctor")) return "We have 24 specialists across Cardiology, Dermatology, Pediatrics, Orthopedics, Neurology and more. Filter by specialty on the Services page.";
  if (t.includes("fee") || t.includes("price") || t.includes("cost")) return "Consultations start at ₹499. Video consults from ₹299. Health packages from ₹999.";
  if (t.includes("emergency")) return "For emergencies call +91 (80) 4736-0000 right now — our 24/7 line connects you with a triage nurse.";
  if (t.includes("location") || t.includes("where")) return "We're at Sector 30A, Vashi, Navi Mumbai. Free patient parking and ADA accessible.";
  if (t.includes("checkup") || t.includes("package")) return "Popular packages: Essential (₹999), Comprehensive (₹1,999), Executive (₹3,499). All include lab work + same-day report.";
  if (t.includes("treatment") || t.includes("service")) return "We offer preventive care, diagnostics, specialist consults, minor procedures, vaccinations and chronic care.";
  return "I'm Medora AI — happy to help with bookings, timings, services or guidance. Note: I can't replace a clinical diagnosis.";
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm Medora AI 👋 How can I help today?" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply(t) }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 group"
        aria-label="Open Medora AI"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <span className="relative grid place-items-center size-14 rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <MessageCircle className="size-6" />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed z-50 inset-0 md:inset-auto md:bottom-5 md:right-5 md:w-[400px] md:h-[620px] glass md:rounded-3xl shadow-glow flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-primary text-primary-foreground p-5 flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-xl bg-white/15 grid place-items-center">
                  <Sparkles className="size-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold leading-tight">Medora AI Assistant</p>
                <p className="text-xs opacity-80">Online · replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} className="size-9 grid place-items-center rounded-lg hover:bg-white/15" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/60">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2.5 text-sm rounded-2xl",
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-card border rounded-bl-md text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex">
                  <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-2 rounded-full bg-muted-foreground/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2 px-1">Suggested</p>
                  <div className="flex flex-wrap gap-2">
                    {suggested.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-muted transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t bg-card p-3 flex items-center gap-2"
            >
              <button type="button" aria-label="Voice" className="size-10 grid place-items-center rounded-xl hover:bg-muted text-muted-foreground">
                <Mic className="size-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your care…"
                className="flex-1 bg-muted/60 rounded-xl px-4 h-10 text-sm outline-none focus:ring-2 ring-primary/30"
              />
              <button type="submit" aria-label="Send" className="size-10 grid place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95">
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
