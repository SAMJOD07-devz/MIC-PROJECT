"use client";

import React, { useState } from "react";
import { QrCode, ShieldCheck, User, WifiOff, Sparkles, ArrowRight, CheckCircle2, ChevronDown, Lock, Cpu, BarChart3, Check, Zap } from "lucide-react";

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
    <div className="space-y-20 py-4 sm:py-8">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Trust Status Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Campus Event Platform • Next.js & Concurrency Guarded</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Every event. One seamless <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">check-in orbit.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create events, issue secure anti-sharing QR tickets, scan attendees offline or online with zero duplicates, and track live metrics effortlessly.
          </p>
        </div>

        {/* Hero Interactive UI Preview Card Graphic (Replaces Heavy 3D Orb) */}
        <div className="w-full max-w-2xl mx-auto pt-2 pb-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 text-left space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  MIC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Campus Tech Hackathon 2026</h4>
                  <p className="text-[11px] text-slate-500">Live Campus Event • Auditorium A</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3 text-emerald-600" /> 142 / 150 Checked In
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Capacity Lock</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" /> Atomic DB Lock
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">QR Verification</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Hash Scan
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Offline Sync</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" /> IndexedDB Queue
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Entry Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          <button
            onClick={onEnterOrganizer}
            onMouseEnter={() => setHoveredRole("organizer")}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ShieldCheck className="h-4 w-4" />
            Enter as Organizer
          </button>

          <button
            onClick={onEnterAttendee}
            onMouseEnter={() => setHoveredRole("attendee")}
            onMouseLeave={() => setHoveredRole(null)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all duration-200 hover:scale-[1.02] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <User className="h-4 w-4 text-indigo-600" />
            Enter as Attendee
          </button>
        </div>

        {/* Secondary Scroll Action */}
        <button
          onClick={scrollToFeatures}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition pt-2"
        >
          Explore features & architecture
          <ChevronDown className="h-4 w-4 animate-bounce text-indigo-600" />
        </button>

        {/* Trust/Status Micro Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-medium text-slate-500 border-t border-slate-200 w-full">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-indigo-600" /> Secure Anti-Sharing QR
          </span>
          <span className="flex items-center gap-1.5">
            <WifiOff className="h-3.5 w-3.5 text-amber-600" /> IndexedDB Offline Outbox
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-blue-600" /> Server AI Insights
          </span>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div id="features" className="space-y-8 pt-8 border-t border-slate-200">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Architected for Speed & Reliability</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Built for High-Throughput Campus Events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:shadow-md transition hover:border-indigo-300 hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Secure QR Entry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every registration receives a unique encrypted token hash. Database-level unique constraints guarantee duplicate check-ins are rejected instantly with original timestamps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:shadow-md transition hover:border-amber-300 hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600">
              <WifiOff className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Works When Wi-Fi Does Not</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scans made during network outages are queued locally in Dexie IndexedDB outbox with client UUID keys and automatically synchronized with server authority upon reconnect.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:shadow-md transition hover:border-blue-300 hover:-translate-y-0.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Live Event Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organizers monitor real-time capacity fill %, peak arrival windows, and checked-in attendee rosters with server-side AI operational insight suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* How OrbitCheck Works 3-Step Section */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Simple 3-Step Workflow</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">How OrbitCheck Powers Campus Events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Create an Event</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              Organizers define event title, description, date, and atomic capacity limits.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Claim QR Ticket</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              Attendees claim tickets with 1-click capacity locking and receive high-contrast Base64 QR codes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Scan & Monitor Live</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              Organizers scan tickets via webcam or manual console and download CSV rosters.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 sm:p-12 text-center space-y-6 shadow-xl text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Enter the OrbitCheck Command Console</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-md mx-auto">
          Experience atomic capacity management, camera QR scanning, and live metrics right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onEnterOrganizer}
            className="w-full sm:w-auto flex-1 rounded-2xl bg-white px-6 py-3 text-xs font-bold text-indigo-700 shadow-md hover:bg-slate-50 transition"
          >
            Enter as Organizer
          </button>
          <button
            onClick={onEnterAttendee}
            className="w-full sm:w-auto flex-1 rounded-2xl border border-indigo-200/50 bg-indigo-500/20 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-500/30 transition"
          >
            Enter as Attendee
          </button>
        </div>
      </div>
    </div>
  );
}

