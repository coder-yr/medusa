import { useState } from "react";
import { Link, useNavigate as useNav } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, Activity, User, Phone, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNav();
  const [step, setStep] = useState(1); // 1: Form details, 2: OTP Verification
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "patient" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Please fill in all details.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success(`Verification code sent to ${form.phone}! Enter 123456 to verify.`);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      toast.error("Invalid verification code. Please try '123456'.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully!");
      localStorage.setItem("userRole", form.role);
      localStorage.setItem("userName", form.name);
      navigate(form.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-12 overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-hero -z-10" />
      <div className="absolute top-20 -left-40 size-[520px] rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-40 size-[520px] rounded-full bg-teal/15 blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-glow border bg-card/85 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl mx-auto justify-center text-foreground decoration-transparent">
              <span className="grid place-items-center size-10 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Activity className="size-5" />
              </span>
              <span>Medora<span className="text-primary">.</span></span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold mt-4 tracking-tight">Create Account</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Secure video consultations and telemedicine portal.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmitDetails}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1.5 rounded-2xl border">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "patient" })}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      form.role === "patient" ? "bg-gradient-primary text-primary-foreground shadow-soft" : "hover:bg-card text-muted-foreground"
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "doctor" })}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      form.role === "doctor" ? "bg-gradient-primary text-primary-foreground shadow-soft" : "hover:bg-card text-muted-foreground"
                    }`}
                  >
                    Doctor/Specialist
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                      <User className="size-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 pl-10 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm transition-all focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                      <Mail className="size-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 pl-10 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm transition-all focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                      <Phone className="size-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-12 pl-10 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm transition-all focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                      <Lock className="size-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full h-12 pl-10 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm transition-all focus:border-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow font-semibold transition-all hover:opacity-95 hover:scale-[1.01] cursor-pointer"
                >
                  {loading ? "Registering..." : "Send Verification Code"}
                </Button>

                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="bg-primary/5 rounded-2xl p-4 border text-center text-sm mb-4">
                  <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-2">
                    <KeyRound className="size-5" />
                  </div>
                  <p className="font-bold text-foreground">Verify Your Phone Number</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We sent a verification code to <span className="font-medium text-foreground">{form.phone}</span>.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification OTP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-12 text-center text-lg font-mono tracking-widest rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 transition-all focus:border-primary"
                  />
                  <p className="text-[10px] text-center text-muted-foreground mt-1">Hint: For the demo, enter <b>123456</b></p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow font-semibold transition-all hover:opacity-95 hover:scale-[1.01] cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify & Complete Signup"}
                </Button>

                <div className="flex justify-between items-center text-xs mt-4">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(""); }}
                    className="font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                  >
                    ← Edit details
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("OTP code resent! Enter 123456.")}
                    className="font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
