import type { Metadata } from "next";
import "./globals.css";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import SplashScreen from "@/components/navigation/SplashScreen";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "SandeepanK - Portfolio",
  description: "Software Engineer specializing in system design, backend architecture, and full-stack development. B.Tech CSSE from KIIT University. Currently building enterprise-scale systems at TCS.",
  keywords: ["Sandeepan Kalita", "Software Engineer", "System Design", "Full Stack Developer", "Java", "Spring Boot", "Next.js", "Portfolio"],
  authors: [{ name: "Sandeepan Kalita" }],
  openGraph: {
    title: "SandeepanK - Portfolio",
    description: "Software Engineer specializing in system design, backend architecture, and full-stack development.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-background text-foreground overflow-x-hidden font-sans`}
      >
        <SplashScreen />
        {/* Global Inner Frame with Solid Mask for overflowing text */}
        <div className="fixed inset-4 border border-slate-300 pointer-events-none z-30 rounded-xl ring-[16px] ring-background" />
        
        {/* Global Navigation that persists across page changes */}
        <SidebarNavigation />
        
        {/* Global AI Chat Interactive Drawer */}
        <ChatWidget />

        {children}
      </body>
    </html>
  );
}
