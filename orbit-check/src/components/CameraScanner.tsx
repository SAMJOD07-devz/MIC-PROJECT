"use client";

import React, { useEffect, useState, useRef } from "react";
import { Camera, CameraOff, QrCode, RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
    type: "success" | "duplicate" | "queued" | "error";
    text: string;
  } | null>(null);

  const scannerRef = useRef<any>(null);

  useEffect(() => {
    // Monitor online/offline status
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
        err?.message || "Camera access denied or unsupported camera device."
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
      // Offline mode: queue to IndexedDB outbox
      const queued = await queueOfflineScan(token.trim(), "web-camera");
      setLastScanMessage({
        type: "queued",
        text: `📶 Device Offline: QR token queued in local outbox (Key: ${queued.idempotencyKey.substring(0, 12)}...)`,
      });
      fetchOutbox();
      return;
    }

    // Online mode: process check-in immediately
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
      // Fallback queue if request drops during transmission
      await queueOfflineScan(token.trim(), "web-camera");
      setLastScanMessage({
        type: "queued",
        text: "📶 Network drop detected during scan. Saved to local outbox.",
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
          text: `🔄 Reconnect Auto-Sync Complete: Processed ${data.results.length} outbox items.`,
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
      {/* Network Status Header */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Wifi className="h-4 w-4" />
              Online (Live Database Connection)
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <WifiOff className="h-4 w-4" />
              Offline Mode (IndexedDB Outbox Active)
            </div>
          )}
        </div>

        <button
          onClick={autoSyncOutbox}
          disabled={!isOnline || isSyncing}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Pending Outbox"}
        </button>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Camera Viewport & Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-cyan-400" />
              Camera Scanner Feed
            </h2>
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
              >
                <CameraOff className="h-3.5 w-3.5" />
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-cyan-500"
              >
                <Camera className="h-3.5 w-3.5" />
                Start Camera
              </button>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* HTML5 QR Scanner Video Element Container */}
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 min-h-[260px] flex items-center justify-center">
            <div id="qr-reader" className="w-full"></div>
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <QrCode className="h-12 w-12 text-slate-700 mb-2" />
                <p className="text-xs">Click "Start Camera" to enable webcam decoding or use manual token entry below.</p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Manual QR Token Input (Testing / Fallback)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="ORBIT-REG-..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outbox Log & Live Feedback */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            Offline Outbox Queue ({outboxItems.length})
          </h2>

          {/* Feedback Banner */}
          {lastScanMessage && (
            <div
              className={`rounded-xl border p-3 text-xs font-semibold ${
                lastScanMessage.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : lastScanMessage.type === "queued"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : lastScanMessage.type === "duplicate"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-300"
              }`}
            >
              {lastScanMessage.text}
            </div>
          )}

          {/* Pending Outbox Queue Table */}
          {outboxItems.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-500">
              No pending outbox scans in IndexedDB. All scans synced cleanly!
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {outboxItems.map((item) => (
                <div
                  key={item.idempotencyKey}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 text-[11px] truncate max-w-[200px]">
                      {item.qrToken}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.syncStatus === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : item.syncStatus === "SYNCED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {item.syncStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Key: {item.idempotencyKey.substring(0, 16)}...</span>
                    <span>{new Date(item.offlineCapturedAt).toLocaleTimeString()}</span>
                  </div>
                  {item.serverResponse && (
                    <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/60">
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
