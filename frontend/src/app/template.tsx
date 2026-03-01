"use client";

import { motion } from "framer-motion";

/**
 * template.tsx wraps every page and is automatically re-mounted by Next.js on route change.
 * This component adds our "Storytelling Transition" slide-up effect between routes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>

      {/* Global In-Between Route Seamless Slide-Up Overlay */}
      <motion.div
        className="fixed inset-0 bg-slate-900 z-[100] pointer-events-none flex items-center justify-center transform origin-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* We can put a logo or "Loading..." text here if desired */}
      </motion.div>
    </>
  );
}
