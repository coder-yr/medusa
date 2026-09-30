import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Stethoscope, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Health Tips" },
  { to: "/contact", label: "Contact" },
  { to: "/medora", label: "Platform Demo" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container-px mx-auto max-w-7xl">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 md:px-6 h-14 md:h-16 transition-all",
            (scrolled || open) ? "bg-white dark:bg-card border border-border shadow-card" : "bg-transparent"
          )}
        >
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid place-items-center size-9 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Stethoscope className="size-5" />
            </span>
            <span>Medora<span className="text-primary">.</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/8"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
              className="hidden md:grid place-items-center size-9 rounded-lg hover:bg-muted text-foreground/70 transition cursor-pointer"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {localStorage.getItem("userRole") ? (
              <Link to={
                localStorage.getItem("userRole")?.toLowerCase() === "patient" ? "/patient/dashboard" :
                  localStorage.getItem("userRole")?.toLowerCase() === "doctor" ? "/doctor/dashboard" :
                    "/admin/dashboard"
              }>
                <Button className="rounded-full bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-105 transition-transform cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full border border-primary/20 text-foreground hover:bg-muted transition cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link to="/booking" className="hidden md:inline-flex">
                  <Button className="rounded-full bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-105 transition-transform cursor-pointer">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}

            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden grid place-items-center size-10 rounded-lg hover:bg-muted cursor-pointer"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 bg-white dark:bg-card border border-border rounded-2xl p-3 shadow-card"
          >
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-3 py-3 rounded-lg text-sm font-medium hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
              {localStorage.getItem("userRole") ? (
                <Link to={
                  localStorage.getItem("userRole")?.toLowerCase() === "patient" ? "/patient/dashboard" :
                    localStorage.getItem("userRole")?.toLowerCase() === "doctor" ? "/doctor/dashboard" :
                      "/admin/dashboard"
                } className="mt-2">
                  <Button className="w-full rounded-xl bg-gradient-primary text-primary-foreground">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full rounded-xl border border-primary/20 text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/booking">
                    <Button className="w-full rounded-xl bg-gradient-primary text-primary-foreground">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
