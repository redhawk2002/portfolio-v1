"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if this is the first time loading in this session
    const hasVisited = sessionStorage.getItem("hasVisited");
    
    if (!hasVisited) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSplash(true);
      // Wait for the animation to finish before marking as visited
      // so that it doesn't instantly snap away
      setTimeout(() => {
        sessionStorage.setItem("hasVisited", "true");
        setShowSplash(false);
      }, 4500); // Drastically reduced to 4.5s for a faster, punchier load
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: "-100%", 
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden pointer-events-auto"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_50%)]" />

          {/* Vertical Ambient Indie Style Line */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: ["0vh", "100vh", "30vh"], opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, times: [0, 0.5, 1], ease: "easeInOut" }}
            className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent"
          />

          <div className="flex flex-col items-center justify-center relative w-full h-[300px] z-10">
            {/* Phase 1: Philosophy Part 1 */}
            <motion.h2
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"], y: [10, 0, 0, -10] }}
              transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
              className="absolute text-lg md:text-xl font-serif text-amber-500/70 italic tracking-widest"
            >
              &quot;Syntax is a commodity.&quot;
            </motion.h2>

            {/* Phase 2: Philosophy Part 2 */}
            <motion.h2
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"], y: [10, 0, 0, -10] }}
              transition={{ duration: 1.5, delay: 1.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
              className="absolute text-lg md:text-xl font-serif text-amber-500/70 italic tracking-widest"
            >
              &quot;Resilient architecture is an art.&quot;
            </motion.h2>

            {/* Phase 3: The Conclusion */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, letterSpacing: "0.1em", filter: "blur(8px)" }}
              animate={{ opacity: [0, 1, 1], scale: [0.95, 1, 1], letterSpacing: ["0.1em", "0.3em", "0.3em"], filter: ["blur(8px)", "blur(0px)", "blur(0px)"] }}
              transition={{ duration: 2, delay: 3.0, times: [0, 0.4, 1], ease: "easeOut" }}
              className="absolute text-2xl md:text-5xl font-serif text-amber-500 uppercase whitespace-nowrap"
            >
              Rooted in Logic
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 1], y: [10, 0, 0] }}
              transition={{ duration: 1.2, delay: 3.2, ease: "easeOut" }}
              className="absolute mt-24 text-xs md:text-sm font-mono text-amber-100/40 tracking-[0.4em] uppercase whitespace-nowrap"
            >
              Built to Scale
            </motion.p>
          </div>

          {/* Loading Progress Bar */}
          <div className="absolute bottom-12 w-48 h-[1px] bg-slate-800 overflow-hidden z-20">
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: [0, 0.3, 0.7, 1] }}
              transition={{ duration: 3.8, ease: "easeInOut", delay: 0.2 }}
              className="h-full bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            />
          </div>

          {/* Exiting Bridge Line downwards */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "30vh", opacity: 1 }}
            transition={{ duration: 1.0, delay: 3.5, ease: "easeInOut" }}
            className="absolute bottom-0 w-[1px] bg-gradient-to-b from-amber-500/50 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
