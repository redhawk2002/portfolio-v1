"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Code2, ChefHat, BookOpen, CodeXml, Terminal } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { id: "github", icon: Github, label: "GitHub", href: "https://github.com/redhawk2002", color: "hover:bg-slate-800 hover:text-white" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/sandeepankalita/", color: "hover:bg-blue-600 hover:text-white" },
  { 
    id: "coding", 
    icon: Terminal, 
    label: "Coding Profiles", 
    color: "hover:bg-purple-600 hover:text-white",
    subLinks: [
      { id: "leetcode", icon: Code2, label: "LeetCode", href: "https://leetcode.com/u/kalitasandeepan/", color: "hover:bg-orange-500 hover:text-white" },
      { id: "tuf", icon: BookOpen, label: "TakeYouForward", href: "https://takeuforward.org/profile/RedHawk1804", color: "hover:bg-red-500 hover:text-white" },
      { id: "codechef", icon: ChefHat, label: "CodeChef", href: "https://www.codechef.com/users/red_hawk18", color: "hover:bg-amber-600 hover:text-white" },
    ]
  },
];

export default function CodeProfilesWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40 flex flex-col items-start gap-3 pointer-events-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, staggerChildren: 0.1 }}
            className="flex flex-col gap-3"
          >
            {socialLinks.map((link, i) => (
              <div key={link.id} className="relative group/folder flex items-center justify-start">
                {link.subLinks ? (
                  <>
                    {/* Hover Container for SubLinks - Flush to the parent icon so hover never drops */}
                    <div className="absolute left-full h-[60px] flex items-center gap-3 pl-4 opacity-0 -translate-x-2 pointer-events-none group-hover/folder:opacity-100 group-hover/folder:translate-x-0 group-hover/folder:pointer-events-auto transition-all duration-300">
                      {link.subLinks.map(sub => (
                        <Link key={sub.id} href={sub.href} target="_blank" rel="noopener noreferrer" className="relative group/sub">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 transition-colors duration-300 ${sub.color}`}>
                            <sub.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                          </div>
                          {/* Tooltip above the child link */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-lg opacity-0 translate-y-2 group-hover/sub:opacity-100 group-hover/sub:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                            {sub.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : null}

                {link.href ? (
                  <Link href={link.href!} target="_blank" rel="noopener noreferrer">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: (socialLinks.length - i) * 0.05 } }}
                      exit={{ opacity: 0, x: 20, transition: { delay: i * 0.05 } }}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 transition-colors duration-300 ${link.color} relative`}
                    >
                      <link.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-lg opacity-0 -translate-x-2 group-hover/folder:opacity-100 group-hover/folder:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        {link.label}
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: (socialLinks.length - i) * 0.05 } }}
                    exit={{ opacity: 0, x: 20, transition: { delay: i * 0.05 } }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 transition-colors duration-300 ${link.color} relative cursor-pointer`}
                  >
                    <link.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    {/* Tooltip for the parent folder (only shows when its children haven't expanded yet, optionally can just keep it always accessible) */}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        animate={{
          backgroundColor: isOpen ? "#1e293b" : "#ffffff", // slate-800 to white
          color: isOpen ? "#ffffff" : "#09090b", // white to zinc-950
          rotate: isOpen ? 180 : 0, // subtle twist on hover for code
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-xl border border-slate-200 hover:scale-110 active:scale-90 transition-transform overflow-hidden z-10"
      >
        <span className="sr-only">Toggle Coding Profiles</span>
        <CodeXml className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}
