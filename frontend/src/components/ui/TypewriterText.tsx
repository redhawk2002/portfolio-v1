"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const typing = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(typing);
          setComplete(true);
        }
      }, 50); // Speed of typing in ms
      
      return () => clearInterval(typing);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <div className="inline-block relative">
      <span className="font-mono">{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className={`inline-block w-[0.6em] h-[1em] ml-1 bg-slate-900 align-text-bottom ${complete ? 'hidden' : 'block'}`}
      />
    </div>
  );
}
