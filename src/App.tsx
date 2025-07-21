
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Procedimentos from "./pages/Procedimentos";
import ProcedureDetail from "./pages/ProcedureDetail";
import BookingPage from "./pages/BookingPage";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Amenities from "./pages/Amenities";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminSystem from "@/pages/AdminSystem";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CookieBanner } from "./components/CookieBanner";
import { useTrackingIntegration } from "./hooks/useTrackingIntegration";

// Create a react-query client
const queryClient = new QueryClient();

// Componente wrapper para inicializar tracking
const AppWithTracking = () => {
  useTrackingIntegration();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/procedimentos" element={<Procedimentos />} />
        {/* Manter rota antiga para compatibilidade */}
        <Route path="/apartments" element={<Procedimentos />} />
        <Route path="/procedimento/:id" element={<ProcedureDetail />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminSystem />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppWithTracking />
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
