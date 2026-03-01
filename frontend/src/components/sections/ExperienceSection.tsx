"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useRef } from "react";

// Data is fetched dynamically from the Prisma backend.

interface ExperienceData {
  id: string;
  role: string;
  company: string;
  client?: string;
  date: string;
  status: string;
  details: string[];
}

function InteractiveExperienceCard({ exp, idx }: { exp: ExperienceData; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-150, 150], [4, -4]);
  const rotateY = useTransform(smoothX, [-150, 150], [-4, 4]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: idx * 0.2, ease: "easeOut" }}
      className="relative pl-8 md:pl-16 group" // Increased left padding for a cleaner timeline
    >
      {/* Active vs Completed Timeline Node */}
      <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full z-10 ${exp.status === "ACTIVE" ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" : "bg-slate-500"}`} />
      
      {exp.status === "ACTIVE" && (
        <>
          {/* Radar Ripple */}
          <div className="absolute -left-3 top-[-2px] w-6 h-6 border border-amber-500 rounded-full animate-ping opacity-75" />
          {/* Steady Glow */}
          <div className="absolute -left-3 top-[-2px] w-6 h-6 border border-amber-500/30 rounded-full animate-pulse" />
        </>
      )}

      {/* Connection Line to Card */}
      <div className={`absolute left-0 top-2.5 h-[1px] w-8 md:w-16 transition-colors duration-500 ${exp.status === "ACTIVE" ? "bg-amber-500/30 group-hover:bg-amber-500/60" : "bg-slate-300 group-hover:bg-slate-400"}`} />

      {/* Interactive 3D Card */}
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000, rotateX, rotateY }}
        className="relative z-20"
      >
        <div className="glass p-6 md:p-10 relative border border-slate-200/60 bg-white/40 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
          
          {/* Subtle architectural border accents on hover */}
          <div className="absolute top-0 left-0 w-0 h-[2px] bg-amber-400 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-700 ease-out" />
          
          <div className="flex flex-col mb-8 border-b border-slate-200/50 pb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-slate-400 tracking-widest">{exp.id}</span>
              <span className={`font-mono text-[10px] px-2 py-0.5 border ${exp.status === "ACTIVE" ? "border-amber-500/50 text-amber-600 bg-amber-500/10" : "border-slate-300 text-slate-500 bg-slate-100"}`}>
                {exp.status}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-3xl font-serif text-slate-900 leading-tight">{exp.role}</h3>
              <span className="text-sm font-mono text-slate-500 bg-slate-100/80 px-4 py-1.5 border border-slate-200 whitespace-nowrap w-fit">
                {exp.date}
              </span>
            </div>
            
            <h4 className="text-lg text-slate-600 font-medium mt-2 tracking-wide">{exp.company}</h4>
            {exp.client && (
              <p className="text-sm text-slate-500 font-light mt-3 italic border-l-2 border-amber-500/30 pl-3">
                Client: {exp.client}
              </p>
            )}
          </div>

          <ul className="space-y-4">
            {exp.details.map((detail: string, i: number) => (
              <li key={i} className="text-slate-600 text-sm md:text-base leading-relaxed flex items-start group/item">
                <span className="text-amber-500 mr-4 mt-1.5 opacity-40 group-hover/item:opacity-100 transition-opacity text-xs">▹</span>
                <span className="flex-1 font-light">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/sections/experience")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setExperiences(data.items.map((item: { content: ExperienceData }) => item.content as ExperienceData));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch experiences", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="experience" className="min-h-screen relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Subtle Indie Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-6 max-w-5xl z-10 relative">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="h-[1px] w-12 bg-amber-500/50" />
            <span className="font-mono text-xs tracking-[0.3em] text-amber-600/70 uppercase">SYS.LOG // 03</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif text-slate-800 tracking-wide"
          >
            Professional <br/>
            <span className="italic text-slate-500">Journey.</span>
          </motion.h2>
        </div>

        <div className="relative ml-4 md:ml-8 pb-12">
          {/* Main Continuous Timeline Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-slate-200 via-slate-300 to-transparent" />
          
          <div className="space-y-24 min-h-[300px]">
            {isLoading && (
              <div className="py-20 text-center text-amber-600/70 font-mono text-sm tracking-widest animate-pulse">
                [ F E T C H I N G _ D A T A . . . ]
              </div>
            )}
            {!isLoading && experiences.map((exp, idx) => (
              <InteractiveExperienceCard key={exp.id} exp={exp} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
