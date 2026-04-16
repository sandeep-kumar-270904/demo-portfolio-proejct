import { useEffect } from "react";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import GitHub from "@/components/GitHub";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionCounter from "@/components/SectionCounter";
import { initRevealAll } from "@/hooks/useReveal";

const Index = () => {
  useEffect(() => {
    const cleanup = initRevealAll();
    // Re-init on dynamic content
    const t = setTimeout(() => initRevealAll(), 500);
    return () => {
      if (cleanup) cleanup();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Preloader />
      <Cursor />
      <Nav />
      <SectionCounter />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Testimonials />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
