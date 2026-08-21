"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, CheckCircle2, AlertCircle, RefreshCw, Camera, CameraOff, Volume2, ShieldCheck, Zap } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { playClickSFX, playHoverSFX } from "@/lib/audio";

interface CheckInLog {
  id: string;
  type: "success" | "duplicate" | "error" | "invalid";
  message: string;
  attendeeName?: string;
  eventTitle?: string;
  timestamp: string;
}

export function CameraScanner() {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [lastScanStatus, setLastScanStatus] = useState<CheckInLog | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedTokenRef = useRef<string>("");
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  async function checkCameraAvailability() {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setHasCamera(false);
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      setHasCamera(videoDevices.length > 0);
    } catch (err) {
      setHasCamera(false);
    }
  }

  async function startCamera() {
    playClickSFX();
    setScanError(null);
    try {
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleAutoScannedQr(decodedText);
        },
        () => {}
      );

      setCameraActive(true);
    } catch (err: any) {
      console.error("Html5Qrcode start error:", err);
      alert("Unable to access webcam device. Please grant camera permissions or use manual token entry.");
      setCameraActive(false);
    }
  }

  const [scanError, setScanError] = useState<string | null>(null);

  async function stopCamera() {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Stop camera error:", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
    setCameraActive(false);
  }

  function handleAutoScannedQr(decodedText: string) {
    if (!decodedText) return;
    if (lastScannedTokenRef.current === decodedText) return;

    lastScannedTokenRef.current = decodedText;
    playClickSFX();
    processToken(decodedText);

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      lastScannedTokenRef.current = "";
    }, 2500);
  }

  async function processToken(tokenToScan: string) {
    if (!tokenToScan.trim()) return;
    setScanning(true);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: tokenToScan.trim() }),
      });

      const data = await res.json();
      const nowStr = new Date().toLocaleTimeString();

      let logEntry: CheckInLog;

      if (res.status === 201) {
        logEntry = {
          id: `log-${Date.now()}`,
          type: "success",
          message: `Valid Check-In: ${data.checkIn.attendeeName} (${data.checkIn.eventTitle})`,
          attendeeName: data.checkIn.attendeeName,
          eventTitle: data.checkIn.eventTitle,
          timestamp: nowStr,
        };
      } else if (res.status === 409) {
        logEntry = {
          id: `log-${Date.now()}`,
          type: "duplicate",
          message: `Duplicate Scan Rejected: ${data.message}`,
          timestamp: nowStr,
        };
      } else if (res.status === 404) {
        logEntry = {
          id: `log-${Date.now()}`,
          type: "invalid",
          message: `Invalid QR Code: ${data.message}`,
          timestamp: nowStr,
        };
      } else {
        logEntry = {
          id: `log-${Date.now()}`,
          type: "error",
          message: data.message || "Check-in failed",
          timestamp: nowStr,
        };
      }

      setLastScanStatus(logEntry);
      setLogs((prev) => [logEntry, ...prev.slice(0, 19)]);
      setManualToken("");
    } catch (err) {
      const errEntry: CheckInLog = {
        id: `log-${Date.now()}`,
        type: "error",
        message: "Network error processing check-in",
        timestamp: new Date().toLocaleTimeString(),
      };
      setLastScanStatus(errEntry);
      setLogs((prev) => [errEntry, ...prev.slice(0, 19)]);
    } finally {
      setScanning(false);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    processToken(manualToken);
  }

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Webcam Gate Scanner
            </h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            Real-time automated QR video scanner engine operating at sub-100ms verification latency.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0 font-mono text-xs">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Multi-Gate Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewfinder */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffabdd] uppercase flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-[#e443b4]" /> Live Video Viewfinder
              </span>

              {cameraActive ? (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" /> Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#e443b4] to-[#7a54ff] text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" /> Start Webcam
                </button>
              )}
            </div>

            {/* Video Canvas Container for Html5Qrcode Reader */}
            <div className="relative h-72 sm:h-80 bg-black/80 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center">
              <div
                id="qr-reader"
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />

              {!cameraActive && (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <QrCode className="w-6 h-6 text-[#e443b4]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white">Camera Standby</span>
                  <p className="text-[11px] font-light text-slate-400 max-w-xs">
                    Click "Start Webcam" above to enable automated video frame QR scanning or paste tokens below.
                  </p>
                </div>
              )}
            </div>

            {/* Manual Token Fallback Input */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                MANUAL ORBIT TOKEN ENTRY
              </span>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste or type ORBIT-ATT-xxx..."
                  className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:border-[#e443b4] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={scanning}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 font-bold text-xs text-slate-900 hover:bg-emerald-400 transition cursor-pointer shrink-0 uppercase font-mono"
                >
                  {scanning ? "Validating..." : "Verify Gate Token"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Result & Real-Time Log */}
        <div className="lg:col-span-5 space-y-4">
          {/* Last Scan Callout */}
          {lastScanStatus && (
            <div
              className={`p-5 rounded-3xl border text-xs font-mono space-y-2 backdrop-blur-xl shadow-xl ${
                lastScanStatus.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                  : lastScanStatus.type === "duplicate"
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
                  : "border-rose-500/40 bg-rose-500/15 text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>
                  {lastScanStatus.type === "success"
                    ? "✅ SCAN PASSED"
                    : lastScanStatus.type === "duplicate"
                    ? "⚠️ DUPLICATE REJECTED"
                    : "❌ SCAN FAILED"}
                </span>
                <span className="text-[10px] opacity-75">{lastScanStatus.timestamp}</span>
              </div>
              <p className="text-xs leading-relaxed font-light">{lastScanStatus.message}</p>
            </div>
          )}

          {/* Real-time Scan Log Stream */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl shadow-xl space-y-3">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
              REAL-TIME GATE AUDIT STREAM
            </span>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-slate-500">
                No gate scans processed yet in this session.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl border border-white/10 bg-black/40 text-xs font-mono flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">
                        {log.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : log.type === "duplicate" ? (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </span>
                      <div>
                        <div className="font-bold text-white leading-snug">{log.message}</div>
                        {log.attendeeName && (
                          <div className="text-[10px] text-slate-400">{log.attendeeName}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
