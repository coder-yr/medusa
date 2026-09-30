import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>We're here, <span className="text-gradient">whenever you need us</span>.</>}
        description="Reach our care team by phone, message or in person."
      />

      <Section>
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div className="space-y-4">
              {[
                { icon: Phone, title: "Call us", value: "+91 (80) 4736-0000", sub: "Mon–Sat, 8 AM – 9 PM" },
                { icon: Mail, title: "Email", value: "care@medora.health", sub: "We reply within 1 hour" },
                { icon: MapPin, title: "Visit the clinic", value: "Sector 30A, Vashi, Navi Mumbai", sub: "Free patient parking" },
                { icon: MessageCircle, title: "WhatsApp", value: "+91 85209 38870", sub: "Quick chat for questions" },
                { icon: Clock, title: "Emergency 24/7", value: "+91 (80) 4736-0000", sub: "Always answered live" },
              ].map((c) => (
                <div key={c.title} className="p-5 rounded-2xl bg-card border shadow-card flex items-start gap-4">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><c.icon className="size-5" /></div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.title}</p>
                    <p className="font-semibold">{c.value}</p>
                    <p className="text-sm text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl overflow-hidden border h-64 bg-gradient-soft grid place-items-center text-muted-foreground">
              <div className="text-center">
                <MapPin className="size-8 mx-auto text-primary" />
                <p className="mt-2 font-semibold">Map preview</p>
                <p className="text-sm">Sector 30A, Vashi, Navi Mumbai, MH</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! Our team will respond shortly."); setForm({ name: "", email: "", message: "" }); }}
            className="rounded-3xl bg-card border shadow-card p-6 md:p-8 h-fit w-full"
          >
            <h3 className="text-2xl font-bold">Send us a message</h3>
            <p className="text-sm text-muted-foreground mt-1">Typical reply within an hour.</p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full h-12 rounded-xl border bg-background px-4 outline-none focus:ring-2 ring-primary/30" />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1 w-full h-12 rounded-xl border bg-background px-4 outline-none focus:ring-2 ring-primary/30" />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="mt-1 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 ring-primary/30" />
              </label>
              <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground cursor-pointer">Send message</Button>
            </div>
          </motion.form>
        </div>
      </Section>
    </>
  );
}
