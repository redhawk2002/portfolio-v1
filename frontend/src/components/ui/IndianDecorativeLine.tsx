"use client";

import { motion } from "framer-motion";

export default function IndianDecorativeLine() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
      {/* Main Descending Line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "12vh" }}
        transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
        className="w-[1px] bg-gradient-to-b from-amber-500/80 to-amber-500/40"
      />
      
      {/* Traditional Indian Geometry: The Rhombus and Bindu */}
      <motion.div 
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 45 }}
        transition={{ delay: 3.5, duration: 1.5, ease: "backOut" }}
        className="w-3 h-3 md:w-4 md:h-4 border border-amber-500/60 flex items-center justify-center my-2"
      >
        {/* The Bindu (Center energy dot) */}
        <motion.div 
          animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />
      </motion.div>

      {/* Fading tail line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "6vh", opacity: 1 }}
        transition={{ delay: 4.5, duration: 2.5, ease: "easeOut" }}
        className="w-[1px] bg-gradient-to-b from-amber-500/40 to-transparent"
      />
      
      {/* Floating Particle at the tip */}
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 5.5 }}
        className="w-0.5 h-0.5 mt-2 bg-amber-400 rounded-full"
      />
    </div>
  );
}
