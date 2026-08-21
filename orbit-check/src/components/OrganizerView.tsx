"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Download,
  QrCode,
  TrendingUp,
  UserX,
  Clock,
  CheckCircle2,
  Sparkles,
  Bot,
  AlertCircle,
  Users,
  ShieldCheck,
  Calendar,
  Zap,
  X,
  Check,
  Search
} from "lucide-react";
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

interface DashboardMetrics {
  eventId: string;
  eventTitle: string;
  capacity: number;
  registeredCount: number;
  checkedInCount: number;
  remainingCapacity: number;
  noShowCount: number;
  checkInPercentage: number;
  peakCheckInTime: string;
  recentCheckIns: Array<{
    id: string;
    attendeeName: string;
    attendeeEmail: string;
    checkInTime: string;
    deviceId: string;
  }>;
}

interface AiInsightResponse {
  query: string;
  isFallback: boolean;
  summary: string;
  recommendations: string[];
}

export function OrganizerView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Event Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [createLoading, setCreateLoading] = useState(false);

  // Scanner / Check-in State
  const [scanToken, setScanToken] = useState("");
  const [scanStatus, setScanStatus] = useState<{
    type: "success" | "duplicate" | "error" | "invalid";
    message: string;
    timestamp?: string;
  } | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  // AI Insights State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AiInsightResponse | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");

  const SUGGESTED_QUESTIONS = [
    "Analyze check-in velocity and suggest operational improvements",
    "What is the peak arrival time window for this event?",
    "How many no-shows are expected based on current check-in rate?",
    "What recommendations do you have for organizer gate staffing?",
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchDashboardMetrics(selectedEvent.id);
    }
  }, [selectedEvent?.id]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok && data.events) {
        setEvents(data.events);
        if (data.events.length > 0 && !selectedEvent) {
          setSelectedEvent(data.events[0]);
        }
      }
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardMetrics(eventId: string) {
    try {
      const res = await fetch(`/api/events/${eventId}/dashboard`);
      const data = await res.json();
      if (res.ok && data.metrics) {
        setDashboardMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Fetch metrics error:", err);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !date || !capacity) return;

    setCreateLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date: new Date(date).toISOString(),
          capacity: Number(capacity),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Event creation failed");
        setCreateLoading(false);
        return;
      }

      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setDate("");
      setCapacity(50);
      fetchEvents();
    } catch (err) {
      alert("Network error creating event");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleProcessCheckIn(e: React.FormEvent) {
    e.preventDefault();
    if (!scanToken.trim()) return;

    setScanLoading(true);
    setScanStatus(null);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: scanToken.trim() }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setScanStatus({
          type: "success",
          message: `Check-in Successful: ${data.checkIn.attendeeName} (${data.checkIn.eventTitle})`,
          timestamp: new Date(data.checkIn.checkInTime).toLocaleTimeString(),
        });
        setScanToken("");
        if (selectedEvent) fetchDashboardMetrics(selectedEvent.id);
        fetchEvents();
      } else if (res.status === 409) {
        setScanStatus({
          type: "duplicate",
          message: `Duplicate Scan Rejected: ${data.message}`,
          timestamp: data.originalCheckInTime ? new Date(data.originalCheckInTime).toLocaleTimeString() : undefined,
        });
      } else if (res.status === 404) {
        setScanStatus({
          type: "invalid",
          message: `Invalid QR Code: ${data.message}`,
        });
      } else {
        setScanStatus({
          type: "error",
          message: data.message || "Check-in failed",
        });
      }
    } catch (err) {
      setScanStatus({
        type: "error",
        message: "Network error processing check-in",
      });
    } finally {
      setScanLoading(false);
    }
  }

  async function fetchAiInsights(question?: string) {
    if (!selectedEvent) return;
    setAiLoading(true);
    try {
      const res = await fetch(`/api/events/${selectedEvent.id}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question || customQuestion || "Analyze check-in velocity" }),
      });
      const data = await res.json();
      if (res.ok && data.insights) {
        setAiInsight(data.insights);
      }
    } catch (err) {
      console.error("AI Insights error:", err);
    } finally {
      setAiLoading(false);
    }
  }

  function handleExportCsv() {
    if (!selectedEvent) return;
    playClickSFX();
    window.open(`/api/events/${selectedEvent.id}/export`, "_blank");
  }

  return (
    <div className="space-y-6 text-white font-sans">
      {/* 1. KINETIC EDITORIAL CONSOLE BANNER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#e443b4]/15 via-[#7a54ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e443b4] animate-pulse" />
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Organizer Command Console
            </h1>
            <span className="rounded-full bg-[#e443b4]/20 px-3 py-1 text-[10px] font-mono font-bold text-[#ffabdd] border border-[#e443b4]/40 uppercase tracking-widest">
              Role: ORGANIZER
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
            Monitor real-time event check-ins, process scans, export official CSV rosters, and query server-side AI insights.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSFX();
            setShowCreateModal(true);
          }}
          onMouseEnter={playHoverSFX}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e443b4] to-[#7a54ff] px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider relative z-10 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </button>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Events Selector List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffabdd] uppercase flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#e443b4]" /> Active Campus Events
            </span>
            <span className="text-[10px] font-mono text-slate-400">{events.length} Loaded</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-xs font-mono text-slate-400 animate-pulse">
              Syncing campus events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-xs font-mono text-slate-400">
              No events found. Click "Create New Event" above.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      playClickSFX();
                      setSelectedEvent(evt);
                    }}
                    onMouseEnter={playHoverSFX}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? "border-[#e443b4] bg-[#e443b4]/15 shadow-xl scale-[1.01]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#e443b4]" />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-bold text-white text-sm leading-snug">
                        {evt.title}
                      </h3>
                      {evt.isFull ? (
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-rose-300 border border-rose-500/30 shrink-0 uppercase">
                          FULL
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30 shrink-0 uppercase">
                          OPEN
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 font-light">
                      {evt.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/10 pt-2.5">
                      <span>Cap: <b className="text-white">{evt.capacity}</b></span>
                      <span>Reg: <b className="text-[#7a54ff]">{evt.registeredCount}</b></span>
                      <span>CheckedIn: <b className="text-emerald-400">{evt.checkedInCount}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Center & Right Column: Metrics, AI Insights, Scanner */}
        <div className="lg:col-span-8 space-y-6">
          {selectedEvent ? (
            <>
              {/* Event Live Operations Panel */}
              <div className="rounded-3xl border border-white/15 bg-white/5 p-6 space-y-6 backdrop-blur-xl shadow-xl">
                
                {/* Event Title Header & Export Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-[#ffabdd] tracking-widest uppercase">SELECTED EVENT COMMAND</span>
                    <h2 className="font-heading text-xl font-extrabold text-white mt-0.5">
                      {selectedEvent.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playClickSFX();
                        fetchAiInsights();
                      }}
                      onMouseEnter={playHoverSFX}
                      disabled={aiLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#7a54ff]/40 bg-[#7a54ff]/15 px-3.5 py-2 text-xs font-bold text-[#b5a1ff] transition hover:bg-[#7a54ff]/30 cursor-pointer"
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? "animate-spin text-[#e443b4]" : ""}`} />
                      AI Insights
                    </button>

                    <button
                      onClick={handleExportCsv}
                      onMouseEnter={playHoverSFX}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/20 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Live Metrics Grid Cards */}
                {dashboardMetrics ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">CAPACITY</span>
                      <strong className="font-heading text-2xl font-extrabold text-white block">
                        {dashboardMetrics.capacity}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-[#7a54ff]/30 bg-[#7a54ff]/10 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-[#b5a1ff] uppercase tracking-wider block">REGISTERED</span>
                      <strong className="font-heading text-2xl font-extrabold text-[#b5a1ff] block">
                        {dashboardMetrics.registeredCount}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-emerald-300 uppercase tracking-wider block">CHECKED IN</span>
                      <strong className="font-heading text-2xl font-extrabold text-emerald-400 block">
                        {dashboardMetrics.checkedInCount}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-[#e443b4]/30 bg-[#e443b4]/10 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-[#ffabdd] uppercase tracking-wider block">CHECK-IN RATE</span>
                      <strong className="font-heading text-2xl font-extrabold text-[#ffabdd] block">
                        {dashboardMetrics.checkInPercentage}%
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-rose-300 uppercase tracking-wider block">NO-SHOWS</span>
                      <strong className="font-heading text-2xl font-extrabold text-rose-400 block">
                        {dashboardMetrics.noShowCount}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1">
                      <span className="text-[9px] font-mono text-amber-300 uppercase tracking-wider block">PEAK ARRIVAL</span>
                      <strong className="font-heading text-xs font-bold text-amber-200 block truncate mt-1">
                        {dashboardMetrics.peakCheckInTime || "N/A"}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs font-mono text-slate-400 animate-pulse">
                    Loading live metrics...
                  </div>
                )}

                {/* Server-Side AI Intelligence Box */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-[#e443b4]" />
                    <h3 className="font-heading text-sm font-bold text-white">Ask Event Intelligence</h3>
                  </div>

                  {/* Suggested Question Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playClickSFX();
                          setCustomQuestion(q);
                          fetchAiInsights(q);
                        }}
                        onMouseEnter={playHoverSFX}
                        className="text-left text-xs font-mono p-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#e443b4] hover:bg-[#e443b4]/10 transition text-slate-300 hover:text-white cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Custom AI Query Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Ask custom question about check-in velocity..."
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-[#e443b4] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        playClickSFX();
                        fetchAiInsights();
                      }}
                      disabled={aiLoading}
                      className="px-4 py-2 rounded-xl bg-[#e443b4] font-bold text-xs text-white hover:bg-[#7a54ff] transition cursor-pointer shrink-0"
                    >
                      Query AI
                    </button>
                  </div>

                  {/* AI Response Output */}
                  {aiInsight && (
                    <div className="rounded-xl border border-[#e443b4]/40 bg-[#e443b4]/10 p-4 space-y-2">
                      <div className="text-[10px] font-mono text-[#ffabdd] uppercase tracking-wider font-bold">
                        AI INTELLIGENCE REPORT: {aiInsight.query}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-light">
                        {aiInsight.summary}
                      </p>
                      {aiInsight.recommendations.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1">
                          <span className="text-[9px] font-mono text-emerald-400 font-bold block">RECOMMENDATIONS:</span>
                          <ul className="list-disc list-inside text-xs text-slate-300 font-mono space-y-0.5">
                            {aiInsight.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Manual Gate Scanner */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-heading text-sm font-bold text-white">Quick Gate Token Scanner</h3>
                  </div>

                  <form onSubmit={handleProcessCheckIn} className="flex gap-2">
                    <input
                      type="text"
                      value={scanToken}
                      onChange={(e) => setScanToken(e.target.value)}
                      placeholder="Enter or paste ORBIT-ATT-xxx token..."
                      className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-emerald-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={scanLoading}
                      className="px-4 py-2 rounded-xl bg-emerald-500 font-bold text-xs text-slate-900 hover:bg-emerald-400 transition cursor-pointer shrink-0"
                    >
                      {scanLoading ? "Processing..." : "Process Scan"}
                    </button>
                  </form>

                  {scanStatus && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono ${
                        scanStatus.type === "success"
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                          : scanStatus.type === "duplicate"
                          ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                          : "border-rose-500/40 bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {scanStatus.message}
                    </div>
                  )}
                </div>

                {/* Recent Check-Ins Table */}
                {dashboardMetrics && dashboardMetrics.recentCheckIns.length > 0 && (
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
                      RECENT GATE SCAN LOG
                    </span>
                    <div className="space-y-1.5">
                      {dashboardMetrics.recentCheckIns.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl border border-white/10 bg-black/30 text-slate-300"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="font-bold text-white">{log.attendeeName}</span>
                            <span className="text-slate-500">({log.attendeeEmail})</span>
                          </div>
                          <span className="text-emerald-400 font-bold">
                            {new Date(log.checkInTime).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-white/5 p-12 text-center text-slate-400 font-mono text-sm">
              Select an active event from the left menu to view live operations metrics.
            </div>
          )}
        </div>
      </div>

      {/* 3. DARK CREATE NEW EVENT MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#1c1a22] p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-mono text-[#e443b4] uppercase tracking-widest">ORGANIZER ACTION</span>
                <h3 className="font-heading text-xl font-extrabold text-white mt-0.5">Create Campus Event</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-xl border border-white/15 bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MIC CodeStorm 2026"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#e443b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event details and agenda..."
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#e443b4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-[#e443b4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Room Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-[#e443b4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e443b4] to-[#7a54ff] text-xs font-bold text-white hover:opacity-95 cursor-pointer uppercase tracking-wider"
                >
                  {createLoading ? "Creating..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
