import { useEffect } from "react";
import EntryAnimation from "@/components/EntryAnimation";
import Cursor from "@/components/Cursor";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import GitHub from "@/components/GitHub";
import OpenSource from "@/components/OpenSource";
import BlogSection from "@/components/BlogSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionCounter from "@/components/SectionCounter";
import { initRevealAll } from "@/hooks/useReveal";

const Index = () => {
  useEffect(() => {
    const cleanup = initRevealAll();
    const t = setTimeout(() => initRevealAll(), 500);
    return () => {
      if (cleanup) cleanup();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <EntryAnimation />
      <Cursor />
      <ScrollProgress />
      <AvailabilityBanner />
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
        <OpenSource />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Index;
