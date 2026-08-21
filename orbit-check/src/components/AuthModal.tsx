"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Shield, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ORGANIZER" | "ATTENDEE">("ATTENDEE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { email, password }
        : { email, password, name, role };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError("Network failure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFill(demoType: "organizer" | "attendee") {
    if (demoType === "organizer") {
      setEmail("organizer@orbitcheck.com");
      setPassword("Password123!");
    } else {
      setEmail("attendee1@orbitcheck.com");
      setPassword("Password123!");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-blue-500/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white">
            {mode === "login" ? "Sign In to OrbitCheck" : "Create OrbitCheck Account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Error Banner */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials Fill */}
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs">
          <span className="font-semibold text-blue-300">Quick Fill Demo Account:</span>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("organizer")}
              className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20"
            >
              Organizer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("attendee")}
              className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20"
            >
              Attendee Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-300">Full Name</label>
              <div className="mt-1 relative flex items-center">
                <UserIcon className="absolute left-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300">Email Address</label>
            <div className="mt-1 relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@orbitcheck.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Password</label>
            <div className="mt-1 relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-300">Account Role</label>
              <div className="mt-1 flex gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="role"
                    value="ATTENDEE"
                    checked={role === "ATTENDEE"}
                    onChange={() => setRole("ATTENDEE")}
                    className="text-blue-600"
                  />
                  Attendee
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                  <input
                    type="radio"
                    name="role"
                    value="ORGANIZER"
                    checked={role === "ORGANIZER"}
                    onChange={() => setRole("ORGANIZER")}
                    className="text-blue-600"
                  />
                  Event Organizer
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="font-semibold text-blue-400 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-semibold text-blue-400 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
