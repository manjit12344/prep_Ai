import React from "react";
import LandingHeader from "../components/landingPage/LandingHeader";
import LandingHero from "../components/landingPage/LandingHero";
import TerminalMockup from "../components/landingPage/TerminalMockup";
import LandingFeatures from "../components/landingPage/LandingFeatures";
import LandingFooter from "../components/landingPage/LandingFooter";

export default function LandingPage() {
  // ...auth check + redirect logic...

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200 flex flex-col antialiased selection:bg-[var(--accent)]/20 selection:text-[var(--accent)]">
      
      {/* Navigation Header */}
      <LandingHeader />

      {/* Main Presentation Body */}
      <main className="flex-1 flex flex-col">
        
        {/* Section 1: Attention & Hook */}
        <div className="relative pb-4 sm:pb-8">
          <LandingHero />
        </div>
         {/* Section 3: Deep Feature Value Proposition */}
        <div className="relative">
          <LandingFeatures />
        </div>

        {/* Section 2: Product Simulation Context */}
        <div className="relative w-full bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-900/80 py-8">
          <TerminalMockup />
        </div>

       

      </main>

      {/* Persistent Page Footer */}
      <LandingFooter />

    </div>
  );
}