import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { PageTransition } from "@/components/transitions/PageTransition";
import Index from "./pages/Index";
import Scan from "./pages/Scan";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Collection from "./pages/Collection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AmbientBackground />
          <Routes>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <PageTransition><Scan /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <PageTransition><Browse /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  <PageTransition><Collection /></PageTransition>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
