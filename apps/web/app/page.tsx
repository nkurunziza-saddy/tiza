"use client";
import { Downloads } from "@/components/downloads";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 1;
  }
  .content {
    position: relative;
    z-index: 2;
  }
`;

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <div className="content">
        <Hero />
        <Features />
        <Downloads />
        <Footer />
      </div>
    </main>
  );
}
