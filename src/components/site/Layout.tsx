import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Chatbot } from "@/components/site/Chatbot";
import { WhatsappCTA } from "@/components/site/WhatsappCTA";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Detect if the route is an app workspace, dashboard, consultation room, or clean auth page
  const isWorkspace = 
    location.pathname.startsWith("/patient") || 
    location.pathname.startsWith("/doctor") || 
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/medora") ||
    ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      {!isWorkspace && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isWorkspace && <Footer />}
      {!isWorkspace && <Chatbot />}
      {!isWorkspace && <WhatsappCTA />}
      <Toaster />
    </QueryClientProvider>
  );
}
