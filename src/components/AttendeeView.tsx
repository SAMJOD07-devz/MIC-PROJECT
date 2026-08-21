"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, CheckCircle2, QrCode, Sparkles, Clock, Download, Printer, UserCheck, Activity } from "lucide-react";
import { playClickSFX, playHoverSFX } from "@/lib/audio";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
  registeredCount: number;
  checkedInCount: number;
  remainingCapacity: number;
  isFull: boolean;
}

interface TicketItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  qrToken: string;
  qrTokenHash: string;
  qrCodeDataUrl?: string;
  status: "REGISTERED" | "CHECKED_IN" | "CANCELLED";
  registeredAt: string;
  checkInTime?: string;
}

export function AttendeeView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [myTickets, setMyTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  // 3-SECOND REAL-TIME LIVE POLLING WITH DEEP EQUALITY STATE PROTECTION
  useEffect(() => {
    fetchEvents(true);
    fetchMyTickets();

    const interval = setInterval(() => {
      fetchEvents(false);
      fetchMyTickets();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function fetchEvents(showSpinner = false) {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok && data.events) {
        setEvents((prev) => {
          const prevSig = JSON.stringify(prev.map((e) => ({ id: e.id, reg: e.registeredCount, chk: e.checkedInCount, cap: e.capacity })));
          const newSig = JSON.stringify(data.events.map((e: any) => ({ id: e.id, reg: e.registeredCount, chk: e.checkedInCount, cap: e.capacity })));
          if (prevSig === newSig && prev.length > 0) return prev;
          return data.events;
        });
      }
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  async function fetchMyTickets() {
    try {
      const res = await fetch("/api/tickets/me");
      const data = await res.json();
      if (res.ok && data.tickets) {
        setMyTickets((prev) => {
          const prevSig = JSON.stringify(prev.map((t) => ({ id: t.id || (t as any).registrationId, status: t.status, time: t.checkInTime })));
          const newSig = JSON.stringify(data.tickets.map((t: any) => ({ id: t.id || t.registrationId, status: t.status, time: t.checkInTime })));
          if (prevSig === newSig && prev.length > 0) return prev;
          return data.tickets;
        });
      }
    } catch (err) {
      console.error("Fetch tickets error:", err);
    }
  }

  async function handleRegister(eventId: string) {
    playClickSFX();
    setRegisteringId(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert("🎉 Successfully claimed digital pass QR ticket!");
        fetchEvents(false);
        fetchMyTickets();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Network error registering for event");
    } finally {
      setRegisteringId(null);
    }
  }

  const registeredEventIds = new Set(myTickets.map((t) => t.eventId));

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Banner */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7a54ff]/20 via-[#e443b4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7a54ff] animate-pulse" />
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Attendee Pass Command
            </h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            Discover active campus events, claim duplicate-proof digital QR tickets, and check in seamlessly at venue doors.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="rounded-2xl border border-[#7a54ff]/30 bg-[#7a54ff]/15 px-4 py-2.5 text-xs font-mono text-[#b5a1ff] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#e443b4]" />
            <span><b>{myTickets.length}</b> My Passes</span>
          </div>
        </div>
      </div>

      {/* MY DIGITAL QR TICKETS SECTION */}
      {myTickets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffabdd] uppercase flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-[#e443b4]" /> My Claimed Digital QR Passes
            </span>
            <span className="text-[10px] font-mono text-slate-400">{myTickets.length} Digital Tickets Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map((t) => {
              const ticketId = t.id || (t as any).registrationId;
              const qrImageUrl = t.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(t.qrToken)}`;
              return (
                <div
                  key={ticketId}
                  className="rounded-3xl border border-white/15 bg-white/5 p-6 space-y-4 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col justify-between"
                  style={{
                    borderTop: t.status === "CHECKED_IN" ? "4px solid #10b981" : "4px solid #e443b4"
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#ffabdd] tracking-widest uppercase font-bold">
                        DIGITAL PASS TOKEN
                      </span>
                      {t.status === "CHECKED_IN" ? (
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> CHECKED-IN
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#e443b4]/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#ffabdd] border border-[#e443b4]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#e443b4]" /> READY FOR SCAN
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white leading-snug">
                      {t.eventTitle}
                    </h3>

                    <p className="text-xs text-slate-300 font-light line-clamp-2">
                      {t.eventDescription}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7a54ff]" />
                      <span>{new Date(t.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>

                  {/* SCANNABLE 2D QR CODE MATRIX BOX */}
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    <div className="p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                      <div className="font-mono text-[10px] tracking-widest text-slate-500 uppercase font-bold">OFFICIAL ORBIT PASS QR</div>
                      
                      {/* 2D QR Code Matrix Image with Fixed Memory Cache */}
                      <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-md">
                        <img
                          src={qrImageUrl}
                          alt={`QR Code for ${t.qrToken}`}
                          className="w-36 h-36 object-contain"
                        />
                      </div>

                      <strong className="font-mono text-xs sm:text-sm font-extrabold text-[#16151a] tracking-wider select-all break-all bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                        {t.qrToken}
                      </strong>
                      <span className="text-[8px] font-mono text-slate-400">Show 2D QR Matrix or Token to organizer webcam scanner at door</span>
                    </div>

                    <div className="text-[9px] font-mono text-slate-400 text-center">
                      Registered: {new Date(t.registeredAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DISCOVER ALL CAMPUS EVENTS CATALOG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffabdd] uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e443b4]" /> Discover Live Campus Events
          </span>
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" /> {events.length} Live Events
          </span>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-xs font-mono text-slate-400 animate-pulse">
            Loading live campus events...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const isAlreadyRegistered = registeredEventIds.has(evt.id);
              return (
                <div
                  key={evt.id}
                  onMouseEnter={playHoverSFX}
                  className="rounded-3xl border border-white/15 bg-white/5 p-6 space-y-4 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-white/25 transition duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#ffabdd] tracking-widest uppercase font-bold">
                        CAMPUS EVENT
                      </span>
                      {evt.isFull ? (
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-rose-300 border border-rose-500/30 uppercase">
                          FULL
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30 uppercase">
                          {evt.remainingCapacity} SPOTS LEFT
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7a54ff]" />
                      <span>{new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    {isAlreadyRegistered ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center font-mono text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Pass Claimed
                      </div>
                    ) : evt.isFull ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-mono text-xs font-bold opacity-50 cursor-not-allowed uppercase"
                      >
                        Event At Capacity
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={registeringId === evt.id}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e443b4] to-[#7a54ff] text-white font-mono text-xs font-bold hover:opacity-95 transition shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        {registeringId === evt.id ? "Claiming Pass..." : "Claim Digital QR Pass"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
