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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Live Signal */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-md shadow-indigo-500/20 border border-indigo-400/30">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Orbit<span className="text-indigo-600">Check</span>
              </span>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                PROD
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
              Campus Event Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                activeTab === "events"
                  ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Discover Events
            </button>

            {user.role === "ATTENDEE" && (
              <button
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                  activeTab === "tickets"
                    ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                    activeTab === "organizer"
                      ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Console Metrics
                </button>

                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                    activeTab === "scanner"
                      ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[10px] text-indigo-600 font-mono uppercase font-semibold">
                  {user.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-xs"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuickLogin("ORGANIZER")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 shadow-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Organizer Demo
              </button>
              <button
                onClick={() => onQuickLogin("ATTENDEE")}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-xs"
              >
                <User className="h-3.5 w-3.5" />
                Attendee Demo
              </button>
              <button
                onClick={onOpenLogin}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-700 hover:to-blue-700"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("events");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              activeTab === "events" ? "bg-indigo-600 text-white" : "text-slate-700 bg-slate-100"
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
                activeTab === "tickets" ? "bg-indigo-600 text-white" : "text-slate-700 bg-slate-100"
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
                  activeTab === "organizer" ? "bg-indigo-600 text-white" : "text-slate-700 bg-slate-100"
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
                  activeTab === "scanner" ? "bg-indigo-600 text-white" : "text-slate-700 bg-slate-100"
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

