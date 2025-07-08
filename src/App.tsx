import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* existing pages */
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/* new pages */
import CheckIn from "./pages/CheckIn";     // daily mood entry
import ChatRoom from "./components/ChatRoom";
import Dashboard from "./pages/Dashboard"; // (Step 8 chart page)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* global toast stacks */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Landing page (keep yours) */}
          <Route path="/" element={<Index />} />

          {/* NEW ROUTES */}
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/chat" element={<ChatRoom />} />
          {<Route path="/dashboard" element={<Dashboard />} />}

          {/* Catch‑all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
