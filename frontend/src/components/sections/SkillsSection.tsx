"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useRef } from "react";

// Data is fetched dynamically from the Prisma backend.

interface SkillDomain {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

function InteractiveSkillCard({ domain, idx }: { domain: SkillDomain, idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle tilt for the skill cards
  const rotateX = useTransform(smoothY, [-150, 150], [5, -5]);
  const rotateY = useTransform(smoothX, [-150, 150], [-5, 5]);

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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000, rotateX, rotateY }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + (idx * 0.1), ease: "easeOut" }}
      className="glass p-8 relative border border-slate-200/60 bg-white/40 group hover:shadow-xl hover:bg-white/70 transition-all duration-500"
    >
      {/* Indie Architectural Corner Borders */}
      <div className="absolute top-0 left-0 w-4 h-[1px] bg-amber-500/50" />
      <div className="absolute top-0 left-0 w-[1px] h-4 bg-amber-500/50" />
      
      <div className="font-mono text-xs text-slate-400 mb-4 tracking-widest group-hover:text-amber-600 transition-colors">DOMAIN // {domain.id}</div>
      <h3 className="text-2xl font-serif text-slate-800 mb-2">{domain.title}</h3>
      <p className="text-sm font-light text-slate-500 mb-8 md:h-10">{domain.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {domain.skills.map((skill, i) => (
          <span 
            key={i} 
            className="px-3 py-1 bg-slate-50 border border-slate-200 group-hover:border-slate-300 text-xs font-mono text-slate-600 shadow-sm transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";

export default function SkillsSection() {
  const [skills, setSkills] = useState<SkillDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${API_URL}/api/sections/skills`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setSkills(data.items.map((item: { content: SkillDomain }) => item.content));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="skills" className="min-h-screen relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Indie Retro Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="container mx-auto px-6 max-w-6xl z-10 relative">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="h-[1px] w-12 bg-amber-500/50" />
            <span className="font-mono text-xs tracking-[0.3em] text-amber-600/70 uppercase">SYS.SKILLS // 02</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif text-slate-800 tracking-wide"
          >
            Technical <br/>
            <span className="italic text-slate-500">Arsenal.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 min-h-[300px]">
          {isLoading && (
            <div className="md:col-span-3 py-20 text-center text-amber-600/70 font-mono text-sm tracking-widest animate-pulse">
              [ F E T C H I N G _ D A T A . . . ]
            </div>
          )}
          {!isLoading && skills.map((domain, idx) => (
            <InteractiveSkillCard key={domain.id || idx} domain={domain} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
