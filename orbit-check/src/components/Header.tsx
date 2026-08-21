"use client";

import React, { useState } from "react";
import { User, LogOut, ShieldCheck, Ticket, Calendar, QrCode, Menu, X, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
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
    setMobileMenuOpen(false);
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        {/* Kinetic Editorial Brand Logo */}
        <button
          className="brand cursor-pointer"
          type="button"
          onClick={() => {
            playClickSFX();
            scrollTo("top");
          }}
        >
          <span className="brand-mark">
            <span>O</span>
          </span>
          <span className="brand-wordmark">
            Orbit<span>Check</span>
            <small>Campus events / check-in</small>
          </span>
        </button>

        {/* Public Landing Desktop Nav */}
        {!user && (
          <nav className="desktop-nav" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo("platform")}>
              Platform
            </button>
            <button type="button" onClick={() => scrollTo("signal")}>
              Live signal
            </button>
            <button type="button" onClick={() => scrollTo("workflow")}>
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
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "events"
                  ? "bg-[#e443b4] text-white font-bold"
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
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeTab === "tickets"
                    ? "bg-[#e443b4] text-white font-bold"
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
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTab === "organizer"
                      ? "bg-[#e443b4] text-white font-bold"
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
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeTab === "scanner"
                      ? "bg-[#e443b4] text-white font-bold"
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

        {/* Topbar Actions */}
        <div className="topbar-actions">
          <button
            className="icon-button cursor-pointer"
            type="button"
            onClick={handleAudioToggle}
            onMouseEnter={playHoverSFX}
            title={isMuted ? "Enable sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {!user ? (
            <>
              {onQuickLogin && (
                <>
                  <button
                    className="text-action desktop-only cursor-pointer"
                    type="button"
                    onClick={() => {
                      playClickSFX();
                      onQuickLogin("ORGANIZER");
                    }}
                  >
                    Organizer demo
                  </button>
                  <button
                    className="text-action desktop-only cursor-pointer"
                    type="button"
                    onClick={() => {
                      playClickSFX();
                      onQuickLogin("ATTENDEE");
                    }}
                  >
                    Attendee demo
                  </button>
                </>
              )}
              <button
                className="sign-in desktop-only cursor-pointer"
                type="button"
                onClick={() => {
                  playClickSFX();
                  onOpenLogin();
                }}
              >
                Sign in <ArrowUpRight size={14} />
              </button>
            </>
          ) : (
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
                className="icon-button cursor-pointer hover:border-rose-400 hover:bg-rose-500/20"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          <button
            className="mobile-menu-button md:hidden cursor-pointer"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          {!user ? (
            <>
              <button type="button" onClick={() => scrollTo("platform")}>
                Platform <ArrowUpRight size={15} />
              </button>
              <button type="button" onClick={() => scrollTo("signal")}>
                Live signal <ArrowUpRight size={15} />
              </button>
              <button type="button" onClick={() => scrollTo("workflow")}>
                How it works <ArrowUpRight size={15} />
              </button>
              {onQuickLogin && (
                <div className="mobile-nav-actions">
                  <button type="button" onClick={() => onQuickLogin("ORGANIZER")}>
                    Organizer demo
                  </button>
                  <button type="button" onClick={() => onQuickLogin("ATTENDEE")}>
                    Attendee demo
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("events");
                  setMobileMenuOpen(false);
                }}
              >
                Discover Events
              </button>
              {user.role === "ATTENDEE" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("tickets");
                    setMobileMenuOpen(false);
                  }}
                >
                  My QR Tickets
                </button>
              )}
              {user.role === "ORGANIZER" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("organizer");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Console Metrics
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("scanner");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Webcam Scanner
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
