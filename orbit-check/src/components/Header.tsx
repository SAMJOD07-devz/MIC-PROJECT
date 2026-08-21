"use client";

import React, { useState } from "react";
import { User, LogOut, ShieldCheck, Ticket, Calendar, QrCode, Menu, X, Volume2, VolumeX } from "lucide-react";
import { toggleAudioMute, playHoverSFX, playClickSFX } from "@/lib/audio";

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
  onQuickLogin?: (role: "ORGANIZER" | "ATTENDEE") => void;
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
  const [isMuted, setIsMuted] = useState(false);

  const handleAudioToggle = () => {
    const next = toggleAudioMute();
    setIsMuted(next);
    if (!next) playClickSFX();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#16151a]/95 backdrop-blur-xl text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        
        {/* Kinetic Editorial Brand Logo Mark */}
        <button
          onClick={() => {
            playClickSFX();
            scrollTo("top");
          }}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="brand-mark group-hover:scale-105 transition-transform">
            <span className="font-bold text-white font-heading text-lg">O</span>
          </div>
          <div className="flex flex-col">
            <div className="brand-wordmark text-white">
              Orbit<span>Check</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
              Campus event / check-in
            </span>
          </div>
        </button>

        {/* Public Landing Navigation (Scroll Anchors) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-8 text-xs text-slate-300 font-mono">
            <button
              onClick={() => scrollTo("platform")}
              className="hover:text-white transition cursor-pointer"
            >
              Platform
            </button>
            <button
              onClick={() => scrollTo("signal")}
              className="hover:text-white transition cursor-pointer"
            >
              Live signal
            </button>
            <button
              onClick={() => scrollTo("workflow")}
              className="hover:text-white transition cursor-pointer"
            >
              How it works
            </button>
          </nav>
        )}

        {/* Authenticated Dashboard Navigation Tabs */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => {
                playClickSFX();
                setActiveTab("events");
              }}
              onMouseEnter={playHoverSFX}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                activeTab === "events"
                  ? "bg-[#e443b4] text-white font-bold shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Discover Events
            </button>

            {user.role === "ATTENDEE" && (
              <button
                onClick={() => {
                  playClickSFX();
                  setActiveTab("tickets");
                }}
                onMouseEnter={playHoverSFX}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                  activeTab === "tickets"
                    ? "bg-[#e443b4] text-white font-bold shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Ticket className="h-4 w-4" />
                My QR Tickets
              </button>
            )}

            {user.role === "ORGANIZER" && (
              <>
                <button
                  onClick={() => {
                    playClickSFX();
                    setActiveTab("organizer");
                  }}
                  onMouseEnter={playHoverSFX}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                    activeTab === "organizer"
                      ? "bg-[#e443b4] text-white font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Console Metrics
                </button>

                <button
                  onClick={() => {
                    playClickSFX();
                    setActiveTab("scanner");
                  }}
                  onMouseEnter={playHoverSFX}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none ${
                    activeTab === "scanner"
                      ? "bg-[#e443b4] text-white font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  Webcam Scanner
                </button>
              </>
            )}
          </nav>
        )}

        {/* User Account & Sound Controls */}
        <div className="flex items-center gap-3">
          {/* SFX Audio Toggle */}
          <button
            onClick={handleAudioToggle}
            onMouseEnter={playHoverSFX}
            title={isMuted ? "Enable Sound FX" : "Mute Sound FX"}
            className="p-2 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white transition shadow-xs cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#e443b4]" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-[#e443b4] font-mono uppercase font-semibold">
                  {user.role}
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSFX();
                  onLogout();
                }}
                onMouseEnter={playHoverSFX}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-white shadow-xs cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playClickSFX();
                onOpenLogin();
              }}
              onMouseEnter={playHoverSFX}
              className="px-4 py-2 rounded-xl bg-[#fffdf9] text-[#16151a] font-bold text-xs hover:bg-[#e443b4] hover:text-white transition shadow-xs cursor-pointer"
            >
              Sign In / Register
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              playClickSFX();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#16151a] p-4 space-y-2">
          {!user ? (
            <>
              <button
                onClick={() => {
                  scrollTo("platform");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 text-xs font-mono text-slate-300"
              >
                Platform
              </button>
              <button
                onClick={() => {
                  scrollTo("signal");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 text-xs font-mono text-slate-300"
              >
                Live signal
              </button>
              <button
                onClick={() => {
                  scrollTo("workflow");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 text-xs font-mono text-slate-300"
              >
                How it works
              </button>
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 mt-2 rounded-xl bg-[#e443b4] text-white font-bold text-xs"
              >
                Sign In / Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setActiveTab("events");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  activeTab === "events" ? "bg-[#e443b4] text-white" : "text-slate-300 bg-white/5"
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
                    activeTab === "tickets" ? "bg-[#e443b4] text-white" : "text-slate-300 bg-white/5"
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
                      activeTab === "organizer" ? "bg-[#e443b4] text-white" : "text-slate-300 bg-white/5"
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
                      activeTab === "scanner" ? "bg-[#e443b4] text-white" : "text-slate-300 bg-white/5"
                    }`}
                  >
                    <QrCode className="h-4 w-4" /> Webcam Scanner
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
