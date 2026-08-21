"use client";

import React, { useEffect, useState, useRef } from "react";
import { Camera, CameraOff, QrCode, RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import {
  queueOfflineScan,
  getPendingOutboxScans,
  updateOutboxScanStatus,
  OutboxScan,
} from "@/lib/offlineDb";

export function CameraScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [manualToken, setManualToken] = useState("");
  const [outboxItems, setOutboxItems] = useState<OutboxScan[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastScanMessage, setLastScanMessage] = useState<{
    type: "success" | "duplicate" | "queued" | "error" | "conflict";
    text: string;
  } | null>(null);

  const scannerRef = useRef<any>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      autoSyncOutbox();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    fetchOutbox();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      stopCamera();
    };
  }, []);

  async function fetchOutbox() {
    try {
      const items = await getPendingOutboxScans();
      setOutboxItems(items);
    } catch (e) {
      console.error("Fetch outbox error:", e);
    }
  }

  async function startCamera() {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5Qrcode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanCaptured(decodedText);
        },
        (errorMessage) => {
          // ignore scan frame errors
        }
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraError(
        err?.message || "Camera permission denied or camera unavailable."
      );
      setIsCameraActive(false);
    }
  }

  async function stopCamera() {
    if (scannerRef.current && isCameraActive) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.error("Stop camera error:", e);
      }
      setIsCameraActive(false);
    }
  }

  async function handleScanCaptured(token: string) {
    if (!token.trim()) return;

    if (!navigator.onLine) {
      const queued = await queueOfflineScan(token.trim(), "web-camera");
      setLastScanMessage({
        type: "queued",
        text: `📶 Device Offline: QR token queued in local IndexedDB outbox (Key: ${queued.idempotencyKey.substring(0, 12)}...)`,
      });
      fetchOutbox();
      return;
    }

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: token.trim() }),
      });
      const data = await res.json();

      if (res.status === 201) {
        setLastScanMessage({
          type: "success",
          text: `✅ Check-in Success: ${data.checkIn.attendeeName} (${data.checkIn.eventTitle})`,
        });
      } else if (res.status === 409) {
        setLastScanMessage({
          type: "duplicate",
          text: `⚠️ Duplicate Scan Rejected: ${data.message}`,
        });
      } else {
        setLastScanMessage({
          type: "error",
          text: `❌ Scan Error: ${data.message || "Invalid token"}`,
        });
      }
    } catch (err) {
      await queueOfflineScan(token.trim(), "web-camera");
      setLastScanMessage({
        type: "queued",
        text: "📶 Network drop detected during scan. Saved to local IndexedDB outbox.",
      });
      fetchOutbox();
    }
  }

  async function autoSyncOutbox() {
    const pending = await getPendingOutboxScans();
    if (pending.length === 0) return;

    setIsSyncing(true);
    try {
      const payload = {
        scans: pending.map((item) => ({
          idempotencyKey: item.idempotencyKey,
          qrToken: item.qrToken,
          deviceId: item.deviceId,
          offlineCapturedAt: item.offlineCapturedAt,
        })),
      };

      const res = await fetch("/api/checkin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.results) {
        for (const result of data.results) {
          const matchedItem = pending.find((p) => p.idempotencyKey === result.idempotencyKey);
          if (matchedItem && matchedItem.id) {
            await updateOutboxScanStatus(matchedItem.id, result.status, result.message);
          }
        }
        setLastScanMessage({
          type: "success",
          text: `🔄 Reconnect Sync Complete: Processed ${data.results.length} offline scans with server authority.`,
        });
      }
    } catch (err) {
      console.error("Auto sync error:", err);
    } finally {
      setIsSyncing(false);
      fetchOutbox();
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Wifi className="h-4 w-4 text-emerald-600" />
              Online (Live Database Connection)
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <WifiOff className="h-4 w-4 text-amber-600 animate-pulse" />
              Offline Mode (IndexedDB Outbox Active)
            </div>
          )}
        </div>

        <button
          onClick={autoSyncOutbox}
          disabled={!isOnline || isSyncing}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-40 shadow-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing Outbox..." : "Sync Pending Scans"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Camera Viewport */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-600" />
              Webcam Scanner Feed
            </h2>
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
              >
                <CameraOff className="h-3.5 w-3.5" />
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-indigo-700 hover:to-blue-700"
              >
                <Camera className="h-3.5 w-3.5" />
                Start Camera
              </button>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Camera Container with Scanning Frame Overlay */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 min-h-[280px] flex items-center justify-center shadow-inner">
            <div id="qr-reader" className="w-full"></div>
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <QrCode className="h-12 w-12 text-indigo-400/40 mb-3 animate-pulse" />
                <p className="text-xs font-medium text-slate-300">Click "Start Camera" or enter manual token below.</p>
              </div>
            )}
          </div>

          {/* Manual Input Fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScanCaptured(manualToken);
              setManualToken("");
            }}
            className="pt-2"
          >
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Manual QR Token Input (Testing / Fallback)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste ORBIT-REG-... payload"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Submit Scan
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Offline Outbox Queue & Status Feedback */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Offline Outbox Queue ({outboxItems.length})
          </h2>

          {/* Feedback Banner */}
          {lastScanMessage && (
            <div
              className={`rounded-xl border p-4 text-xs font-bold shadow-xs ${
                lastScanMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : lastScanMessage.type === "queued"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : lastScanMessage.type === "duplicate"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {lastScanMessage.text}
            </div>
          )}

          {/* Pending Outbox Queue Table */}
          {outboxItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
              No pending outbox items. All scan events synced with PostgreSQL server!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {outboxItems.map((item) => (
                <div
                  key={item.idempotencyKey}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-indigo-700 text-[11px] font-semibold truncate max-w-[200px]">
                      {item.qrToken}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.syncStatus === "PENDING"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : item.syncStatus === "SYNCED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {item.syncStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                    <span>Key: {item.idempotencyKey.substring(0, 16)}...</span>
                    <span>{new Date(item.offlineCapturedAt).toLocaleTimeString()}</span>
                  </div>
                  {item.serverResponse && (
                    <div className="text-[10px] text-slate-600 italic pt-1 border-t border-slate-200">
                      {item.serverResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

