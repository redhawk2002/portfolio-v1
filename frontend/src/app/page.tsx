import HeroSection from "@/components/sections/HeroSection";
import CodeProfilesWidget from "@/components/navigation/CodeProfilesWidget";
import ContactWidget from "@/components/navigation/ContactWidget";

export default function Home() {
  return (
    <main className="relative bg-background h-screen overflow-hidden">
      <HeroSection />
      <CodeProfilesWidget />
      <ContactWidget />
    </main>
  );
}
