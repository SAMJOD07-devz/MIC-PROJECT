"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, CheckCircle2, AlertCircle, Sparkles, Clock, QrCode, ArrowRight, ShieldCheck } from "lucide-react";
import { EventOrbScene } from "@/components/EventOrbScene";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
  registeredCount: number;
  remainingCapacity: number;
  isFull: boolean;
}

interface TicketItem {
  registrationId: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  status: string;
  registeredAt: string;
  qrToken: string;
  qrCodeDataUrl: string;
  checkInTime: string | null;
  isCheckedIn: boolean;
}

export function AttendeeView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{
    type: "success" | "error" | "full" | "already";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchEventsAndTickets();
  }, []);

  async function fetchEventsAndTickets() {
    setLoading(true);
    try {
      const [eventsRes, ticketsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/tickets/me"),
      ]);

      const eventsData = await eventsRes.json();
      const ticketsData = await ticketsRes.json();

      if (eventsRes.ok) setEvents(eventsData.events || []);
      if (ticketsRes.ok) setTickets(ticketsData.tickets || []);
    } catch (err) {
      console.error("Fetch attendee view data error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(eventId: string) {
    setRegisteringId(eventId);
    setBannerMessage(null);

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.status === 201) {
        setBannerMessage({
          type: "success",
          text: `🎉 Successfully registered for "${data.registration.event.title}"! Ticket generated below.`,
        });
        fetchEventsAndTickets();
      } else if (res.status === 409) {
        if (data.error === "EVENT_FULL") {
          setBannerMessage({
            type: "full",
            text: `⚠️ Capacity Full: Event has reached its maximum capacity.`,
          });
        } else {
          setBannerMessage({
            type: "already",
            text: `ℹ️ Already Registered: You already hold a ticket for this event.`,
          });
        }
      } else {
        setBannerMessage({
          type: "error",
          text: `❌ ${data.message || "Registration failed"}`,
        });
      }
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: "❌ Network failure during registration",
      });
    } finally {
      setRegisteringId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with 3D Constellation Orb Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            MIC Campus Event Hub
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Discover Campus Events & Present Your <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Digital QR Ticket</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            OrbitCheck guarantees atomic capacity bounds and real-time attendance validation. Register for recruitment summits and present your encrypted ticket at gate check-in.
          </p>
        </div>

        {/* 3D Orb Visual Card */}
        <div className="lg:col-span-5">
          <EventOrbScene />
        </div>
      </div>

      {/* Message Banner Notification */}
      {bannerMessage && (
        <div
          className={`rounded-2xl border p-4 text-xs font-semibold shadow-lg ${
            bannerMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-emerald-500/10"
              : bannerMessage.type === "full"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-rose-500/10"
              : bannerMessage.type === "already"
              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/10"
              : "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-rose-500/10"
          }`}
        >
          {bannerMessage.text}
        </div>
      )}

      {/* Section 1: My Personal Entry Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">My Entry QR Tickets</h2>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
              {tickets.length} Active
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
            Loading your digital tickets...
          </div>
        ) : tickets.length === 0 ? (
          /* Styled Rich Empty State Card */
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-3 backdrop-blur-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-white text-sm">No Active Tickets Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't registered for any campus recruitment events. Browse available events below to claim your ticket!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.registrationId}
                className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl transition hover:border-cyan-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{ticket.eventTitle}</h3>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Check-In Status Badge */}
                    {ticket.isCheckedIn ? (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 shadow-md shadow-emerald-500/10">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        CHECKED IN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 shadow-md shadow-amber-500/10">
                        <Clock className="h-3.5 w-3.5" />
                        REGISTERED
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ticket.eventDescription}
                  </p>
                </div>

                {/* QR Code Presentation Stage */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Token Identity</div>
                    <div className="font-mono text-[11px] text-cyan-300 font-semibold truncate max-w-[180px]">
                      {ticket.qrToken}
                    </div>
                    <div className="text-[10px] text-slate-500">Present to gate organizer</div>
                  </div>

                  {ticket.qrCodeDataUrl && (
                    <div className="rounded-xl border border-cyan-500/30 bg-white p-2.5 shadow-lg shadow-cyan-500/10">
                      <img
                        src={ticket.qrCodeDataUrl}
                        alt="QR Entry Ticket"
                        className="h-20 w-20 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Event Discovery & Capacity Cards */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Available Campus Events</h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-500">
            No upcoming events listed at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const isRegistered = tickets.some((t) => t.eventId === evt.id);
              const capacityPercentage = Math.round((evt.registeredCount / evt.capacity) * 100);

              return (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-700 backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-base leading-snug">{evt.title}</h3>
                      {evt.isFull ? (
                        <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                          FULL
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          OPEN
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="mt-5 space-y-1.5 border-t border-slate-800/80 pt-4">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-400">Capacity Filled</span>
                        <span className="text-cyan-400">{evt.registeredCount} / {evt.capacity} ({capacityPercentage}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            evt.isFull ? "bg-rose-500" : "bg-gradient-to-r from-cyan-500 to-blue-600"
                          }`}
                          style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    {isRegistered ? (
                      <button
                        disabled
                        className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300"
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={evt.isFull || registeringId === evt.id}
                        className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition ${
                          evt.isFull
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20"
                        }`}
                      >
                        {registeringId === evt.id ? "Registering..." : evt.isFull ? "Event Full" : "Register Now"}
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
