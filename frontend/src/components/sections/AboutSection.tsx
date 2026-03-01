"use client";

import { motion, useMotionValue, useSpring, useTransform, useInView, animate, AnimatePresence } from "framer-motion";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

function AnimatedCounter({ 
  value, 
  duration = 2, 
  decimals = 0 
}: { 
  value: number; 
  duration?: number; 
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) {
            ref.current.textContent = v.toFixed(decimals);
          }
        }
      });
    }
  }, [isInView, value, duration, decimals]);

  return <span ref={ref}>0</span>;
}

function DynamicExperienceCounter() {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const startDate = new Date(2024, 10, 1); // November 2024 (month is 0-indexed)
    const now = new Date();
    const totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const target = parseFloat(`${years}.${months}`);

    const controls = animate(0, target, {
      duration: 2,
      onUpdate: (val) => {
        if (ref.current) {
          const y = Math.floor(val);
          const m = Math.round((val - y) * 10);
          ref.current.textContent = `${y}.${m}`;
        }
      },
    });
    return () => controls.stop();
  }, [isInView]);

  return <span ref={ref}>0.0</span>;
}

export default function AboutSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothX, [-300, 300], [-10, 10]);
  const translateX = useTransform(smoothX, [-300, 300], [-20, 20]);
  const translateY = useTransform(smoothY, [-300, 300], [-20, 20]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
    <section id="about" className="min-h-screen relative flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Subtle Indie Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Text Content - The Philosophy */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="h-[1px] w-12 bg-amber-500/50" />
              <span className="font-mono text-xs tracking-[0.3em] text-amber-600/70 uppercase">SYS.ABOUT // 01</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-serif text-slate-800 mb-8 leading-tight tracking-wide"
            >
              The Architecture <br/>
              <span className="italic text-slate-500">of Thought.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6 text-slate-600 md:text-lg font-light leading-relaxed"
            >
              <p>
                In a digital landscape filled with noise and templates, I believe in building from first principles. 
                I don&apos;t just write code—I engineer systems. 
              </p>
              <p>
                My foundation runs deep in raw backend logic, distributed systems, and algorithmic efficiency. 
                When I translate that architecture to the frontend, it becomes an uncompromising, pixel-perfect experience.
                Every component, every animation, and every data pipeline must serve a structural purpose.
              </p>
              <p className="font-mono text-xs text-slate-400 tracking-wider pt-4 border-t border-slate-200 uppercase">
                &gt; Stack: Spring Boot | Next.js | System Design
              </p>
            </motion.div>
          </div>

          {/* Right Visual Element — Portrait + Hover Card */}
          <div 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-[450px] md:h-[550px] group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { handleMouseLeave(); setIsHovered(false); }}
            onMouseEnter={() => setIsHovered(true)}
            style={{ perspective: 1000 }}
          >
            {/* Image Frame */}
            <motion.div 
              style={{ rotateX, rotateY, x: translateX, y: translateY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute inset-0 border border-slate-200 shadow-2xl overflow-hidden cursor-crosshair rounded-tl-[80px]"
            >
              {/* Profile Image — smooth CSS transition for dim effect */}
              <Image 
                src="/images/profile-portrait.jpg" 
                alt="Sandeepan Kalita - Software Engineer"
                fill
                className="object-cover object-top transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                priority
              />

              {/* Dark gradient overlay — smoothly transitions on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none" />

              {/* Minimal corner accent — visible by default */}
              <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>

              {/* Hover Card — Developer Info */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-30"
                  >
                    <div className="space-y-4">
                      {/* Name + Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide">Sandeepan Kalita</h3>
                        <p className="text-amber-400/90 text-xs font-mono tracking-[0.2em] mt-2 uppercase">Software Engineer</p>
                      </motion.div>

                      {/* Tagline */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="text-white/50 text-sm font-light italic"
                      >
                        &quot;Turning caffeine into production-grade systems since 2020.&quot;
                      </motion.p>

                      {/* Divider + Values */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45 }}
                        className="pt-3 border-t border-white/10"
                      >
                        <div className="flex flex-wrap gap-2">
                          {['Problem Solver', 'Backend First', 'Clean Code', 'Always Shipping'].map((val) => (
                            <span 
                              key={val}
                              className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-white/60 border border-white/10 rounded-full"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>

        </div>

        {/* Bento Box Metrics Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Experience Counter */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass col-span-1 p-8 border border-slate-200/60 bg-white/40 flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
            <div className="font-mono text-xs text-amber-600/80 tracking-widest mb-4 uppercase">
              {"// Time in Industry"}
            </div>
            <div className="text-5xl md:text-7xl font-serif text-slate-800 mb-2 flex items-baseline gap-1">
              <DynamicExperienceCounter />
            </div>
            <div className="text-slate-500 font-light mt-2">
              Years of Experience
            </div>
          </motion.div>

          {/* Algorithmic Challenges */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass col-span-1 p-8 border border-slate-200/60 bg-white/40 flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
            <div className="font-mono text-xs text-amber-600/80 tracking-widest mb-4 uppercase">
              {"// Engineering Depth"}
            </div>
            <div className="text-5xl md:text-7xl font-serif text-slate-800 mb-2 flex items-baseline gap-1">
              <AnimatedCounter value={600} duration={2.5} />
              <span className="text-3xl md:text-5xl text-amber-500">+</span>
            </div>
            <div className="text-slate-500 font-light mt-2">
              Algorithmic Challenges Solved
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass col-span-1 p-8 border border-slate-200/60 bg-white/40 flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
            <div className="font-mono text-xs text-amber-600/80 tracking-widest mb-4 uppercase">
              {"// The Journey"}
            </div>
            <div className="text-2xl md:text-3xl font-serif text-slate-800 mb-3">
              B.Tech CSSE
            </div>
            <div className="text-slate-500 font-light text-sm leading-relaxed">
              <p>Computer Science & Systems Engineering</p>
              <p className="text-slate-400 text-xs mt-1">KIIT University, Bhubaneswar</p>
            </div>
          </motion.div>
        </div>

        {/* Forward-Looking Vision */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <span className="font-mono text-[10px] text-amber-600/60 tracking-[0.3em] uppercase">{"// Looking Ahead"}</span>
          <p className="text-xl md:text-2xl font-serif text-slate-700 mt-4 leading-relaxed">
            The goal is clear — become a <span className="text-slate-900 font-medium">Software Architect</span>, 
            somewhere at the intersection of <span className="italic text-amber-700/80">systems thinking</span> and{" "}
            <span className="italic text-amber-700/80">artificial intelligence</span>. 
            That&apos;s the next 30 years.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
