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

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "google.user@orbitcheck.com",
          name: "Google Account User",
          role: role || "ATTENDEE",
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      setError("Network failure logging in with Google");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {mode === "login" ? "Sign In to OrbitCheck" : "Create OrbitCheck Account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Error Banner */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Login Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            or email
          </span>
        </div>

        {/* Quick Demo Credentials Fill */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 text-xs">
          <span className="font-semibold text-indigo-700">Quick Fill Demo Account:</span>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("organizer")}
              className="rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 shadow-xs"
            >
              Organizer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("attendee")}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Attendee Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-700">Full Name</label>
              <div className="mt-1 relative flex items-center">
                <UserIcon className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700">Email Address</label>
            <div className="mt-1 relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@orbitcheck.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Password</label>
            <div className="mt-1 relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-700">Account Role</label>
              <div className="mt-1 flex gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="role"
                    value="ATTENDEE"
                    checked={role === "ATTENDEE"}
                    onChange={() => setRole("ATTENDEE")}
                    className="text-indigo-600"
                  />
                  Attendee
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="role"
                    value="ORGANIZER"
                    checked={role === "ORGANIZER"}
                    onChange={() => setRole("ORGANIZER")}
                    className="text-indigo-600"
                  />
                  Event Organizer
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="font-semibold text-indigo-600 hover:underline"
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
                className="font-semibold text-indigo-600 hover:underline"
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

