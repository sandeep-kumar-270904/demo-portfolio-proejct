import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ProjectDetail from "./pages/ProjectDetail";
import PageTransition from "./components/PageTransition";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import EntryAnimation from "./components/EntryAnimation";
import ClickSound from "./components/ClickSound";

const queryClient = new QueryClient();
const AnimatedRoutes = () => {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return (
    <LayoutGroup id="project-expansion">
      <AnimatePresence mode="sync">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/projects/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
};

const App = () => {
  useEffect(() => {
    if (document.querySelector("link[data-portfolio-fonts]")) return;
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.dataset.portfolioFonts = "true";
    fonts.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(fonts);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /><Sonner />
        <BrowserRouter>
          <SmoothScroll /><Cursor /><ClickSound />
          <EntryAnimation><AnimatedRoutes /></EntryAnimation>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
