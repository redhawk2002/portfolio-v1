"use client";

import { motion, AnimatePresence } from "framer-motion";
export default function RenderingPopup({ isNavigating }: { isNavigating: boolean }) {
  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center origin-top"
        >
          {/* Subtle loading indicator inside the wipe */}
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <span className="font-mono text-amber-500 tracking-[0.2em] text-sm uppercase">Loading...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
