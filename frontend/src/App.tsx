import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { PageTransition } from "@/components/transitions/PageTransition";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy load heavy pages
const Scan = lazy(() => import("./pages/Scan"));
const Browse = lazy(() => import("./pages/Browse"));
const Collection = lazy(() => import("./pages/Collection"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetching
      gcTime: 1000 * 60 * 10, // 10 minutes cache
      retry: 2, // Retry failed requests
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground mt-4">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - no background needed for login/register */}
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            
            {/* Routes with background */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <AmbientBackground />
                  <Index />
                </PageTransition>
              }
            />
            
            {/* Protected routes - lazy loaded for performance */}
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Suspense fallback={<PageLoader />}>
                      <AmbientBackground />
                      <Scan />
                    </Suspense>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Suspense fallback={<PageLoader />}>
                      <AmbientBackground />
                      <Browse />
                    </Suspense>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Suspense fallback={<PageLoader />}>
                      <AmbientBackground />
                      <Collection />
                    </Suspense>
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                </PageTransition>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
