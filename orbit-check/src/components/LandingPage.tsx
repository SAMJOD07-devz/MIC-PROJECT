'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  LocateFixed,
  MoveUpRight,
  ScanLine,
  Sparkles,
  Users,
  Zap,
  Download,
  BarChart3
} from 'lucide-react';
import { PastEventsMarquee } from '@/components/UI/PastEventsMarquee';
import { playClickSFX, playHoverSFX } from '@/lib/audio';

interface LandingPageProps {
  onEnterOrganizer: () => void;
  onEnterAttendee: () => void;
  onOpenLogin: () => void;
}

const signalItems = [
  { value: '03', label: 'clubs live now', tone: 'magenta' },
  { value: '82%', label: 'Hall B capacity', tone: 'cobalt' },
  { value: '00:14', label: 'average check-in', tone: 'vermilion' },
  { value: '24/7', label: 'campus signal', tone: 'ivory' },
];

const workflow = [
  {
    number: '01',
    title: 'Create the moment',
    copy: 'Set a room, a capacity, a time window, and the story you want people to find.',
    icon: CalendarDays,
  },
  {
    number: '02',
    title: 'Share one clear pass',
    copy: 'Your event gets a simple page and a digital QR pass that is ready for the group chat.',
    icon: ArrowUpRight,
  },
  {
    number: '03',
    title: 'Scan the arrival',
    copy: 'Check people in quickly with duplicate-proof validation that keeps the queue moving.',
    icon: ScanLine,
  },
  {
    number: '04',
    title: 'See the room change',
    copy: 'Live capacity signals help organizers make better calls while the event is in motion.',
    icon: MoveUpRight,
  },
];

export function LandingPage({
  onEnterOrganizer,
  onEnterAttendee,
  onOpenLogin
}: LandingPageProps) {

  useEffect(() => {
    const root = document.documentElement;
    const handlePointerMove = (event: PointerEvent) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 2;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 2;
      root.style.setProperty('--parallax-x', `${Math.round(x * 12)}px`);
      root.style.setProperty('--parallax-y', `${Math.round(y * 9)}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-[#16151a] text-[#16151a]">
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section id="top" className="relative min-h-[720px] pt-32 pb-16 px-4 bg-[#16151a] text-white overflow-hidden">
        
        {/* Ambient Radial Mesh Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e443b4]/20 via-[#7a54ff]/10 to-transparent opacity-80 pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono font-bold tracking-widest text-[#ffabdd] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e443b4] animate-pulse" />
              LIVE EVENT OPERATING SYSTEM <span className="text-white/40">EST. 2024</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.92] text-white">
              Make every <br />
              <em className="not-italic bg-gradient-to-r from-[#e443b4] via-[#ff81c8] to-[#7a54ff] bg-clip-text text-transparent">
                arrival
              </em> count.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-lg">
              OrbitCheck brings discovery, registration, and duplicate-proof check-in into one calm, live layer for campus life.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playClickSFX();
                  onEnterOrganizer();
                }}
                onMouseEnter={playHoverSFX}
                className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#e443b4] to-[#7a54ff] text-white hover:opacity-95 transition shadow-lg flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                Enter as organizer <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClickSFX();
                  onEnterAttendee();
                }}
                onMouseEnter={playHoverSFX}
                className="px-6 py-3.5 rounded-xl font-bold bg-white/10 border border-white/20 text-white hover:bg-white/15 transition flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                Enter as attendee <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e443b4]" />
              Built for the moment before the room fills.
            </div>
          </div>

          {/* Right Column: Live Orbit Field Box */}
          <div className="lg:col-span-6 relative min-h-[460px] flex items-center justify-center">
            
            {/* Outer Orbit Rings */}
            <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full border border-white/15 animate-spin [animation-duration:35s] pointer-events-none" />
            <div className="absolute w-64 sm:w-72 h-64 sm:h-72 rounded-full border border-[#e443b4]/30 pointer-events-none" />

            {/* Central Core Capacity Signal */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#28212e] via-[#7134b8] to-[#e443b4] p-6 shadow-2xl flex flex-col items-center justify-center text-center relative z-10 border border-white/20">
              <span className="text-[9px] font-mono tracking-widest text-white/70 uppercase">LIVE / HALL B</span>
              <strong className="font-heading text-5xl font-extrabold text-white my-1">82%</strong>
              <span className="text-[9px] font-mono tracking-wider text-white/60">capacity in motion</span>
            </div>

            {/* Floating Live Signal Fragment Cards */}
            <div className="absolute top-4 left-4 bg-[#23202b]/90 border border-white/20 p-3 rounded-2xl backdrop-blur-md shadow-xl flex items-center gap-3 z-20">
              <div className="p-2 rounded-xl bg-[#e443b4]/20 text-[#ffabdd]">
                <ScanLine className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[8px] font-mono tracking-widest text-white/50 block">CHECK-IN</span>
                <strong className="text-xs font-bold text-white block">+18 arrivals</strong>
              </div>
              <span className="text-[9px] font-mono text-white/40 ml-2">now</span>
            </div>

            <div className="absolute bottom-12 right-2 bg-[#23202b]/90 border border-white/20 p-3 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2 z-20">
              <div className="w-7 h-7 rounded-full bg-[#4b79ff] flex items-center justify-center text-white">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[8px] font-mono tracking-widest text-white/50 block">DISCOVERED</span>
                <strong className="text-xs font-bold text-white block">Design Society</strong>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-ping" />
            </div>

            <div className="absolute bottom-6 left-8 bg-[#23202b]/90 border border-white/20 px-3 py-2 rounded-xl backdrop-blur-md shadow-xl flex items-center gap-2 z-20 text-[10px] font-mono text-white/70">
              <LocateFixed className="w-3.5 h-3.5 text-[#e443b4]" />
              <span>ROOM 04</span>
              <b className="text-emerald-400">Open</b>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DENSE LIVE SIGNAL STRIP */}
      <section id="signal" className="bg-[#f0ede7] border-y border-slate-300 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 items-center text-slate-900">
          <div className="col-span-2 md:col-span-1 pr-4 border-r border-slate-300/80">
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block">LIVE SIGNAL</span>
            <strong className="font-heading text-lg font-bold text-slate-900 leading-tight block mt-0.5">For the room as it changes.</strong>
          </div>

          {signalItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/70 border border-slate-200/80">
              <strong className="font-heading text-2xl font-extrabold text-slate-900 block leading-none">{item.value}</strong>
              <span className="text-[10px] font-mono text-slate-600 block mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PLATFORM PAPER SECTION WITH DETERMINISTIC HTML/CSS CAMPUS MAP */}
      <section id="platform" className="bg-[#f0ede7] py-20 px-4 text-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">
              ONE LAYER / MANY MOMENTS
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-slate-900 leading-none tracking-tight">
              Less queue. <br />
              <em className="not-italic text-[#e443b4]">More campus.</em>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Give every event a clear front door. OrbitCheck makes the operational layer feel as considered as the experience itself, from the first tap to the last person in the room.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300">
              <div>
                <strong className="font-heading text-2xl font-bold text-slate-900 block">01</strong>
                <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">shared event link</span>
              </div>
              <div>
                <strong className="font-heading text-2xl font-bold text-slate-900 block">∞</strong>
                <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">ways to discover</span>
              </div>
              <div>
                <strong className="font-heading text-2xl font-bold text-slate-900 block">0</strong>
                <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">duplicate entries</span>
              </div>
            </div>

            <button
              onClick={() => scrollTo('workflow')}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 hover:text-[#e443b4] transition pt-2 cursor-pointer"
            >
              See the system <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Code-Rendered HTML/CSS Campus Live-Map Artifact */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#1c1a22] p-6 text-white relative overflow-hidden min-h-[460px] flex flex-col justify-between border border-slate-800 shadow-2xl">
              
              {/* Header Info Bar */}
              <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-white/50 border-b border-white/10 pb-3">
                <span>ORBITCHECK / LIVE MAP</span>
                <span>03 CAMPUS NODES ACTIVE</span>
              </div>

              {/* Map Canvas Frame */}
              <div className="relative my-6 h-64 bg-slate-900/90 rounded-2xl overflow-hidden border border-white/10">
                {/* Road Grids */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 transform -rotate-12" />
                <div className="absolute top-1/3 left-1/4 bottom-0 w-0.5 bg-white/20 transform rotate-45" />

                {/* Building Blocks */}
                <div className="absolute top-6 left-8 w-24 h-12 rounded-lg bg-white/10 border border-white/20" />
                <div className="absolute bottom-6 right-10 w-28 h-14 rounded-lg bg-white/10 border border-white/20" />

                {/* Map Pins */}
                <div className="absolute top-12 left-16 flex items-center gap-1.5 text-[9px] font-mono font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e443b4] ring-4 ring-[#e443b4]/20" />
                  <span>HALL B</span>
                </div>

                <div className="absolute bottom-10 left-12 flex items-center gap-1.5 text-[9px] font-mono font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f06f48] ring-4 ring-[#f06f48]/20" />
                  <span>ROOM 04</span>
                </div>

                <div className="absolute top-16 right-12 flex items-center gap-1.5 text-[9px] font-mono font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4b79ff] ring-4 ring-[#4b79ff]/20" />
                  <span>NORTH QUAD</span>
                </div>

                {/* Center Badge */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#e443b4] shadow-xl flex flex-col items-center justify-center text-center border-2 border-white">
                  <strong className="font-heading text-xl font-bold leading-none">03</strong>
                  <span className="text-[7px] font-mono uppercase tracking-widest text-white/80 mt-0.5">LIVE EVENTS</span>
                </div>
              </div>

              {/* Bottom Footer Details */}
              <div className="flex justify-between items-center text-[10px] font-mono text-white/60 border-t border-white/10 pt-3">
                <div><span>DESIGN SOCIETY</span> — <strong className="text-white">82% capacity</strong></div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Clear Gate Flow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ORGANIZER CONTROL SECTION */}
      <section className="bg-[#16151a] py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
              02 / ORGANIZER CONTROL
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-extrabold text-white leading-none tracking-tight">
              Know what is <br />
              <em className="not-italic text-[#e443b4]">happening now.</em>
            </h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Build a rhythm people can feel. Keep the room visible without turning the room into a spreadsheet.
            </p>

            <div className="editorial-card p-5 rounded-2xl bg-white/5 border border-white/15 space-y-3">
              <div className="flex justify-between text-[9px] font-mono text-white/50">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e443b4]" /> Live Signal</span>
                <span>Updated 07:42</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>Design Society — Hall B</span>
                <span className="text-[#ffabdd] font-mono">82%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#e443b4] to-[#7a54ff] w-[82%]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>156 checked in</span>
                <span>34 spots left</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="editorial-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e443b4] transition space-y-2">
              <span className="text-xs font-mono font-bold text-[#e443b4]">01</span>
              <h3 className="font-heading text-xl font-bold text-white">Duplicate-proof by default</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Every scan is validated in the moment, so the line stays human and the data stays clean.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7a54ff] transition space-y-2">
              <span className="text-xs font-mono font-bold text-[#7a54ff]">02</span>
              <h3 className="font-heading text-xl font-bold text-white">Capacity you can actually use</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Make room for a better decision with a simple signal, not a wall of admin panels.
              </p>
            </div>

            <div className="editorial-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f06f48] transition space-y-2">
              <span className="text-xs font-mono font-bold text-[#f06f48]">03</span>
              <h3 className="font-heading text-xl font-bold text-white">A better front door for attendees</h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Discovery, digital passes, and arrival live in the same visual language from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFINITE MARQUEE LOOP OF PAST MANAGED CAMPUS EVENTS (VIT CHENNAI) */}
      <PastEventsMarquee />

      {/* 6. WORKFLOW PAPER SECTION */}
      <section id="workflow" className="bg-[#f0ede7] py-20 px-4 text-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-300 pb-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">03 / THE MOVEMENT</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900">From signal to shared moment.</h2>
            </div>
            <p className="text-slate-600 text-xs font-light max-w-xs">Four small actions. One much clearer event day.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map(({ number, title, copy, icon: Icon }, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-300 space-y-4 shadow-xs relative">
                <div className="flex justify-between items-center text-slate-900">
                  <span className="text-xs font-mono font-bold text-slate-400">{number}</span>
                  <div className="p-2 rounded-full border border-slate-200">
                    <Icon className="w-4 h-4 text-[#e443b4]" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-slate-600 text-xs font-light leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL-WORLD EVENT MANAGER CAPABILITIES */}
      <section className="bg-[#16151a] py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#e443b4] uppercase">REAL-WORLD EVENT INFRASTRUCTURE</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">Everything Event Managers Need</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-light">
              Designed specifically for student coordinators, campus club presidents, and fest directors to manage high-throughput crowds seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#e443b4]/15 text-[#e443b4] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Sub-100ms Gate Scans</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                High-speed webcam scanner validating QR codes instantly at entry gates to prevent queue bottlenecks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7a54ff]/15 text-[#7a54ff] flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">1-Click CSV Roster Export</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Export verified attendance sheets with timestamps directly to Excel/CSV for official college attendance credits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f06f48]/15 text-[#f06f48] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Multi-Gate Sync</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Coordinate entry across multiple doors simultaneously without risk of duplicate ticket entries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#4b79ff]/15 text-[#4b79ff] flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Live Analytics Dashboard</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Track arrival velocity, peak rush hours, and capacity fill percentages in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#16151a] border-t border-white/10 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <span className="font-bold text-white font-heading text-sm">O</span>
            </div>
            <span className="font-bold text-white text-sm font-heading">OrbitCheck</span>
          </div>
          <div>© 2026 OrbitCheck — Campus Event Operating Layer</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All System Signals Operating</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
