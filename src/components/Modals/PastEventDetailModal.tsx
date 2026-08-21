'use client';

import React, { useEffect } from 'react';
import { X, Trophy, Users, Calendar, MapPin, ShieldCheck, Mail, Phone, Ticket } from 'lucide-react';
import { playClickSFX } from '@/lib/audio';

export interface WinnerItem {
  position: '1st Place' | '2nd Place' | '3rd Place';
  teamName: string;
  projectName: string;
  prizeMoney: string;
  college: string;
}

export interface StudentCoordinator {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface PastEventDetailed {
  id: string;
  title: string;
  category: string;
  attendees: string;
  date: string;
  location: string;
  badge: string;
  gradient: string;
  organizer: string;
  prizePool: string;
  description: string;
  winners: WinnerItem[];
  coordinators: StudentCoordinator[];
  stats: {
    scansPerMinute: number;
    avgLatencyMs: number;
    duplicateBlocked: number;
  };
}

interface PastEventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: PastEventDetailed | null;
  onRegister?: () => void;
}

export function PastEventDetailModal({ isOpen, onClose, event, onRegister }: PastEventDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div
      data-lenis-prevent="true"
      onClick={() => {
        playClickSFX();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
    >
      <div
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#1c1a22] text-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto border-t-4 border-t-[#e443b4]"
      >
        {/* Header Banner */}
        <div className={`relative p-6 sm:p-7 bg-gradient-to-r ${event.gradient} text-white flex flex-col justify-between shrink-0 shadow-sm`}>
          <div className="flex justify-between items-start">
            <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-xl text-xs font-mono font-bold border border-white/20">
              <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                <span className="bg-[#f25022] rounded-[0.5px]" />
                <span className="bg-[#7fba00] rounded-[0.5px]" />
                <span className="bg-[#00a4ef] rounded-[0.5px]" />
                <span className="bg-[#ffb900] rounded-[0.5px]" />
              </div>
              <span>{event.organizer}</span>
            </div>

            <button
              onClick={() => {
                playClickSFX();
                onClose();
              }}
              aria-label="Close modal"
              className="rounded-xl p-2 bg-black/40 hover:bg-black/60 text-white transition border border-white/25 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/90 bg-white/20 border border-white/25 px-3 py-0.5 rounded-full">
              {event.badge}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight tracking-tight">
              {event.title}
            </h2>
            <p className="text-xs text-white/90 font-mono mt-2 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/80" /> {event.date}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/80" /> {event.location}</span>
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div data-lenis-prevent="true" className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          
          {/* Stat Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ffabdd]">Registered</div>
              <div className="text-base sm:text-lg font-bold font-heading text-white mt-0.5">{event.attendees}</div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">Prize Pool</div>
              <div className="text-base sm:text-lg font-bold font-heading text-amber-200 mt-0.5">{event.prizePool}</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">Gate Speed</div>
              <div className="text-base sm:text-lg font-bold font-heading text-emerald-300 mt-0.5">&lt;{event.stats.avgLatencyMs}ms</div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#ffabdd] mb-1.5">Event Overview</h4>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4.5 h-4.5 text-amber-400" />
              <h4 className="font-heading font-bold text-white text-base">Winners & Prize Money</h4>
            </div>

            <div className="space-y-2.5">
              {event.winners.map((win, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center font-bold text-sm shrink-0">
                      {win.position === '1st Place' ? '🥇' : win.position === '2nd Place' ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{win.teamName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({win.college})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-light mt-0.5">Project: <strong className="font-mono text-slate-200">{win.projectName}</strong></p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shrink-0">
                    {win.prizeMoney}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Coordinators */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4.5 h-4.5 text-[#7a54ff]" />
              <h4 className="font-heading font-bold text-white text-base">Student Coordinators</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.coordinators.map((coord, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-white text-xs">{coord.name}</h5>
                    <span className="text-[10px] font-mono font-bold text-[#b5a1ff] bg-[#7a54ff]/20 px-2 py-0.5 rounded-md border border-[#7a54ff]/30">
                      {coord.role}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#e443b4]" /> {coord.email}</div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#7a54ff]" /> {coord.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified OrbitCheck Engine
          </span>

          <div className="flex items-center gap-2">
            {onRegister && (
              <button
                onClick={() => {
                  playClickSFX();
                  onClose();
                  onRegister();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#e443b4] to-[#7a54ff] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition"
              >
                Claim QR Pass
              </button>
            )}

            <button
              onClick={() => {
                playClickSFX();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
