"use client";

import React, { useState } from "react";
import { User, LogOut, ShieldCheck, Ticket, Calendar, QrCode, Menu, X, Sparkles } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Live Signal */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                OrbitCheck
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                PROD
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              Campus Event Command Center
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Discover Events
            </button>

            {user.role === "ATTENDEE" && (
              <button
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  activeTab === "tickets"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
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
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    activeTab === "organizer"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Console Metrics
                </button>

                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    activeTab === "scanner"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  Webcam Scanner
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
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono uppercase font-semibold">
                  {user.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 text-slate-300 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuickLogin("ORGANIZER")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-300 transition hover:bg-indigo-500/20"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Organizer Demo
              </button>
              <button
                onClick={() => onQuickLogin("ATTENDEE")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <User className="h-3.5 w-3.5" />
                Attendee Demo
              </button>
              <button
                onClick={onOpenLogin}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("events");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              activeTab === "events" ? "bg-blue-600 text-white" : "text-slate-300 bg-slate-900"
            }`}
          >
            <Calendar className="h-4 w-4" /> Discover Events
          </button>
          {user.role === "ATTENDEE" && (
            <button
              onClick={() => {
                setActiveTab("tickets");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                activeTab === "tickets" ? "bg-blue-600 text-white" : "text-slate-300 bg-slate-900"
              }`}
            >
              <Ticket className="h-4 w-4" /> My QR Tickets
            </button>
          )}
          {user.role === "ORGANIZER" && (
            <>
              <button
                onClick={() => {
                  setActiveTab("organizer");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  activeTab === "organizer" ? "bg-blue-600 text-white" : "text-slate-300 bg-slate-900"
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Console Metrics
              </button>
              <button
                onClick={() => {
                  setActiveTab("scanner");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  activeTab === "scanner" ? "bg-cyan-600 text-white" : "text-slate-300 bg-slate-900"
                }`}
              >
                <QrCode className="h-4 w-4" /> Webcam Scanner
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
