"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import RenderingPopup from "./RenderingPopup";

const navLinks = [
  { href: "/", label: "HOME", num: "01" },
  { href: "/about", label: "ABOUT", num: "02" },
  { href: "/skills", label: "SKILLS", num: "03" },
  { href: "/projects", label: "WORK", num: "04" },
  { href: "/experience", label: "EXPERIENCE", num: "05" },
];

/** 
 * Reusable Nav Button configured to have exact dimensions 
 * so the Open and Close states overlap perfectly.
 */
const NavTriggerButton = ({ 
  onClick, 
  isOpen 
}: { 
  onClick: () => void; 
  isOpen: boolean; 
}) => {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        backgroundColor: isOpen ? "#0f172a" : "#ffffff", // slate-900 to white
        color: isOpen ? "#ffffff" : "#09090b",
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: isOpen ? 0 : 0.6 }}
      className="relative w-[120px] h-[44px] rounded-full flex items-center justify-center gap-2 font-black tracking-[0.2em] text-xs shadow-xl hover:scale-105 active:scale-95 transition-transform overflow-hidden pointer-events-auto"
    >
      {/* Inner border ring */}
      <motion.div 
        animate={{
          borderColor: isOpen ? "rgba(100, 116, 139, 0.3)" : "rgba(203, 213, 225, 1)"
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: isOpen ? 0 : 0.6 }}
        className="absolute inset-[3px] rounded-full border border-solid pointer-events-none" 
      />

      <span className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, delay: 0.6 } }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 absolute"
            >
              CLOSE <X size={14} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.6 } }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 absolute"
            >
              MENU <span className="text-lg leading-none">+</span>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

export default function SidebarNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const router = useRouter();
  const pathname = usePathname();

  // Reset navigation popup when route successfully changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setIsOpen(false);
    }, 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNavigate = (href: string) => {
    if (pathname === href) {
      setIsOpen(false);
      return;
    }
    
    setIsNavigating(true);
    setIsOpen(false);
    
    setTimeout(() => {
      router.push(href);
    }, 600);
  };

  return (
    <>
      <RenderingPopup isNavigating={isNavigating} />
      {/* Floating Menu Button */}
      <div className="fixed top-6 left-6 md:top-10 md:left-10 z-40 pointer-events-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, delay: 1 }}
            >
              <NavTriggerButton isOpen={false} onClick={() => setIsOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Overlay / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3, delay: 1.1 } }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ clipPath: "inset(16px calc(100% - 136px) calc(100% - 60px) 16px round 22px)" }}
              animate={{ clipPath: "inset(0px 0px 0px 0px round 32px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ clipPath: "inset(16px calc(100% - 136px) calc(100% - 60px) 16px round 22px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }}
              className="fixed top-2 left-2 w-[calc(100%-1rem)] md:top-6 md:left-6 md:w-[480px] min-h-[500px] h-auto pb-10 bg-[#0f172a] z-50 flex flex-col rounded-[32px] overflow-hidden border border-slate-700/30 shadow-2xl"
            >
              {/* Close Button - 16px offset perfectly cancels out the Drawer upshift against the original button */}
              <div className="absolute top-4 left-4">
                <NavTriggerButton isOpen={true} onClick={() => setIsOpen(false)} />
              </div>

              {/* Navigation Links - Add top padding to account for the absolute button */}
              <nav className="flex flex-col justify-center gap-1 px-10 md:px-14 flex-1 mt-20 pb-6">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  const isHovered = hoveredIndex === i;
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.06 } }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2, delay: i * 0.04 } }}
                      onClick={() => handleNavigate(link.href)}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative text-left group py-4 border-b border-slate-800/50 last:border-b-0"
                    >
                      <div className="flex items-center gap-5">
                        {/* Number */}
                        <span className={`font-mono text-[10px] tracking-widest transition-colors duration-300 ${
                          isActive ? "text-amber-500" : isHovered ? "text-amber-400" : "text-slate-600"
                        }`}>
                          {link.num}
                        </span>

                        {/* Label */}
                        <span className={`text-3xl md:text-4xl font-serif tracking-tight transition-all duration-500 ${
                          isActive 
                            ? "text-amber-400 italic" 
                            : isHovered
                              ? "text-white translate-x-2"
                              : "text-slate-400"
                        }`}>
                          {link.label}
                        </span>

                        {/* Hover arrow */}
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: isHovered ? 1 : 0, 
                            x: isHovered ? 0 : -10 
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-amber-500 text-lg ml-auto"
                        >
                          →
                        </motion.span>
                      </div>

                      {/* Active indicator line */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-amber-500 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom — minimal footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="px-8 md:px-12 pb-8 md:pb-10 pt-6 border-t border-slate-800/50"
              >
                <p className="text-slate-600 font-mono text-[10px] tracking-[0.2em] uppercase">
                  © {new Date().getFullYear()} · Sandeepan Kalita
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
