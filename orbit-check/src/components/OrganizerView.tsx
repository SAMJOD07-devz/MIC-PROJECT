"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, CheckCircle2, Clock, Download, QrCode, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";

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

export function OrganizerView() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        if (data.events && data.events.length > 0) {
          setSelectedEvent(data.events[0]);
        }
      } else {
        setError(data.message || "Failed to load events");
      }
    } catch (err) {
      setError("Network failure loading organizer events");
    } finally {
      setLoading(false);
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
    alert(`Exporting CSV roster for "${selectedEvent.title}"... (CSV export endpoints connected in Phase 8)`);
  }

  return (
    <div className="space-y-6">
      {/* Console Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Organizer Command Console</h1>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Role: ORGANIZER
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Manage event capacity limits, process attendee QR check-in scans, and view live metrics.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Active Events</h2>
          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center text-xs text-slate-400">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
              No events found. Click "Create New Event" above.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selectedEvent?.id === evt.id
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white text-sm">{evt.title}</h3>
                    {evt.isFull ? (
                      <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                        FULL
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        OPEN
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                    <span>Cap: {evt.capacity}</span>
                    <span>Reg: {evt.registeredCount}</span>
                    <span>CheckIn: {evt.checkedInCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center & Right Column: Metrics & Scanner */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEvent ? (
            <>
              {/* Event Metrics Panel */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedEvent.title}</h2>
                    <p className="text-xs text-slate-400">ID: {selectedEvent.id}</p>
                  </div>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV Roster
                  </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Total Capacity</div>
                    <div className="mt-1 text-xl font-black text-white">{selectedEvent.capacity}</div>
                  </div>
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                    <div className="text-[10px] font-semibold text-blue-300 uppercase">Registered</div>
                    <div className="mt-1 text-xl font-black text-blue-400">{selectedEvent.registeredCount}</div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="text-[10px] font-semibold text-emerald-300 uppercase">Checked In</div>
                    <div className="mt-1 text-xl font-black text-emerald-400">{selectedEvent.checkedInCount}</div>
                  </div>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                    <div className="text-[10px] font-semibold text-amber-300 uppercase">Spots Remaining</div>
                    <div className="mt-1 text-xl font-black text-amber-400">{selectedEvent.remainingCapacity}</div>
                  </div>
                </div>
              </div>

              {/* Check-In Scan Input Panel */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">QR Code Check-In Console</h3>
                </div>

                <form onSubmit={handleProcessCheckIn} className="flex gap-2">
                  <input
                    type="text"
                    value={scanToken}
                    onChange={(e) => setScanToken(e.target.value)}
                    placeholder="Scan camera or paste ORBIT-REG-... QR token"
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={scanLoading || !scanToken.trim()}
                    className="rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {scanLoading ? "Scanning..." : "Process Scan"}
                  </button>
                </form>

                {/* Explicit Scan Status Banner */}
                {scanStatus && (
                  <div
                    className={`rounded-xl border p-4 text-xs font-semibold ${
                      scanStatus.type === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : scanStatus.type === "duplicate"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-300"
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500">
              Select an event from the left list to view metrics and scan check-ins.
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Create Event
            </h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MIC Tech Summit 2026"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Capacity Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
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
