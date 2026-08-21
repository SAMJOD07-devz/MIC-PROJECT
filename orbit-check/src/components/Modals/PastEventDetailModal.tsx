'use client';

import React, { useEffect } from 'react';
import { X, Trophy, Users, Calendar, MapPin, ShieldCheck, Mail, Phone } from 'lucide-react';
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
}

export function PastEventDetailModal({ isOpen, onClose, event }: PastEventDetailModalProps) {
  // Lock document overflow AND stop Lenis smooth scrolling when modal is open
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
    /* Non-blurred backdrop overlay with data-lenis-prevent to isolate wheel scrolling */
    <div
      data-lenis-prevent="true"
      onClick={() => {
        playClickSFX();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 sm:p-6 animate-in fade-in duration-200 overflow-hidden"
    >
      <div
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()} // Prevent background close when clicking inside modal
        className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto border-t-4 border-t-purple-600"
      >
        {/* Header Banner - High Impact & Readable */}
        <div className={`relative p-6 sm:p-7 bg-gradient-to-r ${event.gradient} text-white flex flex-col justify-between shrink-0 shadow-sm`}>
          <div className="flex justify-between items-start">
            <div className="inline-flex items-center gap-2 bg-black/35 px-3 py-1 rounded-xl text-xs font-bold border border-white/20 shadow-xs">
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90 bg-white/20 border border-white/25 px-3 py-0.5 rounded-full">
              {event.badge}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight tracking-tight drop-shadow-xs">
              {event.title}
            </h2>
            <p className="text-xs text-white/90 font-medium mt-2 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/80" /> {event.date}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/80" /> {event.location}</span>
            </p>
          </div>
        </div>

        {/* Modal Inner Content - Isolated Scroll Container */}
        <div data-lenis-prevent="true" className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-900">
          
          {/* Stat Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">Total Checked In</div>
              <div className="text-base sm:text-lg font-bold font-heading text-slate-900 mt-0.5">{event.attendees}</div>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Total Prize Pool</div>
              <div className="text-base sm:text-lg font-bold font-heading text-slate-900 mt-0.5">{event.prizePool}</div>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-center shadow-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Scan Latency</div>
              <div className="text-base sm:text-lg font-bold font-heading text-slate-900 mt-0.5">&lt;{event.stats.avgLatencyMs}ms</div>
            </div>
          </div>

          {/* Event Overview Description */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Event Overview</h4>
            <p className="text-slate-700 text-xs sm:text-sm font-light leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Winners & Prize Money Leaderboard */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              <h4 className="font-heading font-bold text-slate-900 text-base">Winners & Prize Money</h4>
            </div>

            <div className="space-y-2.5">
              {event.winners.map((win, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    win.position === '1st Place'
                      ? 'bg-amber-50/60 border-amber-200'
                      : win.position === '2nd Place'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-orange-50/60 border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {win.position === '1st Place' ? '🥇' : win.position === '2nd Place' ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{win.teamName}</span>
                        <span className="text-[10px] font-bold text-slate-500">({win.college})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-light mt-0.5">Project: <strong className="font-semibold text-slate-800">{win.projectName}</strong></p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold font-heading text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-xs shrink-0">
                    {win.prizeMoney}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Coordinators Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4.5 h-4.5 text-purple-600" />
              <h4 className="font-heading font-bold text-slate-900 text-base">Student Coordinators</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.coordinators.map((coord, idx) => (
                <div key={idx} className="editorial-card p-3.5 rounded-2xl border border-slate-200 space-y-1 bg-white">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs">{coord.name}</h5>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {coord.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-light space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {coord.email}</div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {coord.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium shrink-0">
          <span className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified by OrbitCheck Engine
          </span>
          <button
            onClick={() => {
              playClickSFX();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
