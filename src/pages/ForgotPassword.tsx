import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Activity, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Password reset instructions sent to your email!");
    }, 1000);
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
            <h2 className="text-xl sm:text-2xl font-bold mt-4 tracking-tight">Reset Password</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Enter your email to receive recovery instructions.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleReset} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm transition-all focus:border-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow font-semibold transition-all hover:opacity-95 hover:scale-[1.01] cursor-pointer"
              >
                {loading ? "Sending link..." : "Send Reset Instructions"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center mx-auto">
                <KeyRound className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Check your inbox</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've sent a link to reset your password to <b>{email}</b>. Please check your spam folder if you do not receive it in a few minutes.
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Resend Email
              </Button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
