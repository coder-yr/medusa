import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope, User, ClipboardList, FlaskConical, Pill, ShieldAlert,
  ArrowRight, HeartPulse, Eye, EyeOff, Lock, Mail
} from "lucide-react";
import { toast } from "sonner";

const roles = [
  { id: "doctor", label: "Doctor", icon: Stethoscope, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", route: "/doctor/dashboard", desc: "Clinical workspace" },
  { id: "patient", label: "Patient", icon: User, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", route: "/patient/dashboard", desc: "Health portal" },
  { id: "receptionist", label: "Receptionist", icon: ClipboardList, color: "from-violet-500 to-purple-500", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", route: "/receptionist/dashboard", desc: "Front desk" },
  { id: "lab", label: "Lab Technician", icon: FlaskConical, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", route: "/lab/dashboard", desc: "Laboratory" },
  { id: "pharmacist", label: "Pharmacist", icon: Pill, color: "from-rose-500 to-pink-500", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", route: "/pharmacist/dashboard", desc: "Pharmacy" },
  { id: "admin", label: "Super Admin", icon: ShieldAlert, color: "from-slate-600 to-slate-800", bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", route: "/admin/dashboard", desc: "Control center" },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentRole = roles.find(r => r.id === selectedRole)!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter your credentials"); return; }
    setIsLoading(true);

    const names: Record<string, string> = {
      doctor: "Dr. Maya Patel",
      patient: "Jane Doe",
      receptionist: "Priya Sharma",
      lab: "Rahul Verma",
      pharmacist: "Anjali Singh",
      admin: "Admin Portal",
    };

    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem("userName", names[selectedRole]);
    localStorage.setItem("userRole", selectedRole);
    toast.success(`Welcome, ${names[selectedRole]}!`);
    navigate(currentRole.route);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center">
              <HeartPulse className="size-5" />
            </div>
            <span className="text-2xl font-bold font-display text-gradient">HealFlow AI</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Sign in to your workspace</h1>
          <p className="text-muted-foreground mt-2 text-sm">Select your role and access the platform</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-3xl p-6 shadow-card"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Select Your Role</p>
            <div className="grid grid-cols-2 gap-2.5">
              {roles.map((role) => {
                const Icon = role.icon;
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
                      active
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-transparent bg-muted/50 hover:border-border hover:bg-muted"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="roleActive"
                        className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-5"
                      />
                    )}
                    <div className={`size-8 rounded-xl ${role.bg} grid place-items-center mb-2`}>
                      <Icon className={`size-4 ${role.text}`} />
                    </div>
                    <p className={`text-xs font-bold ${active ? "text-primary" : "text-foreground"}`}>{role.label}</p>
                    <p className="text-[10px] text-muted-foreground">{role.desc}</p>
                    {active && (
                      <div className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border rounded-3xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`size-10 rounded-xl ${currentRole.bg} grid place-items-center`}>
                {(() => { const Icon = currentRole.icon; return <Icon className={`size-5 ${currentRole.text}`} />; })()}
              </div>
              <div>
                <p className="font-bold text-sm">{currentRole.label} Login</p>
                <p className="text-[11px] text-muted-foreground">{currentRole.desc} · HealFlow AI</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder={`${selectedRole}@healflow.ai`}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 focus:border-primary text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-11 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 focus:border-primary text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <a href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-soft hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="size-4" /></>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/register" className="font-semibold text-primary hover:underline">Register</a>
                </p>
              </div>
            </form>

            <div className="mt-6 p-3 rounded-xl bg-muted/50 border">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Demo Credentials</p>
              <p className="text-xs text-muted-foreground">Use any email + any password to demo login for the selected role.</p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          🔒 HIPAA-inspired security · End-to-end encrypted · NABH-ready platform
        </motion.p>
      </div>
    </div>
  );
}
