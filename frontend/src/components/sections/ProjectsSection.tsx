"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { ExternalLink, Github } from "lucide-react";

// We will fetch this data dynmically from the backend.

interface ProjectData {
  title: string;
  category: string;
  description: string;
  tags: string[];
  live?: string;
  github?: string;
  color: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/sections/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setProjects(data.items.map((item: { content: ProjectData }) => item.content));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects", err);
        setIsLoading(false);
      });
  }, []);
  
  // Custom cursor tracking for the floating reveal image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smooth springs for tracking so the image lags satisfyingly behind the cursor
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const imgRotateX = useTransform(springY, [-500, 500], [15, -15]);
  const imgRotateY = useTransform(springX, [-500, 500], [-15, 15]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 200); // Offset by half the image width (400px/2)
    mouseY.set(e.clientY - rect.top - 150);  // Offset by half the image height (300px/2)
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Subtle Indie Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="h-[1px] w-12 bg-amber-500/50" />
            <span className="font-mono text-xs tracking-[0.3em] text-amber-600/70 uppercase">SYS.WORKS // 04</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif text-slate-800 tracking-wide"
          >
            Selected <br/>
            <span className="italic text-slate-500">Architecture.</span>
          </motion.h2>
        </div>

        {/* The Typographic List */}
        <div className="w-full border-t border-slate-200 min-h-[300px]">
          {isLoading && (
            <div className="py-20 text-center text-amber-600/70 font-mono text-sm tracking-widest animate-pulse">
              [ F E T C H I N G _ D A T A . . . ]
            </div>
          )}
          {!isLoading && projects.map((project, idx) => (
            <div 
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative border-b border-slate-200 group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between py-10 px-4 md:px-8 transition-colors duration-500 hover:bg-slate-50/50">
                
                {/* Left Side: Massive Typography Title */}
                <div className="relative z-10 w-full md:w-2/3">
                  <span className="font-mono text-xs text-amber-600/80 tracking-widest mb-4 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-4 group-hover:translate-x-0">
                    {"// " + project.category}
                  </span>
                  <h3 className="text-3xl md:text-5xl lg:text-7xl font-serif text-slate-400 group-hover:text-slate-900 transition-colors duration-500 uppercase tracking-tighter">
                    {project.title}
                  </h3>
                </div>

                {/* Right Side: Details & Tags (Only shows distinctly on hover) */}
                <div className="w-full md:w-1/3 flex flex-col items-start md:items-end mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 z-10">
                  <div className="flex flex-wrap gap-2 justify-start md:justify-end mb-6">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 border border-slate-200 bg-white font-mono text-[10px] text-slate-500 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-6">
                    {project.github && (
                      <a href={project.github} className="group/link flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-600 transition-colors">
                        <Github size={16} /> 
                        <span className="group-hover/link:underline underline-offset-4">Source</span>
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} className="group/link flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-600 transition-colors">
                        <ExternalLink size={16} /> 
                        <span className="group-hover/link:underline underline-offset-4">Live</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Floating Image Reveal Canvas (Follows Cursor) */}
      <motion.div 
        className="pointer-events-none absolute top-0 left-0 z-0 hidden md:block"
        style={{ x: springX, y: springY }}
      >
        {!isLoading && projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: hoveredIndex === idx ? 1 : 0, 
              scale: hoveredIndex === idx ? 1 : 0.8,
              rotateX: hoveredIndex === idx ? imgRotateX.get() : 0,
              rotateY: hoveredIndex === idx ? imgRotateY.get() : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`absolute top-0 left-0 w-[400px] h-[300px] bg-gradient-to-br ${String(project.color || '')} backdrop-blur-md border border-slate-200/50 shadow-2xl flex items-center justify-center overflow-hidden`}
            style={{ perspective: 1000 }}
          >
            {/* Project description overlay on the image */}
            <div className="absolute inset-0 bg-white/20" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="p-8 text-center relative z-10">
              <p className="text-slate-800 font-serif text-lg leading-relaxed bg-white/60 p-4 shadow-sm inline-block">
                &quot;{String(project.description || '')}&quot;
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
