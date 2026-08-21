"use client";

import React from "react";
import { User, LogOut, ShieldCheck, Ticket, Calendar, QrCode } from "lucide-react";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ORGANIZER" | "ATTENDEE";
}

interface HeaderProps {
  user: SessionUser | null;
  activeTab: "events" | "tickets" | "organizer" | "scanner";
  setActiveTab: (tab: "events" | "tickets" | "organizer" | "scanner") => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickLogin: (role: "ORGANIZER" | "ATTENDEE") => void;
}

export function Header({
  user,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onQuickLogin,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
              OrbitCheck
            </span>
            <span className="ml-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
              v1.0
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "events"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Discover Events
            </button>

            {user.role === "ATTENDEE" && (
              <button
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === "tickets"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Ticket className="h-4 w-4" />
                My QR Tickets
              </button>
            )}

            {user.role === "ORGANIZER" && (
              <>
                <button
                  onClick={() => setActiveTab("organizer")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === "organizer"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Organizer Console
                </button>

                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === "scanner"
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  QR Scanner
                </button>
              </>
            )}
          </nav>
        )}

        {/* User Account Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono uppercase">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quick Demo Logins */}
              <button
                onClick={() => onQuickLogin("ORGANIZER")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Demo Organizer
              </button>
              <button
                onClick={() => onQuickLogin("ATTENDEE")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <User className="h-3.5 w-3.5" />
                Demo Attendee
              </button>
              <button
                onClick={onOpenLogin}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
