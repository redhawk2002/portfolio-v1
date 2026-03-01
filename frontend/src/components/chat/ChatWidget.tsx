"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User, Sparkles, Loader2, ChevronRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PRESET_QUESTIONS = [
  "What are Sandeepan's core skills?",
  "Tell me about his experience.",
  "What is his tech stack?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Sandeepan's AI assistant. Ask me anything about his experience, projects, or skills!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, presetQuestion?: string) => {
    if (e) e.preventDefault();
    
    const textToSubmit = presetQuestion || input.trim();
    if (!textToSubmit || isLoading) return;

    setInput("");
    setIsLoading(true);

    const newMessages: Message[] = [...messages, { role: "user", content: textToSubmit }];
    setMessages(newMessages);

    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("API responded with an error");

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm having trouble connecting to my brain right now. Please try again later!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Very basic Markdown bolding parser for the AI response
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-amber-500 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button right-bottom */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex items-center gap-3 group">
        {/* Hover tooltip — appears to the left */}
        <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          <span className="bg-slate-900 text-white text-xs font-mono tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
            Ask AI about me
          </span>
        </div>
        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-amber-400/50 flex items-center justify-center text-white transition-all z-10"
        >
          <Bot className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Slide-out Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] lg:w-[450px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-slate-900 leading-tight">AI Assistant</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Powered by Llama 3</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-amber-100 text-amber-600"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === "user" ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50"}`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-500 rounded-tl-none border border-slate-200/50 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span className="text-xs font-medium">Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-100 bg-white">
                {/* Preset Questions */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PRESET_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(undefined, q)}
                        className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-slate-200/60"
                      >
                        {q} <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Sandeepan..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 flex-shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:bg-slate-400 disabled:scale-100 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
