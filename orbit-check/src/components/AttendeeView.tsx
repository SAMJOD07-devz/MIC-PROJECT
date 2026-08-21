"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, CheckCircle2, AlertCircle, Sparkles, Clock, QrCode, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

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
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            MIC Campus Event Hub
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover Campus Events & Present Your <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Digital QR Ticket</span>
          </h1>

          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            OrbitCheck guarantees atomic capacity bounds and real-time attendance validation. Register for campus hackathons & tech summits and present your encrypted QR ticket at gate check-in.
          </p>
        </div>

        {/* Hero Light Graphic Feature Preview Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Digital Access Pass</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ACTIVE PASS
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                <QrCode className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Instant Gate Scan</div>
                <div className="text-[11px] text-slate-500">Anti-sharing SHA-256 protected QR code</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Banner Notification */}
      {bannerMessage && (
        <div
          className={`rounded-2xl border p-4 text-xs font-semibold shadow-xs ${
            bannerMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : bannerMessage.type === "full"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : bannerMessage.type === "already"
              ? "border-indigo-200 bg-indigo-50 text-indigo-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {bannerMessage.text}
        </div>
      )}

      {/* Section 1: My Personal Entry Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">My Entry QR Tickets</h2>
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {tickets.length} Active
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            Loading your digital tickets...
          </div>
        ) : tickets.length === 0 ? (
          /* Styled Rich Empty State Card */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-3 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No Active Tickets Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't registered for any campus recruitment events. Browse available events below to claim your ticket!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.registrationId}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-indigo-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{ticket.eventTitle}</h3>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Check-In Status Badge */}
                    {ticket.isCheckedIn ? (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        CHECKED IN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 shadow-xs">
                        <Clock className="h-3.5 w-3.5 text-indigo-600" />
                        REGISTERED
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ticket.eventDescription}
                  </p>
                </div>

                {/* QR Code Presentation Stage */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Token Identity</div>
                    <div className="font-mono text-[11px] text-indigo-700 font-semibold truncate max-w-[180px]">
                      {ticket.qrToken}
                    </div>
                    <div className="text-[10px] text-slate-500">Present to gate organizer</div>
                  </div>

                  {ticket.qrCodeDataUrl && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-xs">
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
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Available Campus Events</h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
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
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{evt.title}</h3>
                      {evt.isFull ? (
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                          FULL
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          OPEN
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-500">Capacity Filled</span>
                        <span className="text-indigo-600">{evt.registeredCount} / {evt.capacity} ({capacityPercentage}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            evt.isFull ? "bg-rose-500" : "bg-gradient-to-r from-indigo-600 to-blue-600"
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
                        className="w-full rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800"
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt.id)}
                        disabled={evt.isFull || registeringId === evt.id}
                        className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-xs transition ${
                          evt.isFull
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
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

