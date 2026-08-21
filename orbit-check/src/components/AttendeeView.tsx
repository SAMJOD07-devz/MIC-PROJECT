"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, CheckCircle2, AlertCircle, Sparkles, Clock, QrCode } from "lucide-react";

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
      {/* Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">Attendee Event Hub</h1>
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            Role: ATTENDEE
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Discover campus events, secure capacity-safe registrations, and present your unique QR ticket at check-in.
        </p>
      </div>

      {/* Message Banner */}
      {bannerMessage && (
        <div
          className={`rounded-xl border p-4 text-xs font-semibold ${
            bannerMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : bannerMessage.type === "full"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
              : bannerMessage.type === "already"
              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
              : "border-rose-500/40 bg-rose-500/10 text-rose-300"
          }`}
        >
          {bannerMessage.text}
        </div>
      )}

      {/* Section 1: My Personal Tickets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">My Entry QR Tickets</h2>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-400">
            {tickets.length}
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-xs text-slate-400">
            Loading your tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-500">
            You have no active registrations yet. Register for an event below to receive your unique QR ticket!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.registrationId}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{ticket.eventTitle}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {ticket.isCheckedIn ? (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        CHECKED IN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        REGISTERED
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2">{ticket.eventDescription}</p>
                </div>

                {/* QR Code Container */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold uppercase text-slate-400">Unique Token ID</div>
                    <div className="font-mono text-[11px] text-cyan-300 font-medium truncate max-w-[180px]">
                      {ticket.qrToken}
                    </div>
                  </div>

                  {ticket.qrCodeDataUrl && (
                    <div className="rounded-xl border border-slate-700 bg-white p-2 shadow-lg">
                      <img
                        src={ticket.qrCodeDataUrl}
                        alt="QR Ticket Code"
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

      {/* Section 2: Discover Events */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">Available Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-500">
            No upcoming events listed at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => {
              const isRegistered = tickets.some((t) => t.eventId === evt.id);
              return (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-white text-sm">{evt.title}</h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        Cap: {evt.capacity}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">{evt.description}</p>

                    <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-800/60 pt-3">
                      <span className="text-slate-400">
                        Spots left:{" "}
                        <strong className="text-white font-bold">{evt.remainingCapacity}</strong>
                      </span>
                      {evt.isFull ? (
                        <span className="font-bold text-rose-400">EVENT FULL</span>
                      ) : (
                        <span className="font-semibold text-emerald-400">AVAILABLE</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    {isRegistered ? (
                      <button
                        disabled
                        className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-300"
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={evt.isFull || registeringId === evt.id}
                        className={`w-full rounded-xl py-2 text-xs font-bold text-white shadow-md transition ${
                          evt.isFull
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
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
