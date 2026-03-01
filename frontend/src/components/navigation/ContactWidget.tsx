"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, X, Loader2, MessageSquareText } from "lucide-react";

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "verifying" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // 1. Validate Name strictly (Alphabets and standard spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      setErrorMessage("Invalid Name: Only alphabetic characters (A-Z) and spaces are allowed.");
      return; // Stops here! The green success screen won't appear.
    }

    // 2. Regex Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a strictly valid email address.");
      return;
    }

    // 2. Prevent spamming extremely short strings
    if (message.trim().length < 15) {
      setErrorMessage("Your message is too short. Please provide more details.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to send message. Please try again later.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setErrorMessage("");
      }, 3000);
    } catch (error) {
      console.error("Contact Form Error:", error);
      setErrorMessage("Network error! Is the backend running?");
      setStatus("idle");
    }
  };

  return (
    <>
      {/* Floating Button top-right */}
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-40 flex items-center gap-4 group">
        {/* Label (Shows on desktop hover, hidden on strict touch) */}
        <div className="hidden lg:block pointer-events-none">
          <div
            className={`px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full shadow-lg whitespace-nowrap transition-all duration-300 ease-out transform ${
              isOpen 
                ? "opacity-0 scale-95 translate-x-4" 
                : "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            }`}
          >
            Let&apos;s Talk
          </div>
        </div>

        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{
            scale: isOpen ? 0 : 1,
            opacity: isOpen ? 0 : 1,
          }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white backdrop-blur-md shadow-xl border border-slate-200 flex items-center justify-center text-slate-900 hover:scale-110 active:scale-90 transition-all z-10"
        >
          <MessageSquareText className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Slide-out Form Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0.2 } }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 cursor-pointer"
            />
            
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } }}
              exit={{ x: "100%", opacity: 0, transition: { duration: 0.3 } }}
              className="fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] sm:w-[400px] md:w-[450px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-slate-900">Contact Me</h3>
                    <p className="text-xs text-slate-500 font-mono">Response time &lt; 24h</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-serif text-slate-900">Message Sent</h4>
                    <p className="text-slate-500">Thank you for reaching out. I&apos;ll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {errorMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium"
                      >
                        {errorMessage}
                      </motion.div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name"
                          required
                          pattern="[A-Za-z\s]+"
                          title="Only alphabetic characters are allowed"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Message</label>
                        <textarea 
                          id="message" 
                          name="message"
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm resize-none"
                          placeholder="How can I help you?..."
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === "sending" || status === "verifying"}
                      className="mt-4 w-full py-4 bg-slate-900 text-white rounded-xl font-medium tracking-wide hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {status === "verifying" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying Email...
                        </>
                      ) : status === "sending" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
