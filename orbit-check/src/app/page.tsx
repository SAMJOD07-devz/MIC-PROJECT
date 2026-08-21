"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
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
  const [activeTab, setActiveTab] = useState<"events" | "tickets" | "organizer" | "scanner">("events");
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
      }
    } catch (err) {
      console.error("Session check error:", err);
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
      setActiveTab("events");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh] text-xs text-slate-400">
            Loading OrbitCheck System...
          </div>
        ) : (
          <>
            {/* View Switcher based on Active Tab */}
            {activeTab === "scanner" && user?.role === "ORGANIZER" ? (
              <CameraScanner />
            ) : user?.role === "ORGANIZER" ? (
              <OrganizerView />
            ) : (
              <AttendeeView />
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">OrbitCheck System</span>
            <span>— MIC Recruitment Event Management</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Server Concurrency Protected</span>
            <span>•</span>
            <span>IndexedDB Offline Outbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
