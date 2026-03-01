"use client";

import { motion } from "framer-motion";
import IndianDecorativeLine from "@/components/ui/IndianDecorativeLine";
import TypewriterText from "@/components/ui/TypewriterText";
import MinimalistBlob from "@/components/three/MinimalistBlob";

export default function HeroSection() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* 3D Globy animated background */}
      <MinimalistBlob />

      {/* Indie Retro Grid Background Overlay - Subdued for better reading */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#slate-800_1px,transparent_1px),linear-gradient(to_bottom,#slate-800_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03] pointer-events-none z-0" />

      {/* Indian Minimalist Top-Down Decorative Line */}
      <IndianDecorativeLine />

      <div className="container mx-auto px-6 z-10 text-center flex flex-col items-center mt-12 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block glass px-4 py-2 rounded-full mb-8 z-10"
        >
          <span className="text-sm font-medium tracking-wider uppercase text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <TypewriterText text="ROOTED IN FIRST PRINCIPLES" delay={1.5} />
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-slate-900 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          Sandeepan <span className="text-gradient-primary">Kalita</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl md:max-w-3xl text-slate-500 mb-12 leading-relaxed z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          In an era where AI writes code, syntax is a commodity. 
          I focus on what machines can&apos;t auto-generate: 
          <strong> scalable architecture, deep algorithmic logic, and resilient system design.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 z-10"
        >
          <button className="bg-slate-900 text-white hover:bg-slate-800 active:scale-95 active:bg-slate-700 px-8 py-3 rounded-full font-medium transition-colors shadow-lg tracking-wide">
            Explore Architecture
          </button>
          <a 
            href="/resume/Sandeepan_Kalita_Resume.pdf" 
            download
            className="bg-white border-2 border-slate-300 text-slate-800 hover:border-slate-900 hover:text-slate-900 active:scale-95 px-8 py-3 rounded-full font-medium transition-all tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
