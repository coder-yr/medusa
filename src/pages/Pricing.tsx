import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, HelpCircle, ChevronDown, Sparkles, Building2, Stethoscope, 
  ShieldCheck, Shield, Zap, AlertCircle, Heart, ArrowRight, IndianRupee 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";

const plans = [
  {
    name: "Clinic Lite",
    icon: Stethoscope,
    desc: "Perfect for individual practitioners and small clinical setups starting with digitized operations.",
    monthlyPrice: 1875,
    annualPrice: 1499,
    popular: false,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 dark:border-blue-500/30",
    buttonText: "Start 14-Day Free Trial",
    features: [
      "1 Doctor & 2 Staff Seats",
      "NMC-Compliant E-Prescriptions",
      "Basic Electronic Medical Records (EMR)",
      "WhatsApp & SMS Appointment Reminders",
      "UPI & Cash Billing Module",
      "Standard Email Support (24h response)",
    ],
  },
  {
    name: "Polyclinic Pro",
    icon: Sparkles,
    desc: "For growing multi-doctor clinics and diagnostic hubs needing laboratory, pharmacy, and ABDM integrations.",
    monthlyPrice: 5625,
    annualPrice: 4499,
    popular: true,
    color: "from-primary/15 to-teal/15 border-primary/30 dark:border-primary/40",
    buttonText: "Start 14-Day Free Trial",
    features: [
      "Up to 10 Doctor & 20 Staff Seats",
      "Everything in Clinic Lite",
      "ABHA V2 ABDM Consent Management",
      "Integrated Laboratory & Pharmacy Modules",
      "GST Invoicing & Tax Report Generator",
      "Razorpay Gateway (UPI, Cards, EMI)",
      "AI Symptom Intake & Scribe (Trial)",
      "Priority Call & WhatsApp Support",
    ],
  },
  {
    name: "Hospital Enterprise",
    icon: Building2,
    desc: "Tailored for large multi-specialty hospitals demanding custom workflows, high-security audits, and dedicated hosting.",
    monthlyPrice: 24999,
    annualPrice: 19999,
    popular: false,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 dark:border-amber-500/30",
    buttonText: "Request Demo & Quote",
    features: [
      "Unlimited Doctor & Staff Seats",
      "Everything in Polyclinic Pro",
      "NABH Audit-Ready Activity Trails",
      "Custom NMC Telemedicine Video Integration",
      "Dedicated Private AWS/GCP Instance (Mumbai)",
      "Custom API Integrations (LIMS, HIS, EMR)",
      "Unlimited AI Scribe & Report Summary",
      "Dedicated Account Manager (24/7 SLA)",
    ],
  },
];

const faqs = [
  {
    q: "Are these prices inclusive of GST?",
    a: "No, a standard 18% GST is applicable to all SaaS plans. You can provide your healthcare facility's GSTIN during checkout to claim Input Tax Credit (ITC).",
  },
  {
    q: "Is patient data stored in India?",
    a: "Absolutely. In strict compliance with the Digital Personal Data Protection (DPDP) Act of India and National Health Authority (NHA) guidelines, all database records and file attachments are stored on AWS/GCP servers located in the India (Mumbai) region.",
  },
  {
    q: "What payment gateways are supported?",
    a: "For your patients, we integrate directly with Razorpay, allowing them to pay via UPI (GPay, PhonePe, Paytm), Net Banking, Credit/Debit cards, and wallet services. For your subscription, we support e-mandate UPI recurring transfers and credit cards.",
  },
  {
    q: "Is it fully NMC and ABDM compliant?",
    a: "Yes. Our prescription generator is designed according to the National Medical Commission (NMC) guidelines, including registration numbers and digital signatures. We are also an ABDM-approved partner, facilitating ABHA card registration and health record sharing.",
  },
  {
    q: "Can we downgrade or cancel anytime?",
    a: "Yes. You can cancel or change your plan at any time from the Super Admin Panel. If you cancel, your account will remain active until the end of the current billing cycle, and no further charges will be made.",
  },
];

const comparisonCategories = [
  {
    name: "EMR & Clinical Workflow",
    features: [
      { name: "NMC-Compliant Prescription Builder", lite: "✓", pro: "✓", enterprise: "✓" },
      { name: "Symptom & Vitals Recording", lite: "✓", pro: "✓", enterprise: "✓" },
      { name: "Upload External Reports (PDFs)", lite: "✓ (Limit 50MB)", pro: "✓ (Limit 5GB)", enterprise: "Unlimited" },
      { name: "AI Medical Scribe (Voice to Text)", lite: "—", pro: "100 consults/mo", enterprise: "Unlimited" },
      { name: "Smart Medicine & Dosage Suggestions", lite: "—", pro: "✓", enterprise: "✓" },
    ],
  },
  {
    name: "Indian Integrations",
    features: [
      { name: "ABHA Card Generation (Aadhaar/Mobile)", lite: "—", pro: "✓", enterprise: "✓" },
      { name: "ABDM Health Records Exchange", lite: "—", pro: "✓", enterprise: "✓" },
      { name: "GST Invoicing (Consultation, Meds, Labs)", lite: "—", pro: "✓", enterprise: "✓" },
      { name: "Razorpay / UPI Payment Gateway API", lite: "—", pro: "✓", enterprise: "✓" },
    ],
  },
  {
    name: "Staff & Admin Operations",
    features: [
      { name: "Doctor Seats Included", lite: "1", pro: "Up to 10", enterprise: "Unlimited" },
      { name: "Staff Seats (Receptionist, Pharmacist, Lab Tech)", lite: "2", pro: "Up to 20", enterprise: "Unlimited" },
      { name: "Walk-in & Queue Token System", lite: "✓", pro: "✓", enterprise: "✓" },
      { name: "Pharmacy & Lab Inventory Modules", lite: "—", pro: "✓", enterprise: "✓" },
      { name: "NABH Audit Trail & Compliance", lite: "—", pro: "—", enterprise: "✓" },
    ],
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [calcSeats, setCalcSeats] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Seat Calculator Logic
  const getCalcRecommended = () => {
    if (calcSeats <= 1) return { plan: "Clinic Lite", cost: billingCycle === "annual" ? 1499 : 1875 };
    if (calcSeats <= 10) return { plan: "Polyclinic Pro", cost: billingCycle === "annual" ? 4499 : 5625 };
    return { plan: "Hospital Enterprise", cost: billingCycle === "annual" ? 19999 : 24999 };
  };

  const recommended = getCalcRecommended();

  return (
    <div className="min-h-screen bg-background relative pt-24 pb-16 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-hero -z-10" />
      <div className="absolute top-20 -left-40 size-[500px] rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-20 -right-40 size-[500px] rounded-full bg-teal/15 blur-3xl -z-10" />

      {/* HERO SECTION */}
      <section className="container-px mx-auto max-w-7xl text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-6"
        >
          <Zap className="size-3.5 fill-primary/20" />
          Simplifying Clinical Operations Across India
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
        >
          Honest pricing for <br className="hidden sm:inline" />
          modern <span className="text-gradient">Indian healthcare</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Start digitalizing your OPD queue, EMR checklists, ABHA records, and billing today. 
          No setup fees. No hidden charges. 14-day trial on all tiers.
        </motion.p>

        {/* BILLING TOGGLE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <span className={`text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-14 h-7 rounded-full bg-primary/20 p-1 transition-all cursor-pointer relative"
          >
            <div className={`size-5 rounded-full bg-primary transition-all ${billingCycle === "annual" ? "ml-7" : "ml-0"}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold transition-colors ${billingCycle === "annual" ? "text-foreground" : "text-muted-foreground"}`}>Yearly Billing</span>
            <span className="text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </motion.div>
      </section>

      {/* PLAN CARDS */}
      <Section className="!py-6">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((p, i) => {
            const Icon = p.icon;
            const price = billingCycle === "annual" ? p.annualPrice : p.monthlyPrice;
            const savings = (p.monthlyPrice - p.annualPrice) * 12;

            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`flex flex-col justify-between rounded-3xl bg-card border-2 shadow-card p-8 relative overflow-hidden transition-all duration-300 ${
                  p.popular ? "border-primary ring-4 ring-primary/5 shadow-glow" : "border-border"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-soft">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className={`size-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-6 text-primary`}>
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed min-h-[48px]">{p.desc}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-muted-foreground relative -top-3">₹</span>
                    <span className="text-4xl font-extrabold tracking-tight">{price.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-muted-foreground font-semibold">/month</span>
                  </div>

                  {billingCycle === "annual" && (
                    <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                      Billed yearly (Save ₹{savings.toLocaleString("en-IN")}/yr)
                    </p>
                  )}

                  <div className="my-8 border-t border-dashed" />

                  <ul className="space-y-3.5">
                    {p.features.map((f, k) => (
                      <li key={k} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <Check className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link to="/register">
                    <Button
                      className={`w-full h-11 rounded-xl font-bold text-sm cursor-pointer shadow-soft transition-all duration-300 ${
                        p.popular 
                          ? "bg-gradient-primary text-primary-foreground hover:opacity-95" 
                          : "bg-secondary text-secondary-foreground hover:bg-muted border border-border"
                      }`}
                    >
                      {p.buttonText} <ArrowRight className="size-4 ml-1.5 shrink-0" />
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-[10px] text-muted-foreground">
                    14-day free trial · No credit card required
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* INTERACTIVE PLAN CALCULATOR */}
      <Section className="!py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass border rounded-3xl p-6 md:p-10 shadow-card"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Interactive Estimator
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight">Estimate for your facility</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Drag the slider to set the number of active doctors at your clinic or hospital to find the perfect plan.
              </p>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Doctor Seats Required</span>
                  <span className="text-lg font-bold text-primary bg-primary/8 px-3 py-1 rounded-xl">{calcSeats} {calcSeats === 1 ? "Doctor" : "Doctors"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcSeats}
                  onChange={(e) => setCalcSeats(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-muted border appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-2">
                  <span>1 (Single Clinic)</span>
                  <span>10 (Polyclinic)</span>
                  <span>30+ (Multi-specialty Hospital)</span>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 text-center shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Recommended Plan</p>
              <h4 className="text-2xl font-extrabold mt-1 text-primary">{recommended.plan}</h4>
              
              <div className="mt-4 flex justify-center items-baseline">
                <span className="text-xs font-semibold relative -top-3">₹</span>
                <span className="text-4xl font-extrabold">{recommended.cost.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {billingCycle === "annual" ? "billed annually (exclusive of 18% GST)" : "billed monthly (exclusive of 18% GST)"}
              </p>

              <div className="mt-6 space-y-2.5">
                <Link to="/register">
                  <Button className="w-full h-10 rounded-xl font-bold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 text-xs cursor-pointer">
                    Get Started With Free Trial
                  </Button>
                </Link>
                <Link to="/contact">
                  <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Talk to our Integration Team
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* PLAN MATRIX */}
      <Section className="!py-8" align="center" title={<>Compare <span className="text-gradient">Plan Features</span></>}>
        <div className="max-w-4xl mx-auto bg-card border rounded-3xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-4.5 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider w-[40%]">Features</th>
                  <th className="py-4.5 px-4 text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">Clinic Lite</th>
                  <th className="py-4.5 px-4 text-xs font-bold text-center text-primary uppercase tracking-wider">Polyclinic Pro</th>
                  <th className="py-4.5 px-4 text-xs font-bold text-center text-muted-foreground uppercase tracking-wider">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category) => (
                  <tr key={category.name}>
                    <td colSpan={4} className="p-0">
                      <table className="w-full text-left">
                        <tbody>
                          <tr className="bg-muted/10">
                            <td colSpan={4} className="py-2.5 px-6 text-xs font-bold text-primary/80 tracking-wide uppercase">
                              {category.name}
                            </td>
                          </tr>
                          {category.features.map((f, k) => (
                            <tr key={k} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                              <td className="py-3 px-6 text-sm text-foreground/80 font-medium w-[40%]">{f.name}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-center text-muted-foreground">{f.lite}</td>
                              <td className="py-3 px-4 text-sm font-bold text-center text-primary">{f.pro}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-center text-muted-foreground">{f.enterprise}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* COMPLIANCE CERTIFICATIONS */}
      <Section className="!py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 border rounded-2xl bg-card shadow-card flex flex-col items-center">
            <ShieldCheck className="size-8 text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">ISO 27001 Certified</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Information Security</p>
          </div>
          <div className="p-4 border rounded-2xl bg-card shadow-card flex flex-col items-center">
            <Building2 className="size-8 text-indigo-500 mb-2" />
            <p className="text-xs font-bold text-foreground">ABDM Integrated</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">NHA Milestones Compliant</p>
          </div>
          <div className="p-4 border rounded-2xl bg-card shadow-card flex flex-col items-center">
            <Shield className="size-8 text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-foreground">DPDP Act Ready</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Indian Data Residency</p>
          </div>
          <div className="p-4 border rounded-2xl bg-card shadow-card flex flex-col items-center">
            <AlertCircle className="size-8 text-amber-500 mb-2" />
            <p className="text-xs font-bold text-foreground">GST Complaint</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">B2B Input Tax Credit</p>
          </div>
        </div>
      </Section>

      {/* FAQ SECTION */}
      <Section className="!pb-20" eyebrow="FAQ" title="Frequently Asked Questions" align="center">
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all shadow-card ${
                  isOpen ? "bg-muted/20 border-primary/20" : "bg-card border-border hover:bg-muted/10"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-sm cursor-pointer select-none"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`size-4.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t pt-3">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
