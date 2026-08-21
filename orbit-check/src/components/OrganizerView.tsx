"use client";

import React, { useState, useEffect } from "react";
import { Plus, Download, QrCode, TrendingUp, UserX, Clock, CheckCircle2, Sparkles, Bot, AlertCircle, Users, ShieldCheck } from "lucide-react";

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
      setAiInsight(null);
      const interval = setInterval(() => {
        fetchDashboardMetrics(selectedEvent.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedEvent?.id]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        if (data.events && data.events.length > 0 && !selectedEvent) {
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

  async function fetchAiInsights(questionText?: string) {
    if (!selectedEvent) return;
    const queryToSubmit = questionText || customQuestion || "Analyze check-in velocity and suggest operational improvements";
    setAiLoading(true);
    try {
      const res = await fetch(`/api/events/${selectedEvent.id}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryToSubmit }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiInsight(data);
      } else {
        alert(data.message || "Failed to generate AI insights");
      }
    } catch (err) {
      alert("Network error fetching AI insights");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
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
          message: `✅ Check-in Successful: ${data.checkIn.attendeeName} (${data.checkIn.eventTitle})`,
          timestamp: new Date(data.checkIn.checkInTime).toLocaleTimeString(),
        });
        setScanToken("");
        if (selectedEvent) fetchDashboardMetrics(selectedEvent.id);
        fetchEvents();
      } else if (res.status === 409) {
        setScanStatus({
          type: "duplicate",
          message: `⚠️ Duplicate Scan Rejected: ${data.message}`,
          timestamp: data.originalCheckInTime ? new Date(data.originalCheckInTime).toLocaleTimeString() : undefined,
        });
      } else if (res.status === 404) {
        setScanStatus({
          type: "invalid",
          message: `❌ Invalid QR Code: ${data.message}`,
        });
      } else {
        setScanStatus({
          type: "error",
          message: `❌ Error: ${data.message || "Check-in failed"}`,
        });
      }
    } catch (err) {
      setScanStatus({
        type: "error",
        message: "❌ Network failure while processing check-in",
      });
    } finally {
      setScanLoading(false);
    }
  }

  function handleExportCsv() {
    if (!selectedEvent) return;
    window.open(`/api/events/${selectedEvent.id}/export`, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Console Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">Organizer Command Console</h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              Role: ORGANIZER
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Monitor real-time event check-ins, process scans, export CSV rosters, and query server-side AI insights.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:from-indigo-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Events List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Active Campus Events</h2>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
              No events found. Click "Create New Event" above.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selectedEvent?.id === evt.id
                      ? "border-indigo-500 bg-indigo-50/60 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
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
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{evt.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
                    <span>Cap: {evt.capacity}</span>
                    <span>Reg: {evt.registeredCount}</span>
                    <span>CheckIn: {evt.checkedInCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center & Right Column: Metrics, AI Insights, Scanner */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEvent ? (
            <>
              {/* Event Live Metrics Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedEvent.title}</h2>
                    <p className="text-xs text-slate-500">Live Operations Metrics</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchAiInsights()}
                      disabled={aiLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                      {aiLoading ? "Analyzing..." : "Generate AI Insights"}
                    </button>
                    <button
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Capacity</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{selectedEvent.capacity}</div>
                  </div>
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3.5">
                    <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Registered</div>
                    <div className="mt-1 text-2xl font-black text-indigo-800">{selectedEvent.registeredCount}</div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Checked In</div>
                    <div className="mt-1 text-2xl font-black text-emerald-800">{selectedEvent.checkedInCount}</div>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5">
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Check-In Rate
                    </div>
                    <div className="mt-1 text-2xl font-black text-blue-800">
                      {dashboardMetrics ? `${dashboardMetrics.checkInPercentage}%` : "0%"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                    <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                      <UserX className="h-3 w-3" /> No-Show Count
                    </div>
                    <div className="mt-1 text-2xl font-black text-rose-800">
                      {dashboardMetrics ? dashboardMetrics.noShowCount : 0}
                    </div>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Peak Arrival
                    </div>
                    <div className="mt-1 text-xs font-bold text-amber-900 truncate">
                      {dashboardMetrics ? dashboardMetrics.peakCheckInTime : "N/A"}
                    </div>
                  </div>
                </div>

                {/* AI Insights Interaction Section */}
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <Bot className="h-4 w-4" />
                    Ask Event Intelligence
                  </div>

                  {/* Suggested Question Chips */}
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomQuestion(q);
                          fetchAiInsights(q);
                        }}
                        className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-50 text-left transition shadow-xs"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* AI Response Box */}
                  {aiInsight && (
                    <div className="rounded-xl border border-indigo-200 bg-white p-4 space-y-2 text-xs shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-indigo-700">Query: "{aiInsight.query}"</span>
                        {aiInsight.isFallback && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            Ground-Truth Engine
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{aiInsight.summary}</p>
                      {aiInsight.recommendations.length > 0 && (
                        <div className="pt-2">
                          <div className="font-bold text-indigo-700 mb-1">Recommendations:</div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {aiInsight.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checked-In Roster List */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Live Checked-In Attendee Roster
                  </h3>

                  {dashboardMetrics?.recentCheckIns.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                      No checked-in attendees yet for this event.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {dashboardMetrics?.recentCheckIns.map((ci) => (
                        <div
                          key={ci.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{ci.attendeeName}</div>
                            <div className="text-[11px] text-slate-500">{ci.attendeeEmail}</div>
                          </div>
                          <div className="text-right">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              Checked In
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                              {new Date(ci.checkInTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* QR Scan Input Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">QR Code Check-In Console</h3>
                </div>

                <form onSubmit={handleProcessCheckIn} className="flex gap-2">
                  <input
                    type="text"
                    value={scanToken}
                    onChange={(e) => setScanToken(e.target.value)}
                    placeholder="Scan camera or paste ORBIT-REG-... QR token"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={scanLoading || !scanToken.trim()}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {scanLoading ? "Scanning..." : "Process Scan"}
                  </button>
                </form>

                {/* Explicit Scan Status Banner */}
                {scanStatus && (
                  <div
                    className={`rounded-xl border p-4 text-xs font-semibold ${
                      scanStatus.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : scanStatus.type === "duplicate"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>{scanStatus.message}</div>
                      {scanStatus.timestamp && (
                        <div className="text-[10px] font-mono opacity-80">Time: {scanStatus.timestamp}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              Select an event from the left list to view metrics and scan check-ins.
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Create Event
            </h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MIC Tech Summit 2026"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">Capacity Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {createLoading ? "Saving..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

