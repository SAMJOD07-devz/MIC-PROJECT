"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { LandingPage } from "@/components/LandingPage";
import { OrganizerView } from "@/components/OrganizerView";
import { AttendeeView } from "@/components/AttendeeView";
import { CameraScanner } from "@/components/CameraScanner";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ORGANIZER" | "ATTENDEE";
}

export default function HomePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [activeTab, setActiveTab] = useState<"landing" | "events" | "tickets" | "organizer" | "scanner">("landing");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  async function fetchSession() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        if (data.user.role === "ORGANIZER") {
          setActiveTab("organizer");
        } else {
          setActiveTab("events");
        }
      } else {
        setActiveTab("landing");
      }
    } catch (err) {
      console.error("Session check error:", err);
      setActiveTab("landing");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setActiveTab("landing");
    }
  }

  async function handleQuickLogin(role: "ORGANIZER" | "ATTENDEE") {
    const email = role === "ORGANIZER" ? "organizer@orbitcheck.com" : "attendee1@orbitcheck.com";
    const password = "Password123!";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        if (data.user.role === "ORGANIZER") {
          setActiveTab("organizer");
        } else {
          setActiveTab("events");
        }
      } else {
        alert(`Demo login failed: ${data.message}`);
      }
    } catch (err) {
      alert("Network error logging in");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#16151a] text-slate-100 flex flex-col font-sans selection:bg-[#e443b4] selection:text-white">
      {/* Navigation Header */}
      <Header
        user={user}
        activeTab={activeTab === "landing" ? "events" : activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        onOpenLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-[#e443b4] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-mono">Loading OrbitCheck System...</span>
          </div>
        ) : (
          <>
            {activeTab === "landing" && !user ? (
              /* Full-bleed landing page spanning 100% viewport width without extra side space */
              <LandingPage
                onEnterOrganizer={() => handleQuickLogin("ORGANIZER")}
                onEnterAttendee={() => handleQuickLogin("ATTENDEE")}
                onOpenLogin={() => setShowAuthModal(true)}
              />
            ) : (
              /* Authenticated Dashboard Container */
              <div className="mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
                {activeTab === "scanner" && user?.role === "ORGANIZER" ? (
                  <CameraScanner />
                ) : user?.role === "ORGANIZER" ? (
                  <OrganizerView />
                ) : (
                  <AttendeeView />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (loggedUser.role === "ORGANIZER") {
            setActiveTab("organizer");
          } else {
            setActiveTab("events");
          }
        }}
      />

      {/* Authenticated Dashboard Footer */}
      {user && (
        <footer className="border-t border-white/10 bg-[#16151a] py-6 text-center text-xs text-slate-400 relative z-10 backdrop-blur-sm shadow-xs">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveTab(user ? (user.role === "ORGANIZER" ? "organizer" : "events") : "landing")}
                className="font-bold text-white cursor-pointer hover:text-[#e443b4] transition"
              >
                OrbitCheck Console
              </span>
              <span>— MIC Campus Event Command Center</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Concurrency Guarded</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e443b4] inline-block"></span> IndexedDB Sync</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
