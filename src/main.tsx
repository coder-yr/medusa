import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import Booking from "@/pages/Booking";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import PatientDashboard from "@/pages/PatientDashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import ConsultationRoom from "@/pages/ConsultationRoom";
import AdminDashboard from "@/pages/AdminDashboard";
import ReceptionistDashboard from "@/pages/ReceptionistDashboard";
import LabDashboard from "@/pages/LabDashboard";
import PharmacistDashboard from "@/pages/PharmacistDashboard";
import MedoraApp from "@/medora/MedoraApp";
import "./styles.css";

// Lazy-loaded standalone feature pages
const PrescriptionBuilderComp = lazy(() => import("@/pages/PrescriptionBuilder"));
const AnalyticsPageComp = lazy(() => import("@/pages/AnalyticsPage"));
const CRMPageComp = lazy(() => import("@/pages/CRMPage"));

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
    </div>
  </div>
);

const LazyPrescriptionBuilder = () => <Suspense fallback={<LoadingScreen />}><PrescriptionBuilderComp /></Suspense>;
const LazyAnalyticsPage = () => <Suspense fallback={<LoadingScreen />}><AnalyticsPageComp /></Suspense>;
const LazyCRMPage = () => <Suspense fallback={<LoadingScreen />}><CRMPageComp /></Suspense>;
const CalendarPlaceholder = () => <div className="flex min-h-[80vh] items-center justify-center"><p className="text-muted-foreground">Calendar view — coming soon!</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Medora MVP platform */}
          <Route path="/medora/*" element={<MedoraApp />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Patient Workspace */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          
          {/* Doctor Workspace */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/consultation/:id" element={<ConsultationRoom />} />
          <Route path="/doctor/prescription" element={<LazyPrescriptionBuilder />} />
          <Route path="/doctor/calendar" element={<CalendarPlaceholder />} />
          
          {/* Staff Workspaces */}
          <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
          <Route path="/lab/dashboard" element={<LabDashboard />} />
          <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
          
          {/* Admin Workspace */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<LazyAnalyticsPage />} />
          <Route path="/admin/crm" element={<LazyCRMPage />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
                <div className="max-w-md text-center">
                  <h1 className="text-7xl font-bold text-gradient">404</h1>
                  <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <a
                    href="/"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-medium cursor-pointer"
                  >
                    Go home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
