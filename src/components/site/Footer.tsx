import { Link } from "react-router-dom";
import { Stethoscope, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-gradient-soft">
      <div className="container-px mx-auto max-w-7xl py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid place-items-center size-9 rounded-xl bg-gradient-primary text-primary-foreground">
              <Stethoscope className="size-5" />
            </span>
            Medora<span className="text-primary">.</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Modern, compassionate healthcare powered by technology. Trusted by 50,000+ patients across the country.
          </p>
          <div className="flex gap-2 mt-5">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid place-items-center size-9 rounded-lg border hover:bg-muted transition" aria-label="Social">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Clinic</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Health Tips</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Patients</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/booking" className="hover:text-foreground">Book Appointment</Link></li>
            <li><a href="#" className="hover:text-foreground">Video Consultation</a></li>
            <li><a href="#" className="hover:text-foreground">Upload Prescription</a></li>
            <li><a href="#" className="hover:text-foreground">Insurance</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Reach us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="size-4 mt-0.5 text-primary" /> +91 (80) 4736-0000</li>
            <li className="flex gap-2"><Mail className="size-4 mt-0.5 text-primary" /> care@medora.health</li>
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-primary" /> Sector 30A, Vashi,<br />Navi Mumbai, MH</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-px mx-auto max-w-7xl py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Medora Health, Inc. All rights reserved.</p>
          <p>HIPAA Compliant · ISO 27001 · Licensed Physicians</p>
        </div>
      </div>
    </footer>
  );
}
