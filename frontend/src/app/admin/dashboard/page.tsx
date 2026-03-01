"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SectionItem {
  id: string;
  content: Record<string, unknown>;
  displayOrder: number;
  isVisible: boolean;
}

interface Section {
  id: string;
  type: string;
  title: string;
  displayOrder: number;
  isVisible: boolean;
  items: SectionItem[];
}

export default function AdminDashboardPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const router = useRouter();

  const getToken = () => localStorage.getItem("admin_token");

  const verifyAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return false;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        router.push("/admin/login");
        return false;
      }
      return true;
    } catch {
      router.push("/admin/login");
      return false;
    }
  }, [router]);

  const fetchSections = useCallback(async () => {
    const isValid = await verifyAuth();
    if (!isValid) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/sections/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSections(data);
      if (data.length > 0 && !activeSection) {
        setActiveSection(data[0].type);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setIsLoading(false);
    }
  }, [verifyAuth, activeSection]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSaveItem = async (itemId: string) => {
    const token = getToken();
    setSaveStatus("Saving...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    try {
      const parsed = JSON.parse(editContent);
      const res = await fetch(`${API_URL}/api/sections/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: parsed }),
      });

      if (res.ok) {
        setSaveStatus("Saved ✓");
        setEditingItem(null);
        fetchSections();
        setTimeout(() => setSaveStatus(""), 2000);
      } else {
        setSaveStatus("Error saving");
      }
    } catch {
      setSaveStatus("Invalid JSON");
    }
  };

  const handleToggleVisibility = async (itemId: string, currentVisibility: boolean) => {
    const token = getToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    try {
      await fetch(`${API_URL}/api/sections/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });
      fetchSections();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    
    const token = getToken();
    setSaveStatus("Deleting...");
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    try {
      const res = await fetch(`${API_URL}/api/sections/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSaveStatus("Deleted ✓");
        fetchSections();
        setTimeout(() => setSaveStatus(""), 2000);
      } else {
        setSaveStatus("Error deleting");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      setSaveStatus("Error deleting");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const currentSection = sections.find((s) => s.type === activeSection);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-amber-500/70 font-mono text-sm animate-pulse tracking-widest">
          {"[ L O A D I N G . . . ]"}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10">
        {/* Top Bar */}
        <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-amber-500/60 tracking-[0.3em] uppercase">{"// Admin Dashboard"}</span>
            <h1 className="text-xl font-serif text-white mt-1">Section Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveStatus && (
              <span className="text-xs font-mono text-amber-400">{saveStatus}</span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-slate-500 hover:text-white transition-colors tracking-wider uppercase"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar — Section Tabs */}
          <nav className="w-56 border-r border-slate-800 min-h-[calc(100vh-65px)] p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.type}
                onClick={() => setActiveSection(section.type)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-mono tracking-wide transition-all ${
                  activeSection === section.type
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                {section.title}
                <span className="block text-[10px] text-slate-600 mt-0.5">
                  {section.items.length} items
                </span>
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
            {currentSection && (
              <motion.div
                key={currentSection.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-serif text-white">{currentSection.title}</h2>
                    <span className="text-xs font-mono text-slate-600 tracking-wider">
                      TYPE: {currentSection.type}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      const token = getToken();
                      setSaveStatus("Creating...");
                      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
                      try {
                        const res = await fetch(`${API_URL}/api/sections/items`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            sectionId: currentSection.id,
                            content: { title: "New Item", description: "Edit this newly created item." },
                            isVisible: false
                          })
                        });
                        
                        if (res.ok) {
                          setSaveStatus("Created ✓");
                          fetchSections();
                          setTimeout(() => setSaveStatus(""), 2000);
                        } else {
                          setSaveStatus("Error creating");
                        }
                      } catch {
                        setSaveStatus("Error creating");
                      }
                    }}
                    className="flex items-center gap-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-slate-900 border border-amber-500/30 px-4 py-2 rounded-lg font-mono text-xs transition-all tracking-wider"
                  >
                    <span className="text-lg leading-none mb-0.5">+</span> ADD NEW ITEM
                  </button>
                </div>

                <div className="space-y-4">
                  {currentSection.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border border-slate-800 rounded-xl p-6 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-600">#{idx + 1}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            item.isVisible 
                              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {item.isVisible ? "VISIBLE" : "HIDDEN"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVisibility(item.id, item.isVisible)}
                            className="text-[10px] font-mono text-slate-500 hover:text-amber-400 transition-colors px-3 py-1 border border-slate-700 rounded-lg hover:border-amber-500/30"
                          >
                            {item.isVisible ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => {
                              if (editingItem === item.id) {
                                setEditingItem(null);
                              } else {
                                setEditingItem(item.id);
                                setEditContent(JSON.stringify(item.content, null, 2));
                              }
                            }}
                            className="text-[10px] font-mono text-slate-500 hover:text-amber-400 transition-colors px-3 py-1 border border-slate-700 rounded-lg hover:border-amber-500/30"
                          >
                            {editingItem === item.id ? "Cancel" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-[10px] font-mono text-red-500/70 hover:text-red-400 transition-colors px-3 py-1 border border-red-900/30 rounded-lg hover:border-red-500/30 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {editingItem === item.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={12}
                            className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500/50 font-mono text-xs leading-relaxed resize-y"
                          />
                          <button
                            onClick={() => handleSaveItem(item.id)}
                            className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-medium text-sm hover:bg-amber-400 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : (
                        <pre className="text-xs text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-slate-900/50 p-4 rounded-lg">
                          {JSON.stringify(item.content, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
