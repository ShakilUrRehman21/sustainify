"use client";

import Link from "next/link";
import ThreeBackground from "@/components/ThreeBackground";
import {
  IconTag,
  IconGlobe,
  IconMessage,
  IconChart,
} from "@/components/Icons";

export default function Hero() {
  return (
    <section className="relative text-center pt-8 pb-14 max-w-4xl mx-auto animate-fade-up">
      {/* Interactive 3D Sphere (Two rings removed, mouse drag to rotate) */}
      <div className="absolute inset-0 -top-12 left-0 right-0 h-[460px] overflow-hidden -z-10 flex items-center justify-center">
        <ThreeBackground />
      </div>

      {/* Pill Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-xs backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Next-Generation Sustainable Commerce Intelligence</span>
        <span className="text-emerald-300">•</span>
        <span className="text-[10px] text-emerald-700 font-mono hidden sm:inline">Drag 3D sphere to rotate</span>
      </div>

      {/* Main Headline */}
      <h1 className="relative z-10 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900">
        Orchestrate Sustainable <br className="hidden sm:inline" />
        Commerce with <span className="gradient-text">Precision AI</span>
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-normal pt-10">
        Sustainify is a full-stack AI platform powering product categorization,
        budget-enforced B2B proposals, verified environmental impact reporting, and customer support.
      </p>

      {/* Quick Launch CTA Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/categorize" className="btn-primary">
          <IconTag className="w-4 h-4 text-emerald-200" />
          <span>Test Auto-Categorizer</span>
        </Link>
        <Link href="/impact" className="btn-secondary">
          <IconGlobe className="w-4 h-4 text-emerald-700" />
          <span>Live Impact Engine</span>
        </Link>
        <Link href="/chat" className="btn-secondary">
          <IconMessage className="w-4 h-4 text-emerald-700" />
          <span>WhatsApp Bot</span>
        </Link>
        <Link href="/logs" className="btn-secondary">
          <IconChart className="w-4 h-4 text-slate-500" />
          <span>Observability Logs</span>
        </Link>
      </div>
    </section>
  );
}
