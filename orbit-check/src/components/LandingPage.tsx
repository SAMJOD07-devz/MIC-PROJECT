"use client";

import React, { useState } from "react";
import { QrCode, ShieldCheck, User, WifiOff, Sparkles, ArrowRight, CheckCircle2, ChevronDown, Lock, Cpu, BarChart3 } from "lucide-react";
import { EventOrbScene } from "@/components/EventOrbScene";

interface LandingPageProps {
  onEnterOrganizer: () => void;
  onEnterAttendee: () => void;
  onOpenLogin: () => void;
}

export function LandingPage({
  onEnterOrganizer,
  onEnterAttendee,
  onOpenLogin,
}: LandingPageProps) {
  const [hoveredRole, setHoveredRole] = useState<"organizer" | "attendee" | null>(null);

  function scrollToFeatures() {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Trust Status Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Campus Event Command Center • Version 2.0</span>
        </div>

        {/* Hero 3D Orb Scene Anchor */}
        <div className="w-full max-w-lg mx-auto">
          <EventOrbScene />
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Every event. One seamless <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">check-in orbit.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create events, issue secure QR tickets, scan attendees offline or online, and watch your campus event come alive in real time.
          </p>
        </div>

        {/* Role Entry Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          <button
            onClick={onEnterOrganizer}
            onMouseEnter={() => setHoveredRole("organizer")}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ShieldCheck className="h-4 w-4" />
            Enter as Organizer
          </button>

          <button
            onClick={onEnterAttendee}
            onMouseEnter={() => setHoveredRole("attendee")}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-6 py-3.5 text-sm font-bold text-cyan-300 shadow-xl shadow-cyan-500/15 transition-all duration-300 hover:scale-105 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <User className="h-4 w-4" />
            Enter as Attendee
          </button>
        </div>

        {/* Secondary Scroll Action */}
        <button
          onClick={scrollToFeatures}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition pt-2"
        >
          Explore how it works
          <ChevronDown className="h-4 w-4 animate-bounce text-cyan-400" />
        </button>

        {/* Trust/Status Micro Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-medium text-slate-400 border-t border-slate-800/80 w-full">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-cyan-400" /> Secure Anti-Sharing QR
          </span>
          <span className="flex items-center gap-1.5">
            <WifiOff className="h-3.5 w-3.5 text-amber-400" /> IndexedDB Offline Outbox
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Ground-Truth AI Insights
          </span>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div id="features" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Architected for Speed & Reliability</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">Built for High-Throughput Campus Events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-3 backdrop-blur-xl transition hover:border-cyan-500/40 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-white text-base">Secure QR Entry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every registration receives a unique encrypted token hash. Database-level unique constraints guarantee duplicate check-ins are rejected instantly with original timestamps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-3 backdrop-blur-xl transition hover:border-amber-500/40 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <WifiOff className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-white text-base">Works When Wi-Fi Does Not</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans made during network outages are queued locally in Dexie IndexedDB outbox with client UUID keys and automatically synchronized with server authority upon reconnect.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-3 backdrop-blur-xl transition hover:border-indigo-500/40 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-white text-base">Live Event Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organizers monitor real-time capacity fill %, peak arrival windows, and checked-in attendee rosters with server-side AI operational insight suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* How OrbitCheck Works 3-Step Section */}
      <div className="space-y-8 pt-8 border-t border-slate-800">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple 3-Step Workflow</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">How OrbitCheck Powers Campus Events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">1</span>
              <h4 className="font-bold text-white text-sm">Create an Event</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Organizers define event title, description, date, and atomic capacity limits.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-xs font-bold text-white">2</span>
              <h4 className="font-bold text-white text-sm">Claim QR Ticket</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Attendees claim tickets with 1-click capacity locking and receive high-contrast Base64 QR codes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">3</span>
              <h4 className="font-bold text-white text-sm">Scan & Monitor Live</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Organizers scan tickets via webcam or manual console and download CSV rosters.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-12 text-center space-y-6 backdrop-blur-xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Enter the OrbitCheck Command Console</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Experience atomic capacity management, camera QR scanning, and live metrics right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onEnterOrganizer}
            className="w-full sm:w-auto flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500"
          >
            Enter as Organizer
          </button>
          <button
            onClick={onEnterAttendee}
            className="w-full sm:w-auto flex-1 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            Enter as Attendee
          </button>
        </div>
      </div>
    </div>
  );
}
